define([
  'globals',
  'views/views.master',
  'text!templates/result.html',
], function(Globals, Master, template){

  return Master.extend({

    templates: {
      'main': template
    },

  });

});