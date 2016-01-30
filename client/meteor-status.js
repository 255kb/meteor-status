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
        linkText: '',
        overlay: false
    };
    instance.firstConnection = new ReactiveVar(true);

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

    //do not alert on first connection to avoid meteor status flashing
    Tracker.autorun(function(computation) {
        if(Meteor.status().connected && Meteor.status().status === 'connected') {
            instance.firstConnection.set(false);
            computation.stop();
        }
    });
});

Template.meteorStatus.helpers({
    langDisconnected: function() {
        if(Template.instance().options.msgText) {
            return Template.instance().options.msgText.replace('%delay%', Template.instance().nextRetry.get());
        } else {
            return meteorStatusI18n[Template.instance().options.lang].disconnected.replace('%delay%', Template.instance().nextRetry.get());
        }
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
        //only show alert after the first connection attempt, if disconnected, if not manually disconnected (status == 'offline), if at least second retry
        if(!Template.instance().firstConnection.get() && !Meteor.status().connected && Meteor.status().status !== 'offline' && Meteor.status().retryCount > 1){
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