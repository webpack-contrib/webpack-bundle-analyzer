const BundleAnalyzerPlugin = require('../../lib/BundleAnalyzerPlugin');

module.exports = {
  entry: `${__dirname}/src.js`,
  output: {
    path: `${__dirname}/output`,
    filename: 'bundle.js'
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reporter: '@webpack-bundle-analyzer/reporter-treemap',
      reporterOptions: {
        reportFilename: 'report.html',
        openBrowser: false
      }
    })
  ]
};
