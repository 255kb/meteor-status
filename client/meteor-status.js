Template.meteorStatus.onCreated(function () {
    var instance = this;

    instance.updateCountdownTimeout;
    instance.nextRetry = new ReactiveVar(0);
    instance.options = {
        style: true,
        lang: 'en',
        position: 'bottom',
        showLink: true,
        msgText: '',
        textDisconnect: '',
        textConnecting: '',
        linkText: '',
        overlay: false
    };

    //get template params
    if(Template.currentData()) {
        for(var property in instance.options) {
            if(Template.currentData()[property] !== undefined) {
                instance.options[property] = Template.currentData()[property];
            }
        }
    }

    //set tracker for retry delay
    Tracker.autorun(function() {
        //set nextRetry delay update
        if(Meteor.status().status === 'waiting') {
            instance.updateCountdownTimeout = Meteor.setInterval(function() {
                instance.nextRetry.set(Math.round((Meteor.status().retryTime - (new Date()).getTime()) / 1000));
            }, 1000);
        } else {
            instance.nextRetry.set(0);
            Meteor.clearInterval(instance.updateCountdownTimeout);
        }
    });
});

Template.meteorStatus.helpers({
    langMessage: function() {
        var lang = meteorStatusI18n[Template.instance().options.lang];

        //if connecting or 0 seconds until next retry show 'connecting' text
        if ((Meteor.status().status === 'connecting' || Template.instance().nextRetry.get() === 0)) {
            if (Template.instance().options.textConnecting) {
                return Template.instance().options.textConnecting;
            } else if (lang.connecting) {
                return lang.connecting;
            }
        } else {
            //keep msgText for backward compatibility
            var customDisconnectText = Template.instance().options.textDisconnect || Template.instance().options.msgText;
            if (customDisconnectText) {
                return customDisconnectText.replace('%delay%', Template.instance().nextRetry.get());
            }
        }

        return lang.disconnected.replace('%delay%', Template.instance().nextRetry.get());
    },
    langRetryLink: function() {
        if(Template.instance().options.linkText) {
            return Template.instance().options.linkText;
        } else {
            return meteorStatusI18n[Template.instance().options.lang].retry;
        }
    },
    isStyled: function() {
        return Template.instance().options.style;
    },
    showLink: function() {
        return Template.instance().options.showLink;
    },
    position: function () {
        if(Template.instance().options.overlay) {
            return 'meteor-status-overlay';
        } else {
            if(Template.instance().options.position === 'top') {
                return 'meteor-status-top';
            } else {
                return 'meteor-status-bottom';
            }
        }
    },
    show: function () {
        //only show alert if disconnected, if not manually disconnected (status == 'offline'), if at least second retry
        if(!Meteor.status().connected && Meteor.status().status !== 'offline' && Meteor.status().retryCount > 2){
            return true;
        }
        return false;
    }
});

Template.meteorStatus.events({
    'click a.meteor-status-retry': function() {
        if(Meteor.status().status !== 'connecting') {
            Meteor.reconnect();
        }
        return false;
    }
});