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
      "collections": "collections",
      "objects": "objects",
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
    'objects/objects.sounds',
    'backbone-super',
    'annyang',
    'soundJS',
  ], function(Globals, $, _, Backbone, Router, UserModel, SoundObject){

    window.Globals = Globals;

    Globals.Router = new Router();

    Globals.Events = _.extend({}, Backbone.Events);

    Globals.User = new UserModel();

    Globals.Sounds = new SoundObject();

    Globals.Sounds.loadSounds().done(function(){

      Backbone.history.start({ pushState: false });
      
    });


  });

});
