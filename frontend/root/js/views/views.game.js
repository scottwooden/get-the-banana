define([
  'globals',
  'views/views.master',
  'text!templates/game.html',
], function(Globals, Master, template){

  return Master.extend({

    templates: {
      'main': template
    },

  });

});