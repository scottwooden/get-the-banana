define([
  'globals',
  'views/views.master',
  'spin',
], function(Globals, Master, Spinner){

  return Master.extend({ 

    className: "load-overlay row col",

    initialize: function(options){

  		this._super();

      this.addSpinner();

    },

    addSpinner: function(){

      var options = {
        lines: 13,
        length: 0,
        width: 9,
        radius: 22,
        color: '#FFF',
        shadow: false,
        hwaccel: true,
        speed: 1.8,
        zIndex: 2e9,
        top: '50%',
        left: '50%'
      };

      var spinner = new Spinner(options).spin();
      this.$el.append(spinner.el);

    },

    fadeIn: function(){

      this.$el.stop().fadeIn();

    },

    fadeOut: function(){

      var self = this;

      this.$el.fadeOut(function(){
        self.remove();
      });

    },

  });

});