const http = require("http");
const PORT = process.argv[2];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const registerServer = async (url) => {
   try {
      const res = await fetch('http://127.0.0.1:8080/register', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ url })
      });
      const text = await res.text();
      console.log(`Registered ${url}: ${text}`);
   } catch (err) {
      console.error(`Failed to register ${url}:`, err.message);
   }
};

const MAX_CONCURRENT_REQUESTS = 10;
let currentActive = 0;
const requestQueue = [];

const processQueue = async () => {
   if (requestQueue.length === 0 || currentActive >= MAX_CONCURRENT_REQUESTS) return;

   const { req, res, port } = requestQueue.shift();
   currentActive++;

   if (req.url === '/health') {
      res.writeHead(200);
      res.end("OK");
   } else if (req.url === '/test') {
      console.log(`Processing request on port ${port}`);
      await delay(10000); // simulate work
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(`Handled by port: ${port}`);
   } else {
      console.log(`Received request on port ${port} at ${req.url}`);
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(`server response from port:${port}`);
   }

   currentActive--;
   processQueue(); // process next in queue
};

const createServers = (host, port) => {
   const server = http.createServer((req, res) => {
      requestQueue.push({ req, res, port });
      processQueue();
   });

   server.listen(port, host, async () => {
      console.log(`Listening on port ${port}`);
      await registerServer(`http://${host}:${port}`);
   });
};

createServers('127.0.0.1', PORT);
