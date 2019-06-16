Package.describe({
    name: 'krizka:mongo-counters',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: '',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.2.1');
    api.use('ecmascript');
    api.use('random');
    api.use('mongo');
    api.addFiles([
        'find-and-modify.js',
        'counters.js'
    ], 'server');

    api.export('MongoCounters', 'server');
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('random');
    api.use('tinytest');
    api.use('nupi-counters');
    api.addFiles('counters-tests.js', 'server');
});
