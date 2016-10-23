const fs = require('fs');
const path = require('path');

const _ = require('lodash');

const { Folder } = require('../lib/tree');
const { getModuleSizesFromBundle } = require('../lib/parseUtils');

module.exports = {
  getChartData,
  readStatsFromFile
};

function getChartData(bundleStats, bundleDir) {
  // Picking only `*.js` assets from bundle that has non-empty `chunks` array
  bundleStats.assets = _.filter(bundleStats.assets, asset =>
    _.endsWith(asset.name, '.js') && !_.isEmpty(asset.chunks)
  );

  // Real module sizes got by parsing assets
  let parsedModuleSizes = null;

  if (bundleDir) {
    // Checking if all assets are exist
    const bundleScriptsFound = _.every(bundleStats.assets, statAsset => {
      const assetFile = path.resolve(bundleDir, statAsset.name);
      const assetExists = fs.existsSync(assetFile);

      if (!assetExists) {
        console.log(
          `\nUnable to find bundle asset "${assetFile}".\n` +
          'Analyzer will use module sizes from stats file.\n'
        );
      }

      return assetExists;
    });

    if (bundleScriptsFound) {
      // Parsing assets and getting real module sizes
      parsedModuleSizes = _.transform(bundleStats.assets, (result, statAsset) => {
        _.assign(result,
          getModuleSizesFromBundle(path.resolve(bundleDir, statAsset.name))
        );
      }, {});
    }
  }

  const assets = _.transform(bundleStats.assets, (result, statAsset) => {
    const bundleFilename = statAsset.name;
    const asset = result[bundleFilename] = _.pick(statAsset, 'size');

    // Picking modules from current bundle script
    asset.modules = _(bundleStats.modules)
      .filter(statModule => assetHasModule(statAsset, statModule))
      .each(statModule => {
        if (parsedModuleSizes) {
          statModule.parsedSize = parsedModuleSizes[statModule.id];
        }
      });

    asset.tree = createModulesTree(asset.modules);
  }, {});

  return _.transform(assets, (result, asset, filename) => {
    const statSize = asset.tree.size;
    const parsedSize = parsedModuleSizes ? asset.tree.parsedSize : undefined;

    result.push({
      label: filename,
      weight: (parsedSize === undefined) ? statSize : parsedSize,
      statSize,
      parsedSize,
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
