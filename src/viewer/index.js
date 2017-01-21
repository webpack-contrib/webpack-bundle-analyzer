const startServer = require('./startServer');
const generateReport = require('./generateReport');

const getChartData = require('../chartData/getChartData');

// A plumbing solution to load the graph data at the outermost boundary and then providing
// it down to the individual pieces. This way those pieces don't have to worry about how
// to get the formatted data for consuming it.
function loadChartDataAndStartServer(bundleStats, opts) {
  if (!opts) {
    throw new Error('Options parameter is missing');
  }
  if (!opts.logger) {
    throw new Error('A logger is missing from the options parameter');
  }
  const {
    bundleDir = null,
    logger,
    ...serverOptions
  } = opts;

  const chartData = getChartData(logger, bundleStats, bundleDir);

  if (!chartData) return;

  startServer(chartData, logger, serverOptions);
}

function loadChartDataAndGenerateReport(bundleStats, opts) {
  if (!opts) {
    throw new Error('Options parameter is missing');
  }
  if (!opts.logger) {
    throw new Error('A logger is missing from the options parameter');
  }

  const {
    bundleDir = null,
    logger
  } = opts;

  const chartData = getChartData(logger, bundleStats, bundleDir);

  if (!chartData) return;

  return generateReport(chartData, opts);
}

module.exports = {
  startServer: loadChartDataAndStartServer,
  generateReport: loadChartDataAndGenerateReport
};
