const fs = require('fs');
const del = require('del');
const Nightmare = require('nightmare');
const nightmare = Nightmare();

describe('Webpack config', function () {
  this.timeout(5000);

  before(async function () {
    del.sync(`${__dirname}/output`);
    this.clock = sinon.useFakeTimers();
  });

  beforeEach(async function () {
    await nightmare.goto('about:blank');
  });

  afterEach(function () {
    del.sync(`${__dirname}/output`);
  });

  after(function () {
    this.clock.restore();
  });

  it('with head slash in bundle filename should be supported', async function () {
    const config = makeWebpackConfig();

    config.output.filename = '/bundle.js';

    await webpackCompile(config);
    this.clock.tick(1);

    await expectValidReport({
      bundleLabel: '/bundle.js'
    });
  });

  it('with query in bundle filename should be supported', async function () {
    const config = makeWebpackConfig();

    config.output.filename = 'bundle.js?what=is-this-for';

    await webpackCompile(config);
    this.clock.tick(1);

    await expectValidReport();
  });
});

async function expectValidReport(opts) {
  const {
    bundleFilename = 'bundle.js',
    reportFilename = 'report.html',
    bundleLabel = 'bundle.js'
  } = opts || {};

  expect(fs.existsSync(`${__dirname}/output/${bundleFilename}`)).to.be.true;
  expect(fs.existsSync(`${__dirname}/output/${reportFilename}`)).to.be.true;
  const chartData = await nightmare
    .goto(`file://${__dirname}/output/${reportFilename}`)
    .evaluate(() => window.chartData);
  expect(chartData[0]).to.containSubset({
    label: bundleLabel,
    statSize: 141,
    parsedSize: 2776,
    gzipSize: 796
  });
}
