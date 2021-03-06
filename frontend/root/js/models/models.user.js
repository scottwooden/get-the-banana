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
      'Harry potter',
      'Hamster',
      'Art',
      'Horse',
      'Tutankhamun',
      'Sun',
      'Butterfly',
      'Milk float',
      'Snooker',
      'Vodka',
      'Roller coaster',
      'Party',
      'Facebook',
      'Alice in wonderland'
    ],

    initialize: function(){

      this.words = new WordsCollection();

      this.addStartWord();

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