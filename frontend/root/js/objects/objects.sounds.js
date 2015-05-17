define([
  'objects/objects.master',
  ], function(Master){

    return Master.extend({

      sounds: [
        { src: "correct_1.mp3", id: "correct" },
        { src: "Game-over-sound-effect.mp3", id: "lose" },
        { src: "Jackpot.wav", id: "win" },
        { src: "Wrong Answer 2.wav", id: "incorrect" },
        { src: "Gameplay Countdown.mp3", id: "rush" },
        { src: "Game_Start_Countdown_02.mp3", id: "countdown" },
        { src: "Elevator Music.mp3", id: "start" }
      ],

      current: {},

      loadSounds: function(){
        
        var deferred = $.Deferred();

        var loadedAll = _.after(this.sounds.length, function(){
          deferred.resolve();
        });

        createjs.Sound.on("fileload", loadedAll);

        createjs.Sound.registerSounds(this.sounds, "audio/");

        return deferred;

      },

      play: function(id, options){

        if(this.current[id]) this.stop(id);

        this.current[id] = createjs.Sound.play(id, options);

      },

      stop: function(id, fade){

        if(this.current[id]){
          fade ? this.fadeOut(id) : this.current[id].stop().destroy();
          delete this.current[id];
        }

      },

      fadeOut: function(id){

        var self = this;

        if(this.current[id]){
          $(this.current[id]).animate({ volume: 0 }, 1000, function(){
            this.stop().destroy();
            delete self.current[id];
          });
        }

      },

      stopAll: function(){

        createjs.Sound.stop();
        this.current = {};

      }

    });

});