const chai = require('chai');
const webpack = require('webpack');

chai.use(require('chai-subset'));

global.expect = chai.expect;
global.sinon = require('sinon');
global.webpackCompile = webpackCompile;
global.makeWebpackConfig = makeWebpackConfig;

const BundleAnalyzerPlugin = require('../lib/BundleAnalyzerPlugin');

function webpackCompile(config) {
  return new Promise((resolve, reject) => {
    webpack(config, err => {
      if (err) return reject(err);
      resolve();
    });
  });
}

function makeWebpackConfig(opts) {
  opts = {
    analyzerOpts: {
      analyzerMode: 'static',
      openAnalyzer: false,
      logLevel: 'silent'
    },
    minify: false,
    ...opts
  };

  return {
    context: __dirname,
    entry: './src',
    output: {
      path: `${__dirname}/output`,
      filename: 'bundle.js'
    },
    plugins: (plugins => {
      plugins.push(
        new BundleAnalyzerPlugin(opts.analyzerOpts)
      );

      if (opts.minify) {
        plugins.push(
          new webpack.optimize.UglifyJsPlugin({
            screw_ie8: true,
            compress: {
              warnings: false,
              negate_iife: false,
              screw_ie8: true
            },
            mangle: {
              screw_ie8: true
            }
          })
        );
      }

      return plugins;
    })([])
  };
}
