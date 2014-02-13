App = Ember.Application.create({
  LOG_ACTIVE_GENERATION: true,
  LOG_TRANSITIONS: true
});

App.Router.map(function() {
  this.resource('messages');
});

App.MessagesRoute = Ember.Route.extend({
  activate: function() {
    if (! this.eventSource) {
      this.eventSource = new EventSource('/messages/events');

      var self = this;
      this.eventSource.addEventListener('message', function(e) {
        var data = $.parseJSON(e.data);
        if (data.id != self.controllerFor('messages').get('savedId')) {
          self.store.createRecord('message', data);
        }
      });
    }
  },
  model: function() {
    return this.store.find('message');
  }
});

App.ApplicationController = Ember.Controller.extend({
  init: function() {
    this.transitionToRoute('messages');
  }
});

App.MessagesController = Ember.ArrayController.extend({
  actions: {
    create: function() {
      var data = this.getProperties('body');
      var message = this.store.createRecord('message', data);
      var self = this;
      message.save().then(function (response) {
        console.log("Record saved");
        self.set('savedId', response.id);
        self.set('body', '');
      }, function (response) {
        self.set('errors', response.responseJSON.errors);
      });
    }
  }
});

App.Message = DS.Model.extend({
  body: DS.attr('string')
});
