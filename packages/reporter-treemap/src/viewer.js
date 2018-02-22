const path = require('path');
const fs = require('fs');
const http = require('http');

const WebSocket = require('ws');
const express = require('express');
const ejs = require('ejs');
const opener = require('opener');
const mkdir = require('mkdirp');
const { bold } = require('chalk');

const reporterRoot = path.resolve(__dirname, '..');

module.exports = {
  startServer,
  generateReport
};

async function startServer(chartData, opts) {
  const {
    port,
    host,
    openBrowser,
    logger,
    defaultSizes
  } = opts;

  if (!logger) {
    throw new Error('opts.logger is missing');
  }
  if (!chartData) return;

  const app = express();

  // Explicitly using our `ejs` dependency to render templates
  // Fixes #17
  app.engine('ejs', require('ejs').renderFile);
  app.set('view engine', 'ejs');
  app.set('views', `${reporterRoot}/views`);
  app.use(express.static(`${reporterRoot}/public`));

  app.use('/', (req, res) => {
    res.render('viewer', {
      mode: 'server',
      get chartData() { return JSON.stringify(chartData) },
      defaultSizes: JSON.stringify(defaultSizes)
    });
  });

  const server = http.createServer(app);

  await new Promise(resolve => {
    server.listen(port, host, () => {
      resolve();

      const url = `http://${host}:${port}`;

      logger.info(
        `${bold('Webpack Bundle Analyzer')} is started at ${bold(url)}\n` +
        `Use ${bold('Ctrl+C')} to close it`
      );

      if (openBrowser) {
        opener(url);
      }
    });
  });

  const wss = new WebSocket.Server({ server });

  wss.on('connection', ws => {
    ws.on('error', err => {
      // Ignore network errors like `ECONNRESET`, `EPIPE`, etc.
      if (err.errno) return;

      logger.info(err.message);
    });
  });

  return {
    ws: wss,
    http: server,
    updateChartData
  };

  function updateChartData(newChartData) {
    if (!newChartData) return;

    chartData = newChartData;

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          event: 'chartDataUpdated',
          data: newChartData
        }));
      }
    });
  }
}

function generateReport(chartData, opts) {
  const {
    openBrowser,
    reportFilename,
    outputPath,
    logger,
    defaultSizes
  } = opts;

  if (!logger) {
    throw new Error('opts.logger is missing');
  }

  if (!chartData) return;

  ejs.renderFile(
    `${reporterRoot}/views/viewer.ejs`,
    {
      mode: 'static',
      chartData: JSON.stringify(chartData),
      assetContent: getAssetContent,
      defaultSizes: JSON.stringify(defaultSizes)
    },
    (err, reportHtml) => {
      if (err) return logger.error(err);

      const reportFilepath = path.resolve(outputPath, reportFilename);

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
  return fs.readFileSync(`${reporterRoot}/public/${filename}`, 'utf8');
}
