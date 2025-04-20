const http = require("http")
const PORT= process.argv[2]

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
   }catch(err){
      console.error(`Failed to register ${url}:`, err.message);
   }
}
const createServers = (host, port) => {
   const server = http.createServer(async (req, res) => {
      if (req.url === '/health') {
         res.writeHead(200);
         return res.end("OK");
      }
      if (req.url === '/test') {
         console.log(`Request received on Port:${port} from ${req.url}`)
         await delay(1000); 
         res.writeHead(200, { "Content-Type": "text/plain" });
         return res.end(`Delayed response from port: ${port}`);
      }
      console.log(`Request received on Port:${port} from ${req.url}`)
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(`server response from port:${port}`)
   })
   server.listen(port, host, async () => {
      console.log(`listening on port ${port}`)
      await registerServer(`http://${host}:${port}`);
   })
}

for(let i=0;i<PORT;i++){
   let a=5000+i
   createServers('127.0.0.1', a);
}