const compact = require('lodash/compact');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
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
        new TerserPlugin({
          parallel: true,
          sourceMap: true,
          terserOptions: {
            output: {
              comments: /copyright/iu
            },
            safari10: true
          }
        })
      ]
    },

    module: {
      rules: [
        {
          test: /\.jsx?$/u,
          exclude: /(node_modules|client\/vendor)/u,
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              ['@babel/preset-env', {
                // Target browsers are specified in .browserslistrc

                modules: false,
                useBuiltIns: 'usage',
                corejs: 2,
                exclude: [
                  // Excluding unused polyfills to completely get rid of `core.js` in the resulting bundle
                  'web.dom.iterable',
                  'es7.symbol.async-iterator'
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
          test: /\.css$/u,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[name]__[local]',
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: compact([
                  require('postcss-icss-values'),
                  require('autoprefixer'),
                  !isDev && require('cssnano')()
                ])
              }
            }
          ]
        },
        {
          test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/u,
          loader: 'url-loader'
        },
        {
          test: /carrotsearch\.foamtree/u,
          loader: 'exports-loader?CarrotSearchFoamTree'
        }
      ]
    },

    plugins: (plugins => {
      if (!isDev) {
        if (opts.analyze) {
          plugins.push(
            new BundleAnalyzePlugin({
              generateStatsFile: true
            })
          );
        }

        plugins.push(
          new webpack.DefinePlugin({
            'process': JSON.stringify({
              env: {
                NODE_ENV: 'production'
              }
            }),
            // Fixes "ModuleConcatenation bailout" for some modules (e.g. Preact and MobX)
            'global': 'undefined'
          })
        );
      }

      plugins.push(new CopyWebpackPlugin([
          {
            from: `${__dirname}/views/favicon.ico`,
            to: `${__dirname}/public`,
          }
        ])
      );

      return plugins;
    })([])
  };
};
