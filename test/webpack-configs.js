const fs = require('fs');
const del = require('del');

let nightmare;

describe('Webpack config', function () {
  let clock;

  this.timeout(3000);

  before(function () {
    const Nightmare = require('nightmare');
    nightmare = Nightmare();
    del.sync(`${__dirname}/output`);
    clock = sinon.useFakeTimers();
  });

  beforeEach(async function () {
    this.timeout(10000);
    await nightmare.goto('about:blank');
  });

  afterEach(function () {
    del.sync(`${__dirname}/output`);
  });

  after(function () {
    clock.restore();
  });

  it('with head slash in bundle filename should be supported', async function () {
    const config = makeWebpackConfig();

    config.output.filename = '/bundle.js';

    await webpackCompile(config);
    clock.tick(1);

    await expectValidReport({
      bundleLabel: '/bundle.js'
    });
  });

  it('with query in bundle filename should be supported', async function () {
    const config = makeWebpackConfig();

    config.output.filename = 'bundle.js?what=is-this-for';

    await webpackCompile(config);
    clock.tick(1);

    await expectValidReport();
  });

  it('with custom `jsonpFunction` name should be supported', async function () {
    const config = makeWebpackConfig({
      multipleChunks: true
    });

    config.output.jsonpFunction = 'somethingCompletelyDifferent';

    await webpackCompile(config);
    clock.tick(1);

    await expectValidReport({
      parsedSize: 447,
      gzipSize: 181
    });
  });
});

async function expectValidReport(opts) {
  const {
    bundleFilename = 'bundle.js',
    reportFilename = 'report.html',
    bundleLabel = 'bundle.js',
    statSize = 141,
    parsedSize = 2857,
    gzipSize = 813
  } = opts || {};

  expect(fs.existsSync(`${__dirname}/output/${bundleFilename}`)).to.be.true;
  expect(fs.existsSync(`${__dirname}/output/${reportFilename}`)).to.be.true;
  const chartData = await nightmare
    .goto(`file://${__dirname}/output/${reportFilename}`)
    .evaluate(() => window.chartData);
  expect(chartData[0]).to.containSubset({
    label: bundleLabel,
    statSize,
    parsedSize,
    gzipSize
  });
}
