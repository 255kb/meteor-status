var meteorStatusNextRetry = new ReactiveVar(0);
var meteorStatusIsOffline = new ReactiveVar(false);
var meteorStatusIsStyled = new ReactiveVar(true);
var meteorStatusCurrentLang = new ReactiveVar('en');

var updateCountdown = function() {
    meteorStatusNextRetry.set(Math.round((Meteor.status().retryTime - (new Date()).getTime()) / 1000));
};
var updateCountdownTimeout;

Template.meteorStatus.onRendered(function () {
    if(Template.currentData()) {
        //set style
        if(Template.currentData().style !== undefined && Template.currentData().style === false) {
            meteorStatusIsStyled.set(false);
        }
        //set language
        if(Template.currentData().lang !== undefined) {
            meteorStatusCurrentLang.set(Template.currentData().lang);
        }
    }
});

Template.meteorStatus.helpers({
    langDisconnected: function() {
        return meteorStatusI18n[meteorStatusCurrentLang.get()].disconnected.replace('%delay%', meteorStatusNextRetry.get());
    },
    langRetryLink: function() {
        return meteorStatusI18n[meteorStatusCurrentLang.get()].retry;
    },
    getRetryDelay: function() {
        return meteorStatusNextRetry.get();
    },
    isStyled: function() {
        return meteorStatusIsStyled.get();
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
        meteorStatusIsOffline.set(true);
    } else if(status.status === 'failed' || status.status === 'waiting') {
        meteorStatusIsOffline.set(false);
    }

    if(!status.connected && meteorStatusIsOffline.get() === false){
        $('.meteor-status').addClass('meteor-status-shown').fadeIn(300, 'linear');
    } else {
        $('.meteor-status').fadeOut(300, 'linear').removeClass('meteor-status-shown');
    }

    if(status.status === 'waiting') {
        updateCountdownTimeout = Meteor.setInterval(updateCountdown, 1000);
    } else {
        meteorStatusNextRetry.set(0);
        Meteor.clearInterval(updateCountdownTimeout);
    }
});