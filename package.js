Package.describe({
    name: '255kb:meteor-status',
    version: '1.5.0',
    summary: 'Meteor Status automatically alerts users when the connection to the server has been lost.',
    git: 'https://github.com/255kb/meteor-status',
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.0');
    api.use(['templating', 'tracker', 'reactive-var'], 'client');
    api.addFiles(['client/meteor-status.html', 'client/meteor-status.js', 'client/i18n.js', 'client/meteor-status.css'], 'client');
});