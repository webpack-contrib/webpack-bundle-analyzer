const _ = require('lodash');

const getViewerData = require('./getViewerData');

module.exports = getChartData;

function getChartData(logger, ...args) {
  let chartData;

  try {
    chartData = getViewerData(...args, { logger });
  } catch (err) {
    logger.error(`Could't analyze webpack bundle:\n${err}`);
    chartData = null;
  }

  if (_.isEmpty(chartData)) {
    logger.error("Could't find any javascript bundles in provided stats file");
    chartData = null;
  }

  return chartData;
}
