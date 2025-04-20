const servers = new Set();

module.exports={
    addServer(url){
        if(!servers.has(url)){
            servers.add(url);
            console.log(`Server ${url} registered successfully`);
        }else{
            console.log(`Server already registered`);
        }
    },
    removeServer(url){
        if (servers.has(url)) {
            servers.delete(url);
            console.log(`Server removed: ${url}`);
        }
    },
    getServers(){
        return Array.from(servers);
    }
}
