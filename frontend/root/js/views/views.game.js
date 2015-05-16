define([
  'globals',
  'views/views.master',
  'text!templates/game.html',
  'text!templates/game-content.html',
  'text!templates/game-trail.html',
], function(Globals, Master, template, contentTemplate, trailTemplate){

  return Master.extend({

    templates: {
      'main': template,
      'content': contentTemplate,
      'trail': trailTemplate
    },

    events: {
    	'click .start-overlay .start': 'clickStart',
      'keydown .answer-input': 'inputKeydown'
    },

    initialize: function(){

    	this._super();

    },

    render: function(){

        this._super();

        this.$content = this.$('.player-current-word');
        this.$trail = this.$('.player-one-word-trail ul');

    },

    clickStart: function(e){

    	var self = this;

    	e.preventDefault();

    	var username = $('#user-name-input').val();

    	if(username.length != 0) {

    		// Globals.User.set('username', username);)
    		// Globals.User.save();

    		// If user name stored start game
    		$('.contain').fadeOut(200, function(){

    			$('#user-name').html(username);
    			self.countdown();
    			
    		});

    	} else {
    		alert('Enter a name!');
    	}

    },

    inputKeydown: function(e){

      if(e.which !== 13) return;

      var value = $(e.currentTarget).val();

      var word = Globals.User.word.last();            

      word.checkLink(value);

    },

    countdown: function() {

    	var self = this;

        $('.start-overlay').fadeOut(100);
        return self.refreshWord();


    	var countdown = 2;
    	$('.countdown').show();
    	setInterval(function(){

    		$('.countdown').html(countdown);
    		countdown--;

    		if (countdown == -1) {

    			$('.start-overlay').fadeOut(100);
    			self.refreshWord();

    		}

    	}, 1000);

    },

    refreshWord: function(){

        $('body').animate({ 'scrollTop': 0 });

    	var self = this;
        var word = Globals.User.words.last();

        word.fetch().done(function(){
        	self.renderContent();
            self.renderWordTrail();
            // self.updateSpeechEvents();
        });


    }, 

    renderContent: function(word) {

        var self = this;

        var data = Globals.User.words.last().toJSON();

        this.$content.html(this.templates.content({ data: data }));

        this.$('.test-links li').on('click', function(){
            var item = $(this).html();
            self.selectWord(item);
        });

    }, 

    renderWordTrail: function(){

        var data = {
            trail: Globals.User.getTrail()
        };

        this.$trail.html(this.templates.trail({ data: data }))

    },

    updateSpeechEvents: function(){

      var recognition = new webkitSpeechRecognition();
      // recognition.continuous = true;
      // recognition.interimResults = true;

      recognition.start();

      var sentence = [];

      recognition.onresult = function(event) {

        console.log("event.results", event.results);

        for (var i = event.resultIndex; i < event.results.length; ++i) {

          var string = _.reduce(event.results, function(string, item){
            return string + " " + item[0].transcript
          }, "");

          console.log("string", string);

          // sentence.push(event.results[i][0].transcript);
          // console.log(event.results[i][0].transcript);
          // if(event.results[i].isFinal) console.log(sentence.join(" "));
          // if (event.results[i].isFinal){
          //   final_transcript += event.results[i][0].transcript;
          //   final_transcript = final_transcript.split(' ');
          //   console.log(final_transcript);
          //   console.log(self.wordChecker(final_transcript, word));
          // }
        }

      };

      recognition.onend = function() { 

        recognition.stop();
        recognition.start();
        console.log("done");

      }

    },

    selectWord: function(word){

        Globals.User.words.add({ title: word });
        this.refreshWord();

    },

    listen: function(word) {

    	var self = this;

    	var final_transcript = '';
    	
    	var recognition = new webkitSpeechRecognition();
			recognition.continuous = true;
	  		recognition.interimResults = true;

  		recognition.onresult = function(event) { 
  		  console.log(event) 
  		}
  		recognition.start();

  		recognition.onresult = function(event) {

  		    var interim_transcript = '';
  		    if (typeof(event.results) == 'undefined') {
  		      recognition.onend = null;
  		      recognition.stop();
  		      upgrade();
  		      return;
  		    }
  		    for (var i = event.resultIndex; i < event.results.length; ++i) {
  		      if (event.results[i].isFinal) {
  		        final_transcript += event.results[i][0].transcript;
  		        final_transcript = final_transcript.split(' ');
  		        console.log(final_transcript);
  		        console.log(self.wordChecker(final_transcript, word));
  		      }
  		    }

  		};

    }

  });

});
