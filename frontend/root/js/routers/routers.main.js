define([
  'globals',
  'routers/routers.master',
  'views/views.home',
], function(Globals, Master, Home){

  return Master.extend({

    routes: {
      '*actions' : "home"
    },

    home: function(){
    
      this.newPage = {
        view: new Home()
      };

    }

  });

});