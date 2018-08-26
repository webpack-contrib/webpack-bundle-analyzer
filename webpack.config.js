const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzePlugin = require('./lib/BundleAnalyzerPlugin');

module.exports = opts => {
  opts = Object.assign({
    env: 'dev',
    analyze: false
  }, opts);

  const isDev = (opts.env === 'dev');

  return {
    mode: isDev ? 'development' : 'production',
    context: __dirname,
    entry: './client/viewer',
    output: {
      path: `${__dirname}/public`,
      filename: 'viewer.js',
      publicPath: '/'
    },

    resolve: {
      modules: [
        `${__dirname}/client/vendor`,
        'node_modules'
      ],
      extensions: ['.js', '.jsx'],
      alias: {
        mobx: require.resolve('mobx/lib/mobx.es6.js')
      }
    },

    devtool: isDev ? 'eval' : 'source-map',
    watch: isDev,

    optimization: {
      minimize: !isDev,
      minimizer: [
        new UglifyJsPlugin({
          parallel: true,
          sourceMap: true,
          uglifyOptions: {
            output: {
              comments: false
            },
            compress: {
              // Fixes bad function inlining minification.
              // See https://github.com/webpack/webpack/issues/6760,
              // https://github.com/webpack/webpack/issues/6567#issuecomment-369554250
              inline: 1
            },
            mangle: {
              safari10: true
            }
          }
        })
      ]
    },

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|client\/vendor)/,
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              ['@babel/preset-env', {
                targets: [
                  'last 2 Chrome major versions',
                  'last 2 Firefox major versions',
                  'last 1 Safari major version'
                ],
                modules: false,
                useBuiltIns: 'entry',
                exclude: [
                  // Excluding unused polyfills to completely get rid of `core.js` in the resulting bundle
                  'web.immediate',
                  'web.dom.iterable',
                  'web.timers',
                  'es7.symbol.async-iterator',
                  'es7.promise.finally'
                ],
                debug: true
              }],
              '@babel/preset-react'
            ],
            plugins: [
              'lodash',
              ['@babel/plugin-proposal-decorators', {legacy: true}],
              ['@babel/plugin-proposal-class-properties', {loose: true}],
              ['@babel/plugin-transform-runtime', {
                useESModules: true
              }]
            ]
          }
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
                minimize: (opts.env === 'prod'),
                localIdentName: '[name]__[local]'
              }
            }
          ]
        },
        {
          test: /carrotsearch\.foamtree/,
          loader: 'exports-loader?CarrotSearchFoamTree'
        }
      ]
    },

    plugins: (plugins => {
      if (opts.env === 'prod') {
        if (opts.analyze) {
          plugins.push(
            new BundleAnalyzePlugin({
              generateStatsFile: true
            })
          );
        }

        plugins.push(
          new webpack.DefinePlugin({
            'process.env': {
              NODE_ENV: '"production"'
            }
          })
        );
      }

      return plugins;
    })([])
  };
};
