const path = require('path');

const express = require('express');
const opener = require('opener');
const { bold } = require('chalk');

const analyzer = require('./analyzer');

const projectRoot = path.resolve(__dirname, '..');

module.exports = {
  start
};

function start(bundleStats, opts) {
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
  app.use('/filesize.js', express.static(require.resolve('filesize')));

  app.use('/', (req, res) => {
    res.render('viewer', {
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
