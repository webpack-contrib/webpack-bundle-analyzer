#! /usr/bin/env node

const { resolve, dirname } = require('path');

const _ = require('lodash');
const commander = require('commander');
const { magenta } = require('chalk');

const Logger = require('../Logger');
const analyzer = require('../analyzer');

const program = commander
  .version(require('../../package.json').version)
  .usage(
`<bundleStatsFile> [bundleDir] [options]

  Arguments:

    bundleStatsFile  Path to Webpack Stats JSON file.
    bundleDir        Directory containing all generated bundles.
                     You should provided it if you want analyzer to show you the real parsed module sizes.
                     By default a directory of stats file is used.`
  )
  .option(
    '-m, --mode <mode>',
    'Analyzer mode. Should be `server` or `static`.' +
    br('In `server` mode analyzer will start HTTP server to show bundle report.') +
    br('In `static` mode single HTML file with bundle report will be generated.') +
    br('Default is `server`.'),
    'server'
  )
  .option(
    '-r, --reporter <reporter>',
    'The reporter package to use, e.g. @webpack-bundle-analyzer/reporter-treemap'
  )
  .option(
    '-R, --reporter-options <options>',
    'The options to pass to the reporter you use as a valid JSON object.' +
    br('Consult the reporter documentation for available options.'),
    '{}'
  )
  .parse(process.argv);

let {
  mode,
  reporter,
  reporterOptions,
  args: [bundleStatsFile, bundleDir]
} = program;

if (!bundleStatsFile) showHelp('Provide path to Webpack Stats file as first argument');
if (mode !== 'server' && mode !== 'static') showHelp('Invalid mode. Should be either `server` or `static`.');
if (!reporter) {
  // TODO: Improve this error message a lot, as this will be the first
  // error of backwards-incompatibility compared to v2
  throw new Error('reporter is not set!');
}
if (typeof reporter !== 'string') {
  // TODO: Improve this error message
  throw new Error('reporter is not a string!');
}
reporter = require(reporter);
// TODO: Allow same format as webpack --env flag, i.e.
// `--reporter-options.host=1234` to set `reporterOptions = { host: 1234 }`
reporterOptions = JSON.parse(reporterOptions);

if (typeof reporterOptions !== 'object') {
  throw new Error('reporterOptions must be an object!');
}

bundleStatsFile = resolve(bundleStatsFile);

if (!bundleDir) bundleDir = dirname(bundleStatsFile);

let bundleStats;
try {
  bundleStats = analyzer.readStatsFromFile(bundleStatsFile);
} catch (err) {
  console.error(`Could't read webpack bundle stats from "${bundleStatsFile}":\n${err}`);
  process.exit(1);
}

const logger = new Logger();
const chartData = analyzer.getChartData(logger, bundleStats, bundleDir);

if (mode === 'server') {
  reporter.createReporter(chartData, {
    ...reporterOptions,
    bundleDir,
    logger
  });
} else {
  reporter.generateReport(chartData, {
    ...reporterOptions,
    bundleDir,
    logger
  });
}

function showHelp(error) {
  if (error) console.log(`\n  ${magenta(error)}`);
  program.outputHelp();
  process.exit(1);
}

function br(str) {
  return `\n${_.repeat(' ', 28)}${str}`;
}
