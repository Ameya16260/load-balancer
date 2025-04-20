let roundRobinIndex = 0;

const roundRobin = (servers) => {
  if (servers.length === 0) return null;
  const server = servers[roundRobinIndex];
  roundRobinIndex = (roundRobinIndex + 1) % servers.length;
  return server;
};

const randomChoice = (servers) => {
  if (servers.length === 0) return null;
  const index = Math.floor(Math.random() * servers.length);
  return servers[index];
};

const leastConnections = (servers, serverLoad) => {
  if (servers.length === 0) return null;
  let minLoad = Infinity;
  let selectedServer = null;
  for (const server of servers) {
    const load = serverLoad[server] || 0;
    if (load < minLoad) {
      minLoad = load;
      selectedServer = server;
    }
  }
  return selectedServer;
};

module.exports = {
  roundRobin,
  randomChoice,
  leastConnections,
};
