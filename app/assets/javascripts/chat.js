App = Ember.Application.create({
  LOG_ACTIVE_GENERATION: true,
  LOG_TRANSITIONS: true
});

App.Router.map(function() {
  this.resource('messages');
});

App.MessagesRoute = Ember.Route.extend({
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
  init: function() {
    var source = new EventSource('/messages/events');

    source.addEventListener('message', function(e) {
      console.log(e.data);
    });
  },
  actions: {
    create: function() {
      var data = this.getProperties('body');
      var message = this.store.createRecord('message', data);
      var self = this;
      message.save().then(function () {
        console.log("Record saved");
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
