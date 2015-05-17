define([
  'models/models.master',
  'collections/collections.words'
], function(Master, WordsCollection){

  return Master.extend({

  	urlRoot: "api/users",

    defaults: {
      score: 0
    },

    startWords: [
      'Fruit',
      'Hamster',
      'Guitar',
      'Jazz',
      'Generative art',
      'File system',
      'Tutankhamun',
      'Feces',
      'Butterfly',
      'Elevator',
      'Milk float',
      'Guitar',
    ],

    initialize: function(){

      this.words = new WordsCollection();

      this.addStartWord();

      this.on('all', function(e){
        console.log("e", e);
      });

      return this._super();

    },

    addStartWord: function(){

      this.words.add({
        title: _.sample(this.startWords)
      });

    },

    getTrail: function(){

      return this.words.pluck('title');

    },

    getCurrentWord: function(){

      return this.words.last();

    },

    clear: function(options){

      this.words.reset();

      this.addStartWord();

      this._super(options);

      this.set(this.defaults);

    },
    
  });

});