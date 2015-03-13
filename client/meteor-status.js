Session.setDefault('meteorStatusNextRetry', 0);
Session.setDefault('meteorStatusIsOffline', false);

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

    // check if voluntarily offline
    if(status.status === 'offline') {
        Session.set('meteorStatusIsOffline', true);
    } else if(status.status === 'failed' || status.status === 'waiting') {
        Session.set('meteorStatusIsOffline', false);
    }

    if(!status.connected && Session.equals('meteorStatusIsOffline', false)){
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