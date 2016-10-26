#! /usr/bin/env node

const path = require('path');

const commander = require('commander');
const { magenta } = require('chalk');

const analyzer = require('../analyzer');
const viewer = require('../viewer');

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
    '-p, --port <n>',
    'Port that will be used by bundle analyzer to start HTTP server.',
    Number,
    8888
  )
  .parse(process.argv);

let {
  port,
  args: [bundleStatsFile, bundleDir]
} = program;

if (!bundleStatsFile) showHelp('Provide path to Webpack Stats file as first argument');
if (isNaN(port)) showHelp('Invalid port number');

if (!bundleDir) bundleDir = path.dirname(bundleStatsFile);

let bundleStats;
try {
  bundleStats = analyzer.readStatsFromFile(bundleStatsFile);
} catch (err) {
  console.error(`Could't read webpack bundle stats from "${bundleStatsFile}":\n${err}`);
  process.exit(1);
}

viewer.start(bundleStats, { bundleDir, port });

function showHelp(error) {
  if (error) console.log(`\n  ${magenta(error)}`);
  program.outputHelp();
  process.exit(1);
}
