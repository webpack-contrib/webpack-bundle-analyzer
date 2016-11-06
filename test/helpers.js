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
      openAnalyzer: false
    },
    ...opts
  };

  return {
    context: __dirname,
    entry: './src',
    output: {
      path: `${__dirname}/output`,
      filename: 'bundle.js'
    },
    plugins: [
      new BundleAnalyzerPlugin(opts.analyzerOpts)
    ]
  };
}
