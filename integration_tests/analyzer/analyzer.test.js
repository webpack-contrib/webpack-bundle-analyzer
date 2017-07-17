/* eslint-env jest */

const fs = require('fs');
const del = require('del');
const childProcess = require('child_process');
const path = require('path');

const packagesDir = path.join(__dirname, '..', '..', 'packages');

let nightmare;

describe('Analyzer', function () {
  beforeEach(async function () {
    const Nightmare = require('nightmare');
    nightmare = Nightmare();
    del.sync(`${__dirname}/output`);
    await nightmare.goto('about:blank');
  });

  afterEach(function () {
    del.sync(`${__dirname}/output`);
  });

  it('should support stats files with all the information in `children` array', async function () {
    generateReportFrom('with-children-array.json');
    await expectValidReport();
  });

  it('should support bundles with invalid dynamic require calls', async function () {
    generateReportFrom('with-invalid-dynamic-require.json');
    await expectValidReport({ statSize: 136 });
  });
});

function generateReportFrom(statsFilename) {
  const rOpts = JSON.stringify({
    reportFilename: 'output/report.html',
    openBrowser: false
  });
  const execArgs = [
    `${packagesDir}/plugin/lib/bin/analyzer.js`,
    '-m static',
    `--reporter='${packagesDir}/reporter-treemap'`,
    `--reporter-options='${rOpts}'`,
    `stats/${statsFilename}`
  ].join(' ');
  childProcess.execSync(execArgs, {
    cwd: __dirname
  });
}

async function expectValidReport(opts) {
  /* global window */
  const {
    bundleLabel = 'bundle.js',
    statSize = 141
  } = opts || {};

  expect(fs.existsSync(`${__dirname}/output/report.html`)).toEqual(true);
  const chartData = await nightmare
    .goto(`file://${__dirname}/output/report.html`)
    .evaluate(() => window.chartData)
    .end();
  expect(chartData[0]).toMatchObject({
    label: bundleLabel,
    statSize
  });
}
