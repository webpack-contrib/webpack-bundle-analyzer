const path = require('path');
const fs = require('fs');

const _ = require('lodash');
const express = require('express');
const ejs = require('ejs');
const opener = require('opener');
const mkdir = require('mkdirp');
const { bold } = require('chalk');

const analyzer = require('./analyzer');

const projectRoot = path.resolve(__dirname, '..');

module.exports = {
  startServer,
  generateReport,
  // deprecated
  start: startServer
};

function startServer(bundleStats, opts) {
  opts = {
    port: 8888,
    openBrowser: true,
    bundleDir: null,
    ...opts
  };

  let chartData;
  try {
    chartData = analyzer.getChartData(bundleStats, opts.bundleDir);
  } catch (err) {
    console.error(`Could't analyze webpack bundle:\n${err}`);
    return;
  }

  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', `${projectRoot}/views`);
  app.use(express.static(`${projectRoot}/client`));
  app.use('/node_modules/filesize', express.static(require.resolve('filesize')));

  app.use('/', (req, res) => {
    res.render('viewer', {
      mode: 'server',
      chartData: JSON.stringify(chartData)
    });
  });

  return app.listen(opts.port, () => {
    const url = `http://localhost:${opts.port}`;

    console.log(
      `${bold('Webpack Bundle Analyzer')} is started at ${bold(url)}\n` +
      `Use ${bold('Ctrl+C')} to close it`
    );

    if (opts.openBrowser) {
      opener(url);
    }
  });
}

function generateReport(bundleStats, opts) {
  opts = {
    openBrowser: true,
    reportFilename: 'report.html',
    bundleDir: null,
    ...opts
  };

  let chartData;
  try {
    chartData = analyzer.getChartData(bundleStats, opts.bundleDir);
  } catch (err) {
    console.error(`Could't analyze webpack bundle:\n${err}`);
    return;
  }

  ejs.renderFile(
    `${projectRoot}/views/viewer.ejs`,
    {
      mode: 'static',
      chartData: JSON.stringify(chartData),
      assetContent: getAssetContent
    },
    (err, reportHtml) => {
      if (err) return console.error(err);

      let reportFilepath = opts.reportFilename;

      if (!path.isAbsolute(reportFilepath)) {
        reportFilepath = path.resolve(opts.bundleDir || process.cwd(), reportFilepath);
      }

      mkdir.sync(path.dirname(reportFilepath));
      fs.writeFileSync(reportFilepath, reportHtml);

      console.log(
        `${bold('Webpack Bundle Analyzer')} saved report to ${bold(reportFilepath)}\n`
      );

      if (opts.openBrowser) {
        opener(`file://${reportFilepath}`);
      }
    }
  );
}

function getAssetContent(filename) {
  let filepath;

  if (_.startsWith(filename, 'node_modules/')) {
    filepath = require.resolve(filename.slice('node_modules/'.length));
  } else {
    filepath = `${projectRoot}/client/${filename}`;
  }

  return fs.readFileSync(filepath, 'utf8');
}
