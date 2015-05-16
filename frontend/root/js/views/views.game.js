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
    	'click .start-overlay .start': 'clickStart'
    },

    initialize: function(){

    	this._super();

    },

    render: function(){

        this._super();

        this.$content = this.$('.player-current-word');
        this.$trail = this.$('.player-one-word-trail');

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

        // // Grab links
        // var data = {
        //  "title": "Albert Einstein",
        //  "image": "http://cp91279.biography.com/1000509261001/1000509261001_1097479514001_Bio-Biography-Albert-Einstein-SF.jpg",
        //  "links": ["Banana", "Apple"]
        // };

        $('body').animate({ 'scrollTop': 0 });

    	var self = this;
        var word = Globals.User.words.last();

        word.fetch().done(function(){
        	self.renderContent();
            self.renderWordTrail();
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

    },

    wordChecker: function(transcript, words) {

		    var output = [];
		    var cntObj = {};
		    var array, item, cnt;
		    // for each array passed as an argument to the function
		    for (var i = 0; i < arguments.length; i++) {
		        array = arguments[i];
		        // for each element in the array
		        for (var j = 0; j < array.length; j++) {
		            item = "-" + array[j];
		            cnt = cntObj[item] || 0;
		            // if cnt is exactly the number of previous arrays, 
		            // then increment by one so we count only one per array
		            if (cnt == i) {
		                cntObj[item] = cnt + 1;
		            }
		        }
		    }
		    // now collect all results that are in all arrays
		    for (item in cntObj) {
		        if (cntObj.hasOwnProperty(item) && cntObj[item] === arguments.length) {
		            output.push(item.substring(1));
		        }
		    }
		    return(output); 

    }

  });

});
