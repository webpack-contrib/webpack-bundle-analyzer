const fs = require('fs');
const path = require('path');

const ejs = require('ejs');
const opener = require('opener');
const mkdir = require('mkdirp');
const { bold } = require('chalk');

module.exports = generateReport;

const projectRoot = path.resolve(__dirname, '..', '..');

function generateReport(chartData, opts) {
  if (!chartData) {
    throw new Error('chartData was not set! It should be present at this point');
  }
  if (!opts) {
    throw new Error('Options parameter is missing');
  }
  if (!opts.logger) {
    throw new Error('A logger is missing from the options parameter');
  }
  if (!opts.bundleDir) {
    throw new Error('bundleDir is missing from the options parameter');
  }

  const {
    openBrowser = true,
    reportFilename = 'report.html',
    bundleDir,
    logger
  } = opts;

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
        reportFilepath = path.resolve(bundleDir, reportFilepath);
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
