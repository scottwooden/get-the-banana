define([
  'globals',
  'views/views.master',
  'text!templates/splash.html',
], function(Globals, Master, template){

  return Master.extend({

    templates: {
      'main': template
    }, 

    initialize: function(){

      Globals.Sounds.play('start', { loop: -1 });

      return this._super();

    },

  });

});