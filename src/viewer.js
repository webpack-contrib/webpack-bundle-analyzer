const path = require('path');
const fs = require('fs');

const _ = require('lodash');
const express = require('express');
const ejs = require('ejs');
const opener = require('opener');
const mkdir = require('mkdirp');
const { bold } = require('chalk');

const Logger = require('./Logger');
const analyzer = require('./analyzer');

const projectRoot = path.resolve(__dirname, '..');

module.exports = {
  startServer,
  generateReport,
  // deprecated
  start: startServer
};

function startServer(bundleStats, opts) {
  const {
    port = 8888,
    openBrowser = true,
    bundleDir = null,
    logger = new Logger()
  } = opts || {};

  const chartData = getChartData(logger, bundleStats, bundleDir);

  if (!chartData) return;

  const app = express();

  // Explicitly using our `ejs` dependency to render templates
  // Fixes #17
  app.engine('ejs', require('ejs').renderFile);
  app.set('view engine', 'ejs');
  app.set('views', `${projectRoot}/views`);
  app.use(express.static(`${projectRoot}/public`));

  app.use('/', (req, res) => {
    res.render('viewer', {
      mode: 'server',
      chartData: JSON.stringify(chartData)
    });
  });

  return app.listen(port, () => {
    const url = `http://localhost:${port}`;

    logger.info(
      `${bold('Webpack Bundle Analyzer')} is started at ${bold(url)}\n` +
      `Use ${bold('Ctrl+C')} to close it`
    );

    if (openBrowser) {
      opener(url);
    }
  });
}

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

function getChartData(logger, ...args) {
  let chartData;

  try {
    chartData = analyzer.getViewerData(...args, { logger });
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
