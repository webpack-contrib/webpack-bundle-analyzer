const { start } = require('./viewer');
const BundleAnalyzerPlugin = require('./BundleAnalyzerPlugin');

BundleAnalyzerPlugin.start = start;
BundleAnalyzerPlugin.BundleAnalyzerPlugin = BundleAnalyzerPlugin;
module.exports = BundleAnalyzerPlugin;
