const fs = require('fs');
const del = require('del');
const _ = require('lodash');

let nightmare;

describe('Plugin', function () {
  this.timeout(3000);

  before(function () {
    const Nightmare = require('nightmare');
    nightmare = Nightmare();
    del.sync(`${__dirname}/output`);
  });

  beforeEach(async function () {
    this.timeout(10000);
    await nightmare.goto('about:blank');
  });

  afterEach(function () {
    del.sync(`${__dirname}/output`);
  });

  it('should support webpack config with custom `jsonpFunction` name', async function () {
    const config = makeWebpackConfig({
      multipleChunks: true
    });

    config.output.jsonpFunction = 'somethingCompletelyDifferent';

    await webpackCompile(config);

    await expectValidReport({
      parsedSize: 1343,
      gzipSize: 360
    });
  });

  it('should support webpack config with `multi` module', async function () {
    const config = makeWebpackConfig();

    config.entry.bundle = [
      './src/a.js',
      './src/b.js'
    ];

    await webpackCompile(config);

    const chartData = await getChartDataFromReport();
    expect(chartData[0].groups).to.containSubset([{
      label: 'multi ./src/a.js ./src/b.js',
      path: './multi ./src/a.js ./src/b.js',
      groups: undefined
    }]);
  });

  describe('options', function () {
    describe('excludeAssets', function () {
      it('should filter out assets from the report', async function () {
        const config = makeWebpackConfig({
          multipleChunks: true,
          analyzerOpts: {
            excludeAssets: 'manifest'
          }
        });

        await webpackCompile(config);

        const chartData = await getChartDataFromReport();
        expect(_.map(chartData, 'label')).to.deep.equal(['bundle.js']);
      });
    });

    describe('bundleDirOption', function () {
      it('should report parsedSize and gzipSize when bundleDirOption is not provided', async function () {
        const config = makeWebpackConfig({
          analyzerOpts: {
          }
        });

        await webpackCompile(config);

        const chartData = await getChartDataFromReport();
        expect(
          chartData[0].groups.every(group => (
            ('parsedSize' in group)
            && ('gzipSize' in group)
            && ('statSize' in group)
          ))
        ).to.be.true;
      });

      it('should report parsedSize and gzipSize when bundleDirOption is null', async function () {
        const config = makeWebpackConfig({
          analyzerOpts: {
            bundleDirOption: null
          }
        });

        await webpackCompile(config);

        const chartData = await getChartDataFromReport();
        expect(
          chartData[0].groups.every(group => (
            ('parsedSize' in group)
            && ('gzipSize' in group)
            && ('statSize' in group)
          ))
        ).to.be.true;
      });

      it('should report statSize only bundleDirOption is false', async function () {
        const config = makeWebpackConfig({
          analyzerOpts: {
            bundleDirOption: false
          }
        });

        await webpackCompile(config);

        const chartData = await getChartDataFromReport();
        expect(
          chartData[0].groups.every(group => (
            !group.parsedSize
            && !group.gzipSize
            && group.statSize
          ))
        ).to.be.true;
      });
    });
  });
});

async function expectValidReport(opts) {
  const {
    bundleFilename = 'bundle.js',
    reportFilename = 'report.html',
    bundleLabel = 'bundle.js',
    statSize = 141,
    parsedSize = 2821,
    gzipSize = 770
  } = opts || {};

  expect(fs.existsSync(`${__dirname}/output/${bundleFilename}`), 'bundle file missing').to.be.true;
  expect(fs.existsSync(`${__dirname}/output/${reportFilename}`), 'report file missing').to.be.true;
  const chartData = await getChartDataFromReport(reportFilename);
  expect(chartData[0]).to.containSubset({
    label: bundleLabel,
    statSize,
    parsedSize,
    gzipSize
  });
}

async function getChartDataFromReport(reportFilename = 'report.html') {
  return await nightmare
    .goto(`file://${__dirname}/output/${reportFilename}`)
    .evaluate(() => window.chartData);
}
