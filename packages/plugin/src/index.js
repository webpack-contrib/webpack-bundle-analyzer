function startIsRemoved() {
  throw new Error('Accessing .start() directly from "webpack-bundle-analyzer" package is no longer supported.');
}

module.exports = {
  start: startIsRemoved,
  BundleAnalyzerPlugin: require('./BundleAnalyzerPlugin')
};
