Package.describe({
  name: 'treenity:astronomy',
  version: '1.0.0',
  summary: 'Treenity Webpack Astronomy Proxy',
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');

  api.use(
    [
      'ecmascript',
      'jagi:astronomy@2.5.8',
    ],
    ['client', 'server']);
  api.mainModule('index.js', ['client', 'server']);
  api.export(['Class', 'Enum', 'Type', 'Astro', 'typeName', 'Validator'], ['client', 'server']);
});
