define([
  'objects/objects.master',
  ], function(Master){

    return Master.extend({

      sounds: {
          { src:"asset0.ogg", id:"example" },
          { src:"asset1.ogg", id:"1" },
          { src:"asset2.mp3", id:"works" }
      },

      initialize: function(){

        this.registerSounds();

      },

      registerSounds: function(){
        
        createjs.Sound.alternateExtensions = ["mp3"];    // if the passed extension is not supported, try this extension

        createjs.Sound.on("fileload", function(){
          console.log("done");
        }); 

        createjs.Sound.registerSounds(sounds, assetPath);

      },

      play: function(id){

        createjs.Sound.play(id, { interrupt: createjs.Sound.INTERRUPT_ANY });

      },

    });

});