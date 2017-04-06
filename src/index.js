const { startServer } = require('./viewer');

module.exports = {
  // Deprecated
  start: startServer,
  BundleAnalyzerPlugin: require('./BundleAnalyzerPlugin')
};
