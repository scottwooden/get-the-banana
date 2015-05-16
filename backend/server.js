var Hapi = require("hapi");

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

module.exports = server;

