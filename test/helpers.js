const chai = require('chai');
const webpack = require('webpack');
const _ = require('lodash');

chai.use(require('chai-subset'));

global.expect = chai.expect;
global.webpackCompile = webpackCompile;
global.makeWebpackConfig = makeWebpackConfig;
global.pause = pause;

const BundleAnalyzerPlugin = require('../lib/BundleAnalyzerPlugin');

function webpackCompile(config) {
  return new Promise((resolve, reject) =>
    webpack(config, err => (err ? reject(err) : resolve()))
  );
}

function makeWebpackConfig(opts) {
  opts = _.merge({
    analyzerOpts: {
      analyzerMode: 'static',
      openAnalyzer: false,
      logLevel: 'error'
    },
    multipleChunks: false
  }, opts);

  const config = {
    context: __dirname,
    mode: 'development',
    devtool: false,
    entry: {
      bundle: './src'
    },
    output: {
      path: `${__dirname}/output`,
      filename: '[name].js'
    },
    plugins: [
      new BundleAnalyzerPlugin(opts.analyzerOpts)
    ]
  };

  if (opts.multipleChunks) {
    config.optimization = {
      runtimeChunk: {
        name: 'manifest'
      }
    };
  }

  return config;
}

function pause(ms = 1) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
