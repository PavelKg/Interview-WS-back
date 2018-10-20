'use strict';
const app = require("./app")
const mode = process.env.NODE_ENV
const port = process.env.NODE_PORT

const typeServer = "http";

require(typeServer)
  .createServer(app)
  .listen(port);

console.log(`${typeServer} server running on ${port} in ${mode} mode`);    
