var nextRetry = new ReactiveVar(0);
var connectionStatus = new ReactiveVar(Meteor.status());
var isOffline = new ReactiveVar(false);
var isStyled = new ReactiveVar(true);
var currentLang = new ReactiveVar('en');

var updateCountdown = function() {
    nextRetry.set(Math.round((Meteor.status().retryTime - (new Date()).getTime()) / 1000));
};
var updateCountdownTimeout;

Template.meteorStatus.onCreated(function () {
    Tracker.autorun(function() {

        // check if voluntarily offline
        if(connectionStatus.status === 'offline') {
            isOffline.set(true);
        } else if(connectionStatus.status === 'failed' || connectionStatus.status === 'waiting') {
            isOffline.set(false);
        }

        /*if(!connectionStatus.connected && isOffline.get() === false){
            $('.meteor-status').addClass('meteor-status-shown').fadeIn(300, 'linear');
        } else {
            $('.meteor-status').fadeOut(300, 'linear').removeClass('meteor-status-shown');
        }*/

        if(connectionStatus.status === 'waiting') {
            updateCountdownTimeout = Meteor.setInterval(updateCountdown, 1000);
        } else {
            nextRetry.set(0);
            Meteor.clearInterval(updateCountdownTimeout);
        }
    });
});

Template.meteorStatus.onRendered(function () {
    if(Template.currentData()) {
        //set style
        if(Template.currentData().style !== undefined && Template.currentData().style === false) {
            isStyled.set(false);
        }
        //set language
        if(Template.currentData().lang !== undefined) {
            currentLang.set(Template.currentData().lang);
        }
    }
});

Template.meteorStatus.helpers({
    langDisconnected: function() {
        return meteorStatusI18n[currentLang.get()].disconnected.replace('%delay%', nextRetry.get());
    },
    langRetryLink: function() {
        return meteorStatusI18n[currentLang.get()].retry;
    },
    getRetryDelay: function() {
        return nextRetry.get();
    },
    isStyled: function() {
        return isStyled.get();
    },
    show: function () {
        if(!connectionStatus.connected && isOffline.get() === false){
            return true;
        } else {
            return false;
        }
    }
});
Template.meteorStatus.events({
    'click a.retry': function() {
        if(connectionStatus.status !== 'connecting') {
            Meteor.reconnect();
        }
        return false;
    }
});