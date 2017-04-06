const path = require('path');
const express = require('express');
const opener = require('opener');
const { bold } = require('chalk');

const projectRoot = path.resolve(__dirname, '..', '..');

module.exports = startServer;

function startServer(chartData, opts) {
  if (!chartData) {
    throw new Error('chartData was not set! It should be present at this point');
  }
  if (!opts) {
    throw new Error('Options parameter is missing');
  }
  if (!opts.logger) {
    throw new Error('A logger is missing from the options parameter');
  }

  const {
    port = 8888,
    host = '127.0.0.1',
    openBrowser = true,
    logger
  } = opts;

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

  return app.listen(port, host, () => {
    const url = `http://${host}:${port}`;

    logger.info(
      `${bold('Webpack Bundle Analyzer')} is started at ${bold(url)}\n` +
      `Use ${bold('Ctrl+C')} to close it`
    );

    if (openBrowser) {
      opener(url);
    }
  });
}
