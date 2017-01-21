const fs = require('fs');
const path = require('path');

const ejs = require('ejs');
const opener = require('opener');
const mkdir = require('mkdirp');
const { bold } = require('chalk');

const Logger = require('../Logger');
const getChartData = require('./getChartData');

module.exports = generateReport;

const projectRoot = path.resolve(__dirname, '..', '..');

function generateReport(bundleStats, opts) {
  const {
    openBrowser = true,
    reportFilename = 'report.html',
    bundleDir = null,
    logger = new Logger()
  } = opts || {};

  const chartData = getChartData(logger, bundleStats, bundleDir);

  if (!chartData) return;

  ejs.renderFile(
    `${projectRoot}/views/viewer.ejs`,
    {
      mode: 'static',
      chartData: JSON.stringify(chartData),
      assetContent: getAssetContent
    },
    (err, reportHtml) => {
      if (err) return logger.error(err);

      let reportFilepath = reportFilename;

      if (!path.isAbsolute(reportFilepath)) {
        reportFilepath = path.resolve(bundleDir || process.cwd(), reportFilepath);
      }

      mkdir.sync(path.dirname(reportFilepath));
      fs.writeFileSync(reportFilepath, reportHtml);

      logger.info(
        `${bold('Webpack Bundle Analyzer')} saved report to ${bold(reportFilepath)}`
      );

      if (openBrowser) {
        opener(`file://${reportFilepath}`);
      }
    }
  );
}

function getAssetContent(filename) {
  return fs.readFileSync(`${projectRoot}/public/${filename}`, 'utf8');
}
