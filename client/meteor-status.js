Template.meteorStatus.onCreated(function () {
    var instance = this;

    instance.updateCountdownTimeout;
    instance.nextRetry = new ReactiveVar(0);
    instance.options = {
        style: true,
        lang: 'en',
        position: 'bottom'
    };
    instance.firstConnection = new ReactiveVar(true);

    //get template options
    if(Template.currentData()) {
        //set style
        if(Template.currentData().style !== undefined) {
            instance.options.style = Template.currentData().style;
        }
        //set language
        if(Template.currentData().lang !== undefined) {
            instance.options.lang = Template.currentData().lang;
        }
        //set positioning
        if(Template.currentData().position !== undefined) {
            instance.options.position = Template.currentData().position;
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
        return meteorStatusI18n[Template.instance().options.lang].disconnected.replace('%delay%', Template.instance().nextRetry.get());
    },
    langRetryLink: function() {
        return meteorStatusI18n[Template.instance().options.lang].retry;
    },
    isStyled: function() {
        return Template.instance().options.style;
    },
    position: function () {
        if(Template.instance().options.position === 'top') {
            return 'meteor-status-top';
        }
        return 'meteor-status-bottom';
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