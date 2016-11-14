const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const gzipSize = require('gzip-size');

const { Folder } = require('../lib/tree');
const { parseBundle } = require('../lib/parseUtils');

module.exports = {
  getViewerData,
  readStatsFromFile
};

function getViewerData(bundleStats, bundleDir) {
  // Picking only `*.js` assets from bundle that has non-empty `chunks` array
  bundleStats.assets = _.filter(bundleStats.assets, asset =>
    _.endsWith(asset.name, '.js') && !_.isEmpty(asset.chunks)
  );

  // Trying to parse bundle assets and get real module sizes if `bundleDir` is provided
  let parsedModuleSizes = null;
  let bundlesSources = {};
  let parsedModules = {};

  if (bundleDir) {
    for (const statAsset of bundleStats.assets) {
      const assetFile = path.join(bundleDir, statAsset.name);
      let bundleInfo;

      try {
        bundleInfo = parseBundle(assetFile);
      } catch (err) {
        bundleInfo = null;
      }

      if (bundleInfo) {
        bundlesSources[statAsset.name] = bundleInfo.src;
        _.assign(parsedModules, bundleInfo.modules);
      } else {
        console.log(
          `\nCouldn't parse bundle asset "${assetFile}".\n` +
          'Analyzer will use module sizes from stats file.\n'
        );
        parsedModules = null;
        bundlesSources = null;
        break;
      }
    }

    if (parsedModules) {
      parsedModuleSizes = _.mapValues(parsedModules,
        moduleSrc => ({
          raw: moduleSrc.length,
          gzip: gzipSize.sync(moduleSrc)
        })
      );
    }
  }

  const assets = _.transform(bundleStats.assets, (result, statAsset) => {
    const asset = result[statAsset.name] = _.pick(statAsset, 'size');

    if (bundlesSources) {
      asset.parsedSize = bundlesSources[statAsset.name].length;
      asset.gzipSize = gzipSize.sync(bundlesSources[statAsset.name]);
    }

    // Picking modules from current bundle script
    asset.modules = _(bundleStats.modules)
      .filter(statModule => assetHasModule(statAsset, statModule))
      .each(statModule => {
        if (parsedModuleSizes) {
          statModule.parsedSize = parsedModuleSizes[statModule.id].raw;
          statModule.gzipSize = parsedModuleSizes[statModule.id].gzip;
        }
      });

    asset.tree = createModulesTree(asset.modules);
  }, {});

  return _.transform(assets, (result, asset, filename) => {
    result.push({
      label: filename,
      statSize: asset.size,
      parsedSize: asset.parsedSize,
      gzipSize: asset.gzipSize,
      groups: _.invokeMap(asset.tree.children, 'toChartData')
    });
  }, []);
}

function readStatsFromFile(filename) {
  return JSON.parse(
    fs.readFileSync(filename, 'utf8')
  );
}

function assetHasModule(statAsset, statModule) {
  return _.some(statModule.chunks, moduleChunk =>
    _.includes(statAsset.chunks, moduleChunk)
  );
}

function createModulesTree(modules) {
  const root = new Folder('.');

  _.each(modules, module => {
    const path = getModulePath(module.name);
    root.addFileByPath(path, module);
  });

  return root;
}

function getModulePath(path) {
  return _(path)
    .split('/')
    .slice(1)
    .map(part => (part === '~') ? 'node_modules' : part)
    .value();
}
