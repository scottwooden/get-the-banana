define([
  'backbone',
], function(Backbone){

  return Backbone.View.extend({

    activeTemplate : 'main',

    events: {
      'click [data-navigate]' : 'navigate'
    },

  	initialize: function(){

      _.extend(this, Backbone.events);

      this._defaults();

      return this._super();

    },

    render: function(options){

      options = options || {};

      if(this.templates && this.templates[this.activeTemplate]){
        this.$el.html( this.templates[this.activeTemplate]({ data : options }));
      } else{
        this.$el.empty();
      }

      return this;

    },

    show: function(){

      this.$el.fadeIn(300);

    },

    hide: function(){

      var self = this;

      this.$el.fadeOut(300, function(){
        self.trigger('hidden');
      });

    },

    navigate: function(e){

      Router.navigate($(e.currentTarget).data('navigate'));

    },

    _defaults: function(){

      this._extendHelper('templates');
      this._extendHelper('events');
      this._cacheTemplates();

      // if($.isTouchCapable()) this._applyMobileEvents();

      this.delegateEvents();

    },

    _applyMobileEvents: function(){

      var self = this, events = {};

      _.each(this.events, function(value, key){

        var newKey = key.replace('click', 'tap')
        .replace('mousedown', 'tapstart')
        .replace('mouseup', 'tapend');

        events[newKey] = value;

      });

      this.events = events;

    },

    _extendHelper: function(item){

      var proto = this, result = {};

      // loop through each parent and extend its properties
      do {

        result = _.extend({}, proto[item], result);
        proto = proto.constructor.__super__;

      } while (proto[item]);

      if(result){

        this[item] = _.extend({}, result, this[item]);

      }

    },

    _cacheTemplates: function(){

      console.log("cahcing")

      if(!this.templates || _.isEmpty(this.templates)) return;

      for (var template in this.templates){
        if(_.isString(this.templates[template])){
          this.templates[template] = _.template(this.templates[template]);
        }
      }

    }

  });

});
