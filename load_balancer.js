const http = require('http');
const registry = require('./registry');
const { roundRobin, randomChoice, leastConnections } = require('./algorithms');

const PORT = 8080;
const HEALTH_CHECK_INTERVAL = 5000;

const algorithm = process.argv[2] || 'roundRobin';
if(algorithm!='roundRobin' && algorithm!='randomChoice' && algorithm!='leastConnections'  ){
    console.log("kindly choose a correct algorithm")
    return
}
console.log(`Using load balancing algorithm: ${algorithm}`);

const serverLoad = {}; // Used for leastConnections

function getServer() {
    const servers = registry.getServers();
    switch (algorithm) {
        case 'roundRobin':
            return roundRobin(servers);
        case 'randomChoice':
            return randomChoice(servers);
        case 'leastConnections':
            return leastConnections(servers, serverLoad);
        default:
            console.warn("Invalid algorithm. Defaulting to roundRobin.");
            return roundRobin(servers);
    }
}
function printServerLoad() {
    console.log("\n📊 Current Server Load:");
    for (const [server, load] of Object.entries(serverLoad)) {
        console.log(`${server} => ${load} active connection(s)`);
    }
    console.log();
}

async function forwardRequest(req, res) {
    const servers = registry.getServers();
    const target = getServer();

    if (!target) {
        res.writeHead(503, { "Content-Type": "text/plain" });
        return res.end("No available servers");
    }

    
    if (algorithm === 'leastConnections') {
        serverLoad[target] = (serverLoad[target] || 0) + 1;
    }

    try {
        const proxyRes = await fetch(target + req.url, {
            method: req.method,
            headers: req.headers,
        });

        const body = await proxyRes.text();

        res.writeHead(proxyRes.status, {
            "Content-Type": proxyRes.headers.get("content-type") || "text/plain",
        });
        res.end(body);
    } catch (err) {
        res.writeHead(502, { "Content-Type": "text/plain" });
        res.end("Bad Gateway");
    } finally {
        if (algorithm === 'leastConnections') {
            serverLoad[target] = Math.max(0, (serverLoad[target] || 1) - 1);
        }
    }
}

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/register') {
        let body = '';
        req.on('data', chunk => (body += chunk));
        req.on('end', () => {
            try {
                const { url } = JSON.parse(body);

                if (!url) {
                    res.writeHead(400);
                    return res.end('Missing URL');
                }

                registry.addServer(url);
                serverLoad[url] = 0;
                res.writeHead(200);
                res.end('Server registered');
            } catch (err) {
                res.writeHead(400);
                res.end('Invalid JSON');
            }
        });
    } else if (req.method === 'GET' && req.url === '/servers') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(registry.getServers()));
    }else if (req.method === 'GET' && req.url === '/server-load') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(serverLoad, null, 2));
        printServerLoad(); 
    } else {
        forwardRequest(req, res);
    }
});

function healthCheckLoop() {
    setInterval(async () => {
        console.log("Running health checks...");
        let servers = registry.getServers();

        for (const url of servers) {
            try {
                const res = await fetch(`${url}/health`);
                if (!res.ok) throw new Error(`Bad response: ${res.status}`);
                console.log(`${url} is healthy`);
            } catch (err) {
                console.log(`${url} is unhealthy, removing`);
                registry.removeServer(url);
                if (serverLoad[url]) delete serverLoad[url];
            }
        }

        servers = registry.getServers();
        console.log(`Available servers:`);
        console.log(servers);
    }, HEALTH_CHECK_INTERVAL);
}

server.listen(PORT, () => {
    console.log(`Load balancer running on http://localhost:${PORT}`);
});

healthCheckLoop();
