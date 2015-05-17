define([
  'globals',
  'views/views.master',
  'text!templates/result.html',
], function(Globals, Master, template){

  return Master.extend({

    templates: {
      'main': template
    },

    initialize: function(options){

    	var defaults = {
    		status: "win"
    	};

    	options = _.extend(defaults, options);
    	console.log(options);
    	this.status = options.status;

  		return this._super();

    },

    render: function(){

    	this._super({
    		status: this.status,
    		score: Globals.User.get("score")
    	});

    },

  });

});