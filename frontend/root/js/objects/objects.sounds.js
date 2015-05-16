define([
  'objects/objects.master',
  ], function(Master){

    return Master.extend({

      sounds: [
        { src: "correct_1.mp3", id: "correct" },
        { src: "Game-over-sound-effect.mp3", id: "lose" },
        { src: "Jackpot.wav", id: "win" },
        { src: "Wrong Answer 2.wav", id: "incorrect" }
      ],

      loadSounds: function(){
        
        var deferred = $.Deferred();

        var loadedAll = _.after(this.sounds.length, function(){
          deferred.resolve();
        });

        createjs.Sound.on("fileload", loadedAll);

        createjs.Sound.registerSounds(this.sounds, "audio/");

        return deferred;

      },

      play: function(id){

        createjs.Sound.play(id, { interrupt: createjs.Sound.INTERRUPT_ANY });

      },

    });

});