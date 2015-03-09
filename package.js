Package.describe({
    name: '255kb:meteor-status',
    version: '1.0.0',
    summary: 'Meteor Status automatically alerts users when the connection to the server has been lost.',
    git: 'https://github.com/255kb/meteor-status',
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.0');
    api.use(['templating', 'session', 'tracker', 'jquery'], 'client');
    api.addFiles(['client/meteor-status.html', 'client/meteor-status.js', 'client/meteor-status.css', 'client/body.html'], 'client');
});