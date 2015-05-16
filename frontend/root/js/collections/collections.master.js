define([
  'backbone'
], function(Backbone){

  return Backbone.Collection.extend({

    initialize: function(){

      // set is fetching flag to false when the collection is no longer fetching data
      this.on('sync reset', function(){
        this.isFetching = false;
      });

      return this._super();

    },

    // Returns true if any models have been changed or added
    hasChanged: function(){

      return this.some(function(model){
        return model.isNew() || model.hasChanged();
      });

    },

    fetch: function(options){

      // disable any requests that already exist for this collection
      if(this._req){
        this._req.abort();
        delete this._req;
      }

      // set is fetching flag to false when the collection is fetching data
      this.isFetching = true;

      // recored the request agains the collection for reference later
      this._req = this._super(options);

      return this._req;

    },

    search: function(attr, string){

      if(!string) return this.toJSON();

      var models = [],
      regex = new RegExp(string, "i");

      this.each(function(model){

        if(model.get(attr).match(regex)){
          models.push(model.toJSON());
        }

      });

      return models;

    },

  });

});