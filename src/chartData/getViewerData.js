const path = require('path');

const _ = require('lodash');
const gzipSize = require('gzip-size');

const { Folder } = require('./tree');
const parseBundle = require('./parseBundle');

const FILENAME_QUERY_REGEXP = /\?.*$/;

module.exports = getViewerData;

function getViewerData(bundleStats, bundleDir, opts) {
  if (!opts) {
    throw new Error('Options parameter is missing');
  }
  if (!opts.logger) {
    throw new Error('A logger is missing from the options parameter');
  }

  const {
    logger
  } = opts;

  // Sometimes all the information is located in `children` array (e.g. problem in #10)
  if (_.isEmpty(bundleStats.assets) && !_.isEmpty(bundleStats.children)) {
    bundleStats = bundleStats.children[0];
  }

  // Picking only `*.js` assets from bundle that has non-empty `chunks` array
  bundleStats.assets = _.filter(bundleStats.assets, asset => {
    // Removing query part from filename (yes, somebody uses it for some reason and Webpack supports it)
    // See #22
    asset.name = asset.name.replace(FILENAME_QUERY_REGEXP, '');

    return _.endsWith(asset.name, '.js') && !_.isEmpty(asset.chunks);
  });

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
        logger.warn(
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
      // Not using `asset.size` here provided by Webpack because it can be very confusing when `UglifyJsPlugin` is used.
      // In this case all module sizes from stats file will represent unminified module sizes, but `asset.size` will
      // be the size of minified bundle.
      statSize: asset.tree.size,
      parsedSize: asset.parsedSize,
      gzipSize: asset.gzipSize,
      groups: _.invokeMap(asset.tree.children, 'toChartData')
    });
  }, []);
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

    if (path) {
      root.addModuleByPath(path, module);
    }
  });

  return root;
}

function getModulePath(path) {
  const parsedPath = _
    // Removing loaders from module path: they're joined by `!` and the last part is a raw module path
    .last(path.split('!'))
    // Splitting module path into parts
    .split('/')
    // Removing first `.`
    .slice(1)
    // Replacing `~` with `node_modules`
    .map(part => (part === '~') ? 'node_modules' : part);

  return parsedPath.length ? parsedPath : null;
}
