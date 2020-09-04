const chai = require('chai');
const webpack = require('webpack');
const _ = require('lodash');

chai.use(require('chai-subset'));

global.expect = chai.expect;
global.webpackCompile = webpackCompile;
global.makeWebpackConfig = makeWebpackConfig;
global.hasNodeVersion = hasNodeVersion;

const BundleAnalyzerPlugin = require('../lib/BundleAnalyzerPlugin');

async function webpackCompile(config) {
  await new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) {
        return reject(err);
      }

      if (stats.hasErrors()) {
        return reject(stats.toJson({source: false}).errors);
      }

      resolve();
    });
  });
  // Waiting for the next tick (for analyzer report to be generated)
  await wait(1);
}

function makeWebpackConfig(opts) {
  opts = _.merge({
    analyzerOpts: {
      analyzerMode: 'static',
      openAnalyzer: false,
      logLevel: 'error'
    },
    minify: false,
    multipleChunks: false
  }, opts);

  return {
    context: __dirname,
    mode: 'development',
    entry: {
      bundle: './src'
    },
    output: {
      path: `${__dirname}/output`,
      filename: '[name].js'
    },
    optimization: {
      runtimeChunk: {
        name: 'manifest'
      }
    },
    plugins: (plugins => {
      plugins.push(
        new BundleAnalyzerPlugin(opts.analyzerOpts)
      );

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

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function hasNodeVersion(version) {
  const currentVersion = process.version.split('v')[1].split('.');
  return version.split('.').every((v, i) => Number(v) <= Number(currentVersion[i]));
}
