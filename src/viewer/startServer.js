const path = require('path');
const express = require('express');
const opener = require('opener');
const { bold } = require('chalk');

const Logger = require('../Logger');
const getChartData = require('./getChartData');

const projectRoot = path.resolve(__dirname, '..', '..');

module.exports = startServer;

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
