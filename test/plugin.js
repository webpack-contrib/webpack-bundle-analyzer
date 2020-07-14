const fs = require('fs');
const del = require('del');
const _ = require('lodash');
const path = require('path');
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

  it('should allow to generate json report', async function () {
    const config = makeWebpackConfig({
      analyzerOpts: {
        analyzerMode: 'json'
      }
    });

    await webpackCompile(config);

    const chartData = await getChartDataFromJSONReport();
    expect(chartData).to.exist;
  });

  it('should support webpack config with `multi` module', async function () {
    const config = makeWebpackConfig();

    config.entry.bundle = [
      './src/a.js',
      './src/b.js'
    ];

    await webpackCompile(config);

    const chartData = await getChartDataFromReport();
    expect(chartData[0].groups).to.containSubset([
      {
        label: 'multi ./src/a.js ./src/b.js',
        path: './multi ./src/a.js ./src/b.js',
        groups: undefined
      }
    ]);
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

    describe('reportTitle', function () {
      it('should have a sensible default', async function () {
        const config = makeWebpackConfig();

        await webpackCompile(config);

        const generatedReportTitle = await getTitleFromReport();

        expect(generatedReportTitle).to.match(/^umi-webpack-bundle-analyzer \[.* at \d{2}:\d{2}\]/u);
      });
      it('should use a string', async function () {
        const reportTitle = 'A string report title';
        const config = makeWebpackConfig({
          analyzerOpts: {
            reportTitle
          }
        });

        await webpackCompile(config);

        const generatedReportTitle = await getTitleFromReport();

        expect(generatedReportTitle).to.equal(reportTitle);
      });
      it('should use a function', async function () {
        const reportTitleResult = 'A string report title';
        const config = makeWebpackConfig({
          analyzerOpts: {
            reportTitle: () => reportTitleResult
          }
        });

        await webpackCompile(config);

        const generatedReportTitle = await getTitleFromReport();

        expect(generatedReportTitle).to.equal(reportTitleResult);
      });
      it('should propogate an error in a function', async function () {
        const reportTitleError = new Error();
        const config = makeWebpackConfig({
          analyzerOpts: {
            reportTitle: () => {throw reportTitleError}
          }
        });

        let error = null;
        try {
          await webpackCompile(config);
        } catch (e) {
          error = e;
        }

        expect(error).to.equal(reportTitleError);
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

  function getChartDataFromJSONReport(reportFilename = 'report.json') {
    return require(path.resolve(__dirname, `output/${reportFilename}`));
  }

  async function getTitleFromReport(reportFilename = 'report.html') {
    return await nightmare.goto(`file://${__dirname}/output/${reportFilename}`).title();
  }

  async function getChartDataFromReport(reportFilename = 'report.html') {
    return await nightmare.goto(`file://${__dirname}/output/${reportFilename}`).evaluate(() => window.chartData);
  }
});
