const webpack = require('webpack');
const BundleAnalyzerPlugin = require('../../packages/plugin/lib/BundleAnalyzerPlugin');

module.exports = {
  webpackCompile,
  makeWebpackConfig
};

function webpackCompile(config) {
  return new Promise((resolve, reject) =>
    webpack(config, err => err ? reject(err) : resolve())
  );
}

function makeWebpackConfig(opts) {
  opts = {
    analyzerOpts: {
      analyzerMode: 'static',
      logLevel: 'error',
      reporter: '@webpack-bundle-analyzer/reporter-treemap',
      reporterOptions: {
        openBrowser: false
      }
    },
    minify: false,
    multipleChunks: false,
    ...opts
  };

  return {
    context: __dirname,
    entry: {
      bundle: './src'
    },
    output: {
      path: `${__dirname}/output`,
      filename: '[name].js'
    },
    plugins: (plugins => {
      plugins.push(
        new BundleAnalyzerPlugin(opts.analyzerOpts)
      );

      if (opts.multipleChunks) {
        plugins.push(
          new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            minChunks: Infinity
          })
        );
      }

      if (opts.minify) {
        plugins.push(
          new webpack.optimize.UglifyJsPlugin({
            comments: false,
            mangle: true,
            compress: {
              warnings: false,
              negate_iife: false
            }
          })
        );
      }

      return plugins;
    })([])
  };
}
