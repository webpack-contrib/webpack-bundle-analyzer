#! /usr/bin/env node

const { resolve, dirname } = require('path');

const _ = require('lodash');
const commander = require('commander');
const { magenta } = require('chalk');

const analyzer = require('../analyzer');
const viewer = require('../viewer');

const SIZES = new Set(['stat', 'parsed', 'gzip']);

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
    '-h, --host <host>',
    'Host that will be used in `server` mode to start HTTP server.' +
    br('Default is `127.0.0.1`.'),
    '127.0.0.1'
  )
  .option(
    '-p, --port <n>',
    'Port that will be used in `server` mode to start HTTP server.' +
    br('Default is 8888.'),
    Number,
    8888
  )
  .option(
    '-r, --report <file>',
    'Path to bundle report file that will be generated in `static` mode.' +
    br('Default is `report.html`.'),
    'report.html'
  )
  .option(
    '-s, --default-sizes <type>',
    'Module sizes to show in treemap by default.' +
    br(`Possible values: ${[...SIZES].join(', ')}`) +
    br('Default is `parsed`.'),
    'parsed'
  )
  .option(
    '-O, --no-open',
    "Don't open report in default browser automatically."
  )
  .parse(process.argv);

let {
  mode,
  host,
  port,
  report: reportFilename,
  defaultSizes,
  open: openBrowser,
  args: [bundleStatsFile, bundleDir]
} = program;

if (!bundleStatsFile) showHelp('Provide path to Webpack Stats file as first argument');
if (mode !== 'server' && mode !== 'static') showHelp('Invalid mode. Should be either `server` or `static`.');
if (mode === 'server' && !host) showHelp('Invalid host name');
if (mode === 'server' && isNaN(port)) showHelp('Invalid port number');
if (!SIZES.has(defaultSizes)) showHelp(`Invalid default sizes option. Possible values are: ${[...SIZES].join(', ')}`);

bundleStatsFile = resolve(bundleStatsFile);

if (!bundleDir) bundleDir = dirname(bundleStatsFile);

let bundleStats;
try {
  bundleStats = analyzer.readStatsFromFile(bundleStatsFile);
} catch (err) {
  console.error(`Could't read webpack bundle stats from "${bundleStatsFile}":\n${err}`);
  process.exit(1);
}

if (mode === 'server') {
  viewer.startServer(bundleStats, {
    openBrowser,
    port,
    host,
    defaultSizes,
    bundleDir
  });
} else {
  viewer.generateReport(bundleStats, {
    openBrowser,
    reportFilename: resolve(reportFilename),
    defaultSizes,
    bundleDir
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
