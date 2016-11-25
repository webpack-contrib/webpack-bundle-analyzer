const fs = require('fs');
const del = require('del');
const Nightmare = require('nightmare');
const nightmare = Nightmare();

describe('Webpack config', function () {
  this.timeout(5000);

  before(function () {
    del.sync(`${__dirname}/output`);
    this.clock = sinon.useFakeTimers();
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

    expect(fs.existsSync(`${__dirname}/output/bundle.js`)).to.be.true;
    expect(fs.existsSync(`${__dirname}/output/report.html`)).to.be.true;
    const chartData = await nightmare
      .goto(`file://${__dirname}/output/report.html`)
      .evaluate(() => window.chartData);
    expect(chartData[0]).to.containSubset({
      parsedSize: 2776,
      statSize: 2776
    });
  });
});
