/* eslint-env jest */

// const fs = require('fs');
const del = require('del');

const {
  makeWebpackConfig,
  webpackCompile
} = require('./utils');

let nightmare;

describe('Webpack config', function () {
  beforeEach(async function () {
    const Nightmare = require('nightmare');
    nightmare = Nightmare();
    del.sync(`${__dirname}/output`);
    await nightmare.goto('about:blank');
  });

  afterEach(function () {
    del.sync(`${__dirname}/output`);
  });

  fit('with query in bundle filename should be supported', async function () {
    const config = makeWebpackConfig();

    config.output.filename = 'bundle.js?what=is-this-for';

    await webpackCompile(config);
    await expectValidReport();
  });

  it('with custom `jsonpFunction` name should be supported', async function () {
    const config = makeWebpackConfig({
      multipleChunks: true
    });

    config.output.jsonpFunction = 'somethingCompletelyDifferent';

    await webpackCompile(config);
    await expectValidReport({
      parsedSize: 445,
      gzipSize: 179
    });
  });

  it('with `multi` module should be supported', async function () {
    const config = makeWebpackConfig();

    config.entry.bundle = [
      './src/a.js',
      './src/b.js'
    ];

    await webpackCompile(config);
    const chartData = await getChartDataFromReport();
    expect(chartData[0].groups).toContainEqual({
      gzipSize: expect.anything(),
      id: expect.anything(),
      parsedSize: expect.anything(),
      statSize: expect.anything(),
      weight: expect.anything(),
      label: 'multi ./src/a.js ./src/b.js',
      path: './multi ./src/a.js ./src/b.js',
      groups: undefined
    });
  });
});

async function expectValidReport(opts) {
  const {
    // bundleFilename = 'bundle.js',
    reportFilename = 'report.html',
    bundleLabel = 'bundle.js',
    statSize = 141,
    parsedSize = 2983,
    gzipSize = 820
  } = opts || {};

  // expect(fs.existsSync(`${__dirname}/output/${bundleFilename}`)).toEqual(true);
  // expect(fs.existsSync(`${__dirname}/output/${reportFilename}`)).toEqual(true);
  const chartData = await getChartDataFromReport(reportFilename);
  expect(chartData[0]).toMatchObject({
    label: bundleLabel,
    statSize,
    parsedSize,
    gzipSize
  });
}

async function getChartDataFromReport(reportFilename = 'report.html') {
  /* global window */
  return await nightmare
    .goto(`file://${__dirname}/output/${reportFilename}`)
    .evaluate(() => window.chartData)
    .end();
}
