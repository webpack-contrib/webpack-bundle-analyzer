const compact = require('lodash/compact');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
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
      extensions: ['.js', '.jsx'],
      alias: {
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
        mobx: require.resolve('mobx/lib/mobx.es6.js')
      }
    },

    devtool: isDev ? 'eval' : 'source-map',
    watch: isDev,

    performance: {
      hints: false
    },
    optimization: {
      minimize: !isDev,
      minimizer: [
        new TerserPlugin({
          parallel: true,
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
          exclude: /node_modules/u,
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              ['@babel/preset-env', {
                // Target browsers are specified in .browserslistrc

                modules: false,
                useBuiltIns: 'usage',
                corejs: require('./package.json').devDependencies['core-js'],
                debug: true
              }],
              ['@babel/preset-react', {
                runtime: 'automatic',
                importSource: 'preact'
              }]
            ],
            plugins: [
              'lodash',
              ['@babel/plugin-proposal-decorators', {legacy: true}],
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
                modules: {
                  localIdentName: '[name]__[local]'
                },
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: compact([
                    require('postcss-icss-values'),
                    require('autoprefixer'),
                    !isDev && require('cssnano')()
                  ])
                }
              }
            }
          ]
        },
        {
          test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/u,
          loader: 'url-loader'
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

      return plugins;
    })([])
  };
};
