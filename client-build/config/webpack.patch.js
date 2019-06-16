const webpack = require('webpack');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const antdVars = require('./antd-vars');

const USE_HOT = !!process.env.HOT;

module.exports = function patch(config) {
  switch (config.mode) {
    case 'development': return patchDev(config);
    case 'production': return patchProd(config);
    default: throw new Error(`unknown webpack mode: ${config.mode}`);
  }
};

function patchProd(config) {
  Object.assign(config, {
    externals: [
      resolveExternals,
    ],
  });
  config.resolve.alias = {
    formik: 'krizkaz-formik',
  };

  const oneOf = config.module.rules[2].oneOf;
  const babelLoader = oneOf[1].options;
  babelLoader.presets = ['react-app'];
  babelLoader.babelrc = false;
  babelLoader.plugins.push(
    ['import', { libraryName: 'antd', style: true }, 'antd-import'],
    ['import', { libraryName: 'lodash', libraryDirectory: '', camel2DashComponentName: false }, 'lodash-import'],
    ['import', { libraryName: 'recompose', libraryDirectory: '', camel2DashComponentName: false }, 'recompose-import'],
  );

  // add less before last element
  oneOf.splice(-1, 0,
    {
      test: /\.(less)$/,
      exclude: /\.module\.(less)$/,
      use: getStyleLoaders({
        importLoaders: 2,
      }, 'less-loader', {
        modifyVars: antdVars,
        javascriptEnabled: true,
      }),
    },
    {
      test: /\.module\.(less)$/,
      use: getStyleLoaders({
        importLoaders: 2,
        modules: true,
        getLocalIdent: getCSSModuleLocalIdent,
      }, 'less-loader', {
        modifyVars: antdVars,
        javascriptEnabled: true
      }),
    },
  );
  oneOf[1].options.plugins.push([
    require.resolve('babel-plugin-macros'),
  ]);

  // remove eslint strict checking on build
  config.module.rules.splice(1, 1);

  // add some meteor definitions into
  const definePlugin = config.plugins.find(p => p instanceof webpack.DefinePlugin);
  definePlugin.definitions['Meteor'] = { isServer: 'false' };
  definePlugin.definitions['isServer'] = 'false';

  return config;
}

function patchDev(config) {
  config = patchProd(config);

  Object.assign(config, {
    devServer: {
      // hot: USE_HOT,
    },
  });

  // don't warn about dynamic resolved items
  config.module.exprContextCritical = false;

  config.plugins.push(
    new webpack.NormalModuleReplacementPlugin(/^meteor-client$/, 'meteor-client.dev.js'),
  );

  // add plugin to babel-loader
  const oneOf = config.module.rules[1].oneOf;
  const babelLoader = oneOf[1].options;
  if (USE_HOT) {
    config.resolve.alias['react-dom'] = '@hot-loader/react-dom';
    babelLoader.plugins.push(
      ['react-hot-loader/babel'],
    );
  }
  babelLoader.plugins.push(
    '@babel/plugin-transform-react-jsx-source',
  );

  return config;
}

const getStyleLoaders = (cssOptions, preProcessor, preOptions) => {
  const loaders = [
    require.resolve('style-loader'),
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
        ],
      },
    },
  ];
  if (preProcessor) {
    loaders.push({
      loader: require.resolve(preProcessor),
      options: preOptions,
    });
  }
  return loaders;
};

function resolveMeteor(request, callback) {
  const match = request.match(/^meteor\/(.+)$/);
  const pack = match && match[1];

  if (pack) {
    callback(null, `Package["${pack}"]`);
    return true;
  }
  return false;
}

function resolveExternals(context, request, callback) {
  return resolveMeteor(request, callback) ||
    callback();
}

