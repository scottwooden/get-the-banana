requirejs.config({

  paths: {

    // Libs
    "jquery": "../../lib/jquery/dist/jquery.min",
    "underscore": "../../lib/underscore/underscore-min",
    "backbone": "../../lib/backbone/backbone",
    "backbone-super": "../../lib/backbone-super/backbone-super/backbone-super-min",
    "jquery-mobile-events": "../../lib/jQuery-Mobile-Events/src/jquery.mobile-events.min",
    "text": "../../lib/requirejs-text/text",
    "json": '../../lib/requirejs-plugins/src/json',
    "annyang": '../../lib/annyang/annyang',
    "soundJS": '../../lib/SoundJS/lib/soundjs-0.6.1.min',
    "spin": '../../lib/spin.js/spin',
    
  },

  shim: {
    "underscore": { exports: "_" },
    "jquery": { exports: "$" },
    "jquery-mobile-events": { deps: ["jquery"] },
    "backbone": { exports: "Backbone", deps: ["underscore", "jquery"] },
    "annyang": { exports: "annyang" },
    "soundJS": { exports: "createjs" }
  }
  
});