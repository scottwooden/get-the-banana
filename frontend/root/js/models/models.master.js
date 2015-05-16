define([
  'backbone'
], function(Backbone){

  return Backbone.Model.extend({

    increment: function(attr){

      this.set(attr, this.get(attr) + 1);

    },

    decrement: function(attr){

      this.set(attr, this.get(attr) - 1);
        
    }

  });

});