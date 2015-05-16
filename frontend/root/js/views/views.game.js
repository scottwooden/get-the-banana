define([
  'globals',
  'views/views.master',
  'text!templates/game.html',
], function(Globals, Master, template){

  return Master.extend({

    templates: {
      'main': template
    },

    events: {
    	'click .start-overlay .start': 'clickStart'
    },

    initialize: function(){

    	this._super();

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

    	var countdown = 2;
    	$('.countdown').show();
    	setInterval(function(){

    		$('.countdown').html(countdown);
    		countdown--;

    		if (countdown == -1) {

    			$('.start-overlay').fadeOut(100);
    			self.startGame();

    		}

    	}, 1000);

    },

    startGame: function() {

    	var self = this;
    	// Grab links
    	var data = {
    		"title": "Albert Einstein",
    		"image": "http://cp91279.biography.com/1000509261001/1000509261001_1097479514001_Bio-Biography-Albert-Einstein-SF.jpg",
    		"links": ["Banana", "Apple"]
    	};

    	self.levelBuild(data);

    }, 

    levelBuild: function(data) {

    	var self = this;

    	$('#word-title').html(data.title);
    	$('#word-image').attr('src', data.image);
    	$('#word-links').val(data.links);

    	self.listen(data.links);

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
