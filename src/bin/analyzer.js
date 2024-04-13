#! /usr/bin/env node

const {resolve, dirname} = require('path');

const commander = require('commander');
const {magenta} = require('picocolors');

const analyzer = require('../analyzer');
const viewer = require('../viewer');
const Logger = require('../Logger');
const utils = require('../utils');

const options = require("./bundle-analyzer-flags.js");
const { cli } = require("webpack");

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

  const logger = new Logger(logLevel);

  Object.entries(options).forEach(([key, value]) => {
    const optionName = key.replace(/([A-Z])/g, "-$1").toLowerCase();
    const defaultValue = value.configs[0].defaultValue;
    const description = value.description;
  
    switch (value.configs[0].type) {
      case "boolean":
        program.option(
          `-${optionName.charAt(0)}, --${optionName}`,
          description,
          defaultValue
        );
        break;
      case "enum":
        const values = value.configs[0].values.join("|");
        program.option(
          `-${optionName.charAt(0)}, --${optionName} <${values}>`,
          description,
          defaultValue
        );
        break;
      case "string":
      case "number":
        program.option(
          `-${optionName.charAt(0)}, --${optionName} <value>`,
          description,
          defaultValue.toString()
        );
        break;
      default:
        logger.warn(`Unknown type: ${value.configs[0].type}`);
    }
  });
  
  program.parse(process.argv);

let [bundleStatsFile, bundleDir] = program.args;
let {
  mode,
  host,
  port,
  report: reportFilename,
  title: reportTitle,
  defaultSizes,
  logLevel,
  open: openBrowser,
  exclude: excludeAssets
} = program.opts();

try {
  cli.processArguments(options, process.argv);
} catch (problem) {
  logger.error(`An error occurred processing arguments: ${problem}`);
  process.exit(1);
}

if (typeof reportTitle === 'undefined') {
  reportTitle = utils.defaultTitle;
}

if (!bundleStatsFile) showHelp('Provide path to Webpack Stats file as first argument');
if (mode !== 'server' && mode !== 'static' && mode !== 'json') {
  showHelp('Invalid mode. Should be either `server`, `static` or `json`.');
}
if (mode === 'server') {
  if (!host) showHelp('Invalid host name');

  port = port === 'auto' ? 0 : Number(port);
  if (isNaN(port)) showHelp('Invalid port. Should be a number or `auto`');
}
if (!SIZES.has(defaultSizes)) showHelp(`Invalid default sizes option. Possible values are: ${[...SIZES].join(', ')}`);

bundleStatsFile = resolve(bundleStatsFile);

if (!bundleDir) bundleDir = dirname(bundleStatsFile);

parseAndAnalyse(bundleStatsFile);

async function parseAndAnalyse(bundleStatsFile) {
  try {
    const bundleStats = await analyzer.readStatsFromFile(bundleStatsFile);
    if (mode === 'server') {
      viewer.startServer(bundleStats, {
        openBrowser,
        port,
        host,
        defaultSizes,
        reportTitle,
        bundleDir,
        excludeAssets,
        logger: new Logger(logLevel),
        analyzerUrl: utils.defaultAnalyzerUrl
      });
    } else if (mode === 'static') {
      viewer.generateReport(bundleStats, {
        openBrowser,
        reportFilename: resolve(reportFilename || 'report.html'),
        reportTitle,
        defaultSizes,
        bundleDir,
        excludeAssets,
        logger: new Logger(logLevel)
      });
    } else if (mode === 'json') {
      viewer.generateJSONReport(bundleStats, {
        reportFilename: resolve(reportFilename || 'report.json'),
        bundleDir,
        excludeAssets,
        logger: new Logger(logLevel)
      });
    }
  } catch (err) {
    logger.error(`Couldn't read webpack bundle stats from "${bundleStatsFile}":\n${err}`);
    logger.debug(err.stack);
    process.exit(1);
  }
}

function showHelp(error) {
  if (error) console.log(`\n  ${magenta(error)}\n`);
  program.outputHelp();
  process.exit(1);
}

function br(str) {
  return `\n${' '.repeat(28)}${str}`;
}

function array() {
  const arr = [];
  return (val) => {
    arr.push(val);
    return arr;
  };
}
