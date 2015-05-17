define([
  'globals',
  'routers/routers.master',
  'views/views.splash',
  'views/views.game',
  'views/views.result',
], function(Globals, Master, SplashView, GameView, ResultView){

  return Master.extend({

    routes: {
      'splash' : "splash",
      'game' : "game",
      'result/(:status)' : "result",
      '*actions' : "splash"
    },

    splash: function(){
    
      this.newPage = {
        view: new SplashView()
      };

    },

    game: function(){
    
      this.newPage = {
        view: new GameView()
      };

    },

    result: function(status){
    
      this.newPage = {
        view: new ResultView({
          status: status
        })
      };

    }

  });

});