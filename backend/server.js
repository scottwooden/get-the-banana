var Hapi = require("hapi");
var colors = require('colors');

/* Create a server */
var server = new Hapi.Server(8000);

/* Serve public files */
server.route({
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: {
        path: 'frontend',
        listing: true,
        index: true
    }
  }
});

server.start();

console.log(colors.green("Started server"));

module.exports = server;

