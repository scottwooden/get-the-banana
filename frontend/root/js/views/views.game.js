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
      'keydown .user-name-input': 'usernameKeydown',
      'keydown .input-answer': 'inputKeydown',
    },

    initialize: function(){

      this._super();

      if(!Globals.Sounds.current['start']){
        Globals.Sounds.play('start', { loop: -1 });
      }

      return this;

    },

    render: function(){

        this._super();

        this.$content   = this.$('.player-current-word');
        this.$trail     = this.$('.player-one-word-trail ul');
        this.$score     = this.$('#user-score');
        this.$timerText = this.$('.timer span');
        this.$hints     = this.$('.hints');
        this.$hintsList     = this.$hints.find('ul');

        this.addEvents();

    },

    addEvents: function(){

      this.listenTo(Globals.User, 'change:score', function(){
        this.updateScore();
      });

    },

    updateScore: function(){

      var score = Globals.User.get('score');
      this.$score.html(score);

    },

    clickStart: function(e){

    	var self = this;

    	e.preventDefault();

    	var username = $('#user-name-input').val();

    	if(username.length != 0) {

    		// Globals.User.set('username', username);)
    		// Globals.User.save();

        Globals.Sounds.stop('start', true);

  			$('#user-name').html(username);

        // If user name stored start game
        $('.contain').fadeOut(200, function(){

    			setTimeout(function(){
            self.countdown();
          }, 500)
    			
    		});

    	} else {
    		alert('Enter a name!');
    	}

    },

    inputKeydown: function(e){

      if(e.which !== 13) return;

      var value = $(e.currentTarget).val();
      var word = Globals.User.words.last();            

      if(!value) return;

      var match = word.checkLink(value);

      if(match){
        this.correctMessage(value);
        this.selectWord(match);
      } else {
        this.incorrectMessage(value);
      }

      $(e.currentTarget).val('');

    },

    usernameKeydown: function(e){

      if(e.which == 13) this.clickStart(e);

    },

    correctMessage: function(word){

      Globals.Sounds.play("correct");
      $('#correct-answer').html(word);
      $('.answer-feedback').toggleClass('active correct');

       setTimeout( function() { $('.answer-feedback').toggleClass('active correct'); }, 800);

    },

    incorrectMessage: function(word){

      Globals.Sounds.play("incorrect");
      $('#wrong-answer').html(word);
      $('.answer-feedback').toggleClass('active wrong');

      setTimeout( function() { $('.answer-feedback').toggleClass('active wrong'); }, 800);

    },

    winningTrigger: function(){

      var self = this;
      Globals.Sounds.play("win");
      $('.answer-feedback').removeClass('correct active').addClass('active win');
      setTimeout( function() { Globals.Router.navigate("result/win");}, 2000);

    },

    gameOver: function() {

      var self = this;
      Globals.Sounds.play("lose");
      setTimeout( function() { Globals.Router.navigate("result/lose");}, 500);

    },

    countdown: function() {

    	var self = this;

        // $('.start-overlay').fadeOut(100);
        // return self.refreshWord();

      Globals.Sounds.play("countdown");

    	var countdown = 2;

    	$('.countdown').show();

    	var timer = setInterval(function(){

    		$('.countdown').html(countdown || "GO!");
    		countdown--;

    		if (countdown == -1) {

    			$('.start-overlay').fadeOut(100, function(){

            clearInterval(timer);
            
          });
          self.refreshWord();

    		}

    	}, 1000);

    },

    refreshWord: function(){

        this.$hints.removeClass('active');
        this.$content.removeClass('next active');

    	  var self = this;
        var word = Globals.User.words.last();

        word.fetch().done(function(){

          self.renderContent();
          self.renderWordTrail();
          self.updateSpeechEvents();
          self.$timerText.html('GET TO BANANA FROM ' + word.get("title"));
        
        });

        this.resetCountdown();

    }, 

    resetCountdown: function() {

        var self = this;

        if(this.hintsInterval) clearInterval(this.hintsInterval);

        Globals.Sounds.stop("rush");

        $('.timer .inner').stop().css({"width": "100%"});

        $('.timer .inner').animate({'width': 0}, 30000, 'linear', function(){

            self.gameOver();

        });

        this.hintsInterval = setInterval(function(){

          clearInterval(self.hintsInterval);
          Globals.Sounds.play("rush");
          self.updateHints();

          self.hintsInterval = setInterval(function(){
            self.updateHints();
          }, 3000);

        }, 15000);

    },

    renderContent: function(word) {

        var self = this;
        var data = Globals.User.words.last().toJSON();

        this.$content.html(this.templates.content({ data: data }));
        this.$content.addClass('active');


    }, 

    renderWordTrail: function(){

        var data = {
            trail: Globals.User.getTrail()
        };

        this.$trail.html(this.templates.trail({ data: data }))

    },

    updateSpeechEvents: function(){

    },

    updateHints: function(){

      if(this.$hintsList[0].children.length > 10){
        if(this.hintsInterval) clearInterval(this.hintsInterval);
        return;
      }

      this.$hints.addClass('active');

      var word = Globals.User.getCurrentWord();

      this.$hintsList.append("<li>" + word.getHint() + "</li>")

    },

    clearHints: function(){

      this.$hints.removeClass('active');
      this.$hintsList.empty();

    },

    selectWord: function(word){

        this.$content.addClass('next');

        this.clearHints();

        Globals.User.increment("score");
        
        if(word == 'Banana') {
          
            this.winningTrigger();
        
        } else {

            Globals.User.words.add({ title: word });
            this.refreshWord();
            
        }

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
