Package.describe({
    name: 'wiserweb:meteor-status',
    version: '1.5.0',
    summary: 'Meteor Status alerts users when the connection to the server has been lost. Forked from 255k:meteor-status.',
    git: 'https://github.com/wiserweb/meteor-status',
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.0');
    api.use(['templating', 'tracker', 'reactive-var', 'session'], 'client');
    api.addFiles(['client/meteor-status.html', 'client/meteor-status.js', 'client/i18n.js', 'client/meteor-status.css'], 'client');
});