const fs = require('fs');
const del = require('del');
const childProcess = require('child_process');

let nightmare;

describe('Analyzer', function () {
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

  it('should support stats files with all the information in `children` array', async function () {
    generateReportFrom('with-children-array.json');
    await expectValidReport();
  });
});

function generateReportFrom(statsFilename) {
  childProcess.execSync(`../lib/bin/analyzer.js -m static -r output/report.html -O stats/${statsFilename}`, {
    cwd: __dirname
  });
}

async function expectValidReport(opts) {
  const {
    bundleLabel = 'bundle.js',
    statSize = 141
  } = opts || {};

  expect(fs.existsSync(`${__dirname}/output/report.html`)).to.be.true;
  const chartData = await nightmare
    .goto(`file://${__dirname}/output/report.html`)
    .evaluate(() => window.chartData);
  expect(chartData[0]).to.containSubset({
    label: bundleLabel,
    statSize
  });
}
