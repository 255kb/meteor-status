Session.setDefault('meteorStatusNextRetry', 0);

var updateCountdown = function() {
    Session.set('meteorStatusNextRetry', Math.round((Meteor.status().retryTime - (new Date()).getTime()) / 1000));
};
var updateCountdownTimeout;

Template.meteorStatus.helpers({
    getRetryDelay: function() {
        return Session.get('meteorStatusNextRetry');
    }
});
Template.meteorStatus.events({
    'click a.retry': function() {
        if(Meteor.status().status !== 'connecting') {
            Meteor.reconnect();
        }
        return false;
    }
});

Tracker.autorun(function() {
    var status = Meteor.status();
    if(!status.connected){
        $('.meteor-status').addClass('meteor-status-shown').fadeIn(300, 'linear');
    } else {
        $('.meteor-status').fadeOut(300, 'linear').removeClass('meteor-status-shown');
    }

    if(status.status === 'waiting') {
        updateCountdownTimeout = Meteor.setInterval(updateCountdown, 1000);
    } else {
        Session.set('meteorStatusNextRetry', 0);
        Meteor.clearInterval(updateCountdownTimeout);
    }
});