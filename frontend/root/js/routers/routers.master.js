define([
  'globals',
  'backbone'
], function(Globals, Backbone){

  return Backbone.Router.extend({

    currentRoute: "",
    defaultRoute: "home",
    activeCollection: null,

    initialize: function(){

      this.on('route', this.routeChanged, this);
      return this;

    },

    routeChanged: function(event, route){

      route = window.location.hash.substr(1);

      this.currentRoute = route;

      if(!this.newPage.view) return;

      this.render();

    },

    setTitle: function(){

      document.title = this.currentRoute;

    },

    render: function(){
      
      $('#content').html(this.newPage.view.$el);

      this.newPage.view.render();

      this.setTitle();

      if(!this.activePage){

        this.activePage = this.newPage.view;

        this.activePage.show();

        return;

      }

      this.activePage.remove();

      this.activePage = this.newPage.view;

      delete this.newPage;

      this.activePage.show();


    },

    navigate: function(fragment, options){

      options = _.extend({}, {
        trigger: true
      }, options);


      this._super( fragment, options );

    },

    getBaseRoute: function(prefix, route){

      route = route || this.currentRoute;

      prefix = prefix || "";

      // Extract everything before first '/' character (if any) to get 'base route'
      var baseRoute = route.substr(0, route.indexOf(prefix + '/'));
      if(baseRoute.length < 1) baseRoute = route;
      return baseRoute;

    }

  });

});