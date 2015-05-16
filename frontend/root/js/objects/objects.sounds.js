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

      initialize: function(){

        this.registerSounds();

      },

      registerSounds: function(){
        
        createjs.Sound.alternateExtensions = ["mp3"];    // if the passed extension is not supported, try this extension

        createjs.Sound.on("fileload", function(){
          console.log("done");
        }); 

        createjs.Sound.registerSounds(this.sounds, "audio/");

      },

      play: function(id){

        createjs.Sound.play(id, { interrupt: createjs.Sound.INTERRUPT_ANY });

      },

    });

});