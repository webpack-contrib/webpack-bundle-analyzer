const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzePlugin = require('./lib/BundleAnalyzerPlugin');

module.exports = opts => {
  opts = Object.assign({
    env: 'dev',
    analyze: false
  }, opts);

  return {
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
      extensions: ['.js', '.jsx']
    },

    devtool: (opts.env === 'dev') ? 'eval' : 'source-map',
    watch: (opts.env === 'dev'),

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
                  'last 2 Opera major versions',
                  'last 1 Safari major version'
                ],
                modules: false,
                useBuiltIns: 'entry',
                exclude: [
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
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
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
      if (opts.env === 'dev') {
        plugins.push(
          new webpack.NamedModulesPlugin()
        );
      }

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
          }),
          new webpack.optimize.OccurrenceOrderPlugin(),
          new UglifyJsPlugin({
            parallel: true,
            sourceMap: true,
            uglifyOptions: {
              output: {
                comments: false
              },
              compress: {
                // Fixes bad function inlining minification
                // See https://github.com/webpack/webpack/issues/6760,
                // https://github.com/webpack/webpack/issues/6567#issuecomment-369554250
                inline: 1
              },
              mangle: {
                safari10: true
              }
            }
          })
        );
      }

      return plugins;
    })([])
  };
};
