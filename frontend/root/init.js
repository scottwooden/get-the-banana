require([
  // Shared config
  '../config'
], function(){

  // Specific config
  require.config({

    baseUrl: "./js",

    paths: {
      "templates": "../templates",
      "views": "views",
      "models": "models",
    }

  });

  // Start app
  requirejs([
    'globals',
    // Libs
    'jquery',
    'underscore',
    'backbone',
    // Initialize scripts
    'routers/routers.main',
    'backbone-super',
  ], function(Globals, $, _, Backbone, Router){

    Globals.Router = new Router();

    Globals.Events = _.extend({}, Backbone.Events);

    Backbone.history.start({ pushState: false });

  });

});
