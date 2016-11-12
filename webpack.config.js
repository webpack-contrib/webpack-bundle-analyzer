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
      publicPath: '/',
      pathinfo: true
    },

    resolve: {
      root: [
        `${__dirname}/client/vendor`
      ],
      extensions: ['', '.js', '.jsx']
    },

    debug: (opts.env === 'dev'),
    devtool: (opts.env === 'dev') ? 'eval' : 'source-map',
    watch: (opts.env === 'dev'),

    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|client\/vendor)/,
          loader: 'babel'
        },
        {
          test: /\.css$/,
          loader: 'style!css?modules&localIdentName=[name]__[local]'
        },
        {
          test: /carrotsearch\.foamtree/,
          loader: 'exports?CarrotSearchFoamTree'
        }
      ]
    },

    plugins: (list => {
      if (opts.env === 'prod') {
        if (opts.analyze) {
          list.push(
            new BundleAnalyzePlugin()
          );
        }

        list.push(
          new webpack.DefinePlugin({
            'process.env': {
              NODE_ENV: '"production"'
            }
          }),
          new webpack.optimize.OccurenceOrderPlugin(),
          new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false }
          })
        );
      }
      return list;
    })([])
  };
};
