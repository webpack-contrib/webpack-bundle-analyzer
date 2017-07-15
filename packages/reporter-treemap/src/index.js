const path = require('path');
const viewer = require('./viewer');

module.exports = {
  generateReport,
  createReporter
};

function generateReport(stats, opts) {
  const parsedOpts = {
    host: '127.0.0.1',
    port: 8888,
    defaultSizes: 'parsed',
    openBrowser: true,
    reportFilename: path.resolve(opts.bundleDir, opts.reportFilename || 'report.html'),
    ...opts
  };
  return viewer.generateReport(stats, parsedOpts);
}

function createReporter(initialChartData, opts) {
  const parsedOpts = {
    host: '127.0.0.1',
    port: 8888,
    reportFilename: path.resolve(opts.bundleDir, opts.reportFilename || 'report.html'),
    defaultSizes: 'parsed',
    openBrowser: true,
    ...opts
  };
  const server = viewer.startServer(initialChartData, parsedOpts);
  return server.then(({ updateChartData }) => ({
    updateData: newData => {
      updateChartData(newData);
    }
  }));
}
