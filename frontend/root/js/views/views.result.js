define([
  'globals',
  'views/views.master',
  'text!templates/result.html',
], function(Globals, Master, template){

  return Master.extend({

    events: {
      'click .btn-primary': 'buttonClick'
    },  

    templates: {
      'main': template
    },

    initialize: function(options){

    	var defaults = {
    		status: "win"
    	};

    	options = _.extend(defaults, options);
    	this.status = options.status;

  		return this._super();

    },

    render: function(){

      var route = Globals.User.getTrail();
      if(this.status == "win") route.push("Banana");

    	this._super({
    		status: this.status,
    		score: Globals.User.get("score"),
        route: route
    	});

    },

    buttonClick: function(){

      Globals.User.clear();

    },

  });

});