define([
  'backbone',
  ], function(Backbone){

    var object = function(){
      _.extend(this, Backbone.Events);
      if(this.initialize) this.initialize.apply(this, arguments);
    };

    object.extend = Backbone.View.extend;

    return object;

});