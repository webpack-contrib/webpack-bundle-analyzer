const webpack = require('webpack');
const BundleAnalyzePlugin = require('./lib/BundleAnalyzerPlugin');

module.exports = opts => {
  opts = {
    env: 'dev',
    analyze: false,
    ...opts
  };

  return {
    context: __dirname,
    entry: './client/viewer',
    output: {
      path: 'public',
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
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|client\/vendor)/,
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          loaders: [
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
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false,
              negate_iife: false
            },
            mangle: true,
            comments: false,
            sourceMap: true
          })
        );
      }

      return plugins;
    })([])
  };
};
