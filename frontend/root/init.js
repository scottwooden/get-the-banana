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
    'models/models.user',
    'backbone-super',
    'annyang',
  ], function(Globals, $, _, Backbone, Router, UserModel){

    window.Globals = Globals;

    Globals.Router = new Router();

    Globals.Events = _.extend({}, Backbone.Events);

    Globals.User = new UserModel();

    Backbone.history.start({ pushState: false });

  });

});
