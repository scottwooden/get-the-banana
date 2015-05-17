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
      'Scrotum',
      'File system',
      'Tutankhamun',
      'Feces',
      'Butterfly',
      'Elevator',
      'Milk float',
    ],

    initialize: function(){

      this.words = new WordsCollection();

      this.words.add({
        title: _.sample(this.startWords)
      });

      this._super();

    },

    getTrail: function(){

      return this.words.pluck('title');

    },

    getCurrentWord: function(){

      return this.words.last();

    },

    clear: function(options){

      this.words.reset();

      return this._super(options);

    },
    
  });

});