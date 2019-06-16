Package.describe({
  name: 'treenity:meteor-astronomy-treenity-modules',
  version: '1.0.0',
  summary: 'Treenity modules for Meteor Astronomy',
  git: 'https://github.com/jagi/meteor-astronomy-slug-behavior.git'
});

Npm.depends({
  lodash: '4.17.2'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');

  api.use([
    'ecmascript',
    'es5-shim',
    'jagi:astronomy@2.5.8'
  ], ['client', 'server']);

  api.mainModule('index.js', ['client', 'server']);
  // api.mainModule('server.js', ['server']);
});
