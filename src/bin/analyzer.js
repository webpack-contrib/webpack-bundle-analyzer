#! /usr/bin/env node

'use strict';

const analyzer = require('../analyzer');
const viewer = require('../viewer');

const [bundleStatsFile, bundleDir] = process.argv.slice(2);

let bundleStats;
try {
  bundleStats = analyzer.readStatsFromFile(bundleStatsFile);
} catch (err) {
  console.error(`Could't read webpack bundle stats from "${bundleStatsFile}":\n${err}`);
  process.exit(1);
}

viewer.start(bundleStats, { bundleDir });
