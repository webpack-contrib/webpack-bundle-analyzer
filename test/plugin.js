const fs = require('fs');
const del = require('del');
const _ = require('lodash');

const BundleAnalyzerPlugin = require('../lib/BundleAnalyzerPlugin');

describe('Plugin', function () {
  describe('options', function () {
    it('should be optional', function () {
      expect(() => new BundleAnalyzerPlugin()).not.to.throw();
    });
  });
});

describe('Plugin', function () {
  let nightmare;

  this.timeout(3000);

  before(function () {
    const Nightmare = require('nightmare');
    nightmare = Nightmare();
    del.sync(`${__dirname}/output`);
  });

  beforeEach(async function () {
    this.timeout(15000);
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

    describe('generator json', function () {
      it('should get json report', async function () {
        const config = makeWebpackConfig({
          analyzerOpts: {
            analyzerMode: 'disabled',
            generateStatsFile: true
          }
        });

        await webpackCompile(config);
        const {statsFilename = 'stats.json'} = config;
        expect(fs.existsSync(`${__dirname}/output/${statsFilename}`), 'report file missing').to.be.true;
      });

      it('should set output dir', async function () {
        const bundleDir = `${__dirname}/dist`;
        const config = makeWebpackConfig({
          analyzerOpts: {
            analyzerMode: 'disabled',
            generateReportFile: true,
            reportDir: bundleDir,
            reportDepth: 1
          }
        });

        await webpackCompile(config);
        await expectValidBundleReport(config, bundleDir);
        del.sync(bundleDir);
      });

      it('should shaking node_modules', async function () {
        const config = makeWebpackConfig({
          analyzerOpts: {
            analyzerMode: 'disabled',
            generateReportFile: true,
            reportDepth: 1
          }
        });

        await webpackCompile(config);
        await expectValidBundleReport(config);
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

async function expectValidBundleReport(opts, bundleDir = `${__dirname}/output`) {
  const {
    statsFilename = 'stats.json'
  } = opts || {};

  const statsFilePath = `${bundleDir}/${statsFilename}`;
  const compareFilePath = `${__dirname}/stats/bundle-report/bundle-report.json`;

  expect(fs.existsSync(statsFilePath), 'stats file missing').to.be.true;
  expect(
    getDataFromReport(statsFilePath)
  ).to.deep.equal(
    getDataFromReport(compareFilePath)
  );
}

async function getChartDataFromReport(reportFilename = 'report.html') {
  return await nightmare
    .goto(`file://${__dirname}/output/${reportFilename}`)
    .evaluate(() => window.chartData);
}

function getDataFromReport(reportPath) {
  const content = fs.readFileSync(reportPath, 'utf8');
  const json = JSON.parse(content);
  return json;
}