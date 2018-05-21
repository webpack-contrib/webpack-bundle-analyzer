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
    mode: (opts.env === 'prod') ? 'production' : 'development',
    output: {
      path: `${__dirname}/public`,
      filename: 'viewer.js',
      publicPath: '/'
    },

    optimization: {
      minimize: (opts.env === 'prod'),
      minimizer: [
        new UglifyJsPlugin({
          sourceMap: true,
          parallel: true,
          uglifyOptions: {
            output: {
              comments: false
            },
            compress: {
              // Disabling inlining of functions with parameters
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
            presets: [
              ['env', { targets: { uglify: true } }]
            ],
            plugins: [
              'transform-class-properties',
              'transform-react-jsx',
              ['transform-object-rest-spread', { useBuiltIns: true }]
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
          })
        );
      }

      return plugins;
    })([])
  };
};
