const fs = require('fs');
const _ = require('lodash');
const acorn = require('acorn');
const walk = require('acorn/dist/walk');

module.exports = {
  parseBundle
};

function parseBundle(bundlePath) {
  const contentBuffer = fs.readFileSync(bundlePath);
  const contentStr = contentBuffer.toString('utf8');
  const ast = acorn.parse(contentStr, { sourceType: 'script' });

  const walkState = {
    locations: null
  };

  walk.recursive(
    ast,
    walkState,
    {
      CallExpression(node, state, c) {
        if (state.sizes) return;

        const args = node.arguments;

        // Additional bundle without webpack loader.
        // Modules are stored in second argument, after chunk ids:
        // webpackJsonp([<chunks>], <modules>, ...)
        // As function name may be changed with `output.jsonpFunction` option we can't rely on it's default name.
        if (
          node.callee.type === 'Identifier' &&
          args.length >= 2 &&
          isArgumentContainsChunkIds(args[0]) &&
          isArgumentContainsModulesList(args[1])
        ) {
          state.locations = getModulesLocationFromFunctionArgument(args[1]);
          return;
        }

        // Main bundle with webpack loader
        // Modules are stored in first argument:
        // (function (...) {...})(<modules>)
        if (
          node.callee.type === 'FunctionExpression' &&
          !node.callee.id &&
          args.length === 1 &&
          isArgumentContainsModulesList(args[0])
        ) {
          state.locations = getModulesLocationFromFunctionArgument(args[0]);
          return;
        }

        // Walking into arguments because some of plugins (e.g. `DedupePlugin`) or some Webpack
        // features (e.g. `umd` library output) can wrap modules list into additional IIFE.
        _.each(args, arg => c(arg, state));
      }
    }
  );

  if (!walkState.locations) {
    return null;
  }

  return {
    src: contentStr,
    modules: _.mapValues(walkState.locations,
      loc => contentBuffer.toString('utf8', loc.start, loc.end)
    )
  };
}

function isArgumentContainsChunkIds(arg) {
  // Array of numeric ids
  return (arg.type === 'ArrayExpression' && _.every(arg.elements, isNumericId));
}

function isArgumentContainsModulesList(arg) {
  if (arg.type === 'ObjectExpression') {
    return _(arg.properties)
      .map('value')
      .every(isModuleWrapper);
  }

  if (arg.type === 'ArrayExpression') {
    // Modules are contained in array.
    // Array indexes are module ids
    return _.every(arg.elements, elem =>
      // Some of array items may be skipped because there is no module with such id
      !elem ||
      isModuleWrapper(elem)
    );
  }

  const arrayCallExpression = getArrayCallExpression(arg);
  if (arrayCallExpression) {
    const modulesNodes = arrayCallExpression.modulesNodes;
    return _.every(modulesNodes, elem =>
        // Some of array items may be skipped because there is no module with such id
      !elem ||
      isModuleWrapper(elem)
    );
  }

  return false;
}

function isModuleWrapper(node) {
  return (
    // It's an anonymous function expression that wraps module
    (node.type === 'FunctionExpression' && !node.id) ||
    // If `DedupePlugin` is used it can be an ID of duplicated module...
    isModuleId(node) ||
    // or an array of shape [<module_id>, ...args]
    (node.type === 'ArrayExpression' && node.elements.length > 1 && isModuleId(node.elements[0]))
  );
}

function isModuleId(node) {
  return (node.type === 'Literal' && (isNumericId(node) || typeof node.value === 'string'));
}

function isNumericId(node) {
  return (node.type === 'Literal' && Number.isInteger(node.value) && node.value >= 0);
}

function getModulesLocationFromFunctionArgument(arg) {
  if (arg.type === 'ObjectExpression') {
    const modulesNodes = arg.properties;

    return _.transform(modulesNodes, (result, moduleNode) => {
      const moduleId = moduleNode.key.name || moduleNode.key.value;

      result[moduleId] = getModuleLocation(moduleNode.value);
    }, {});
  }

  if (arg.type === 'ArrayExpression') {
    const modulesNodes = arg.elements;

    return _.transform(modulesNodes, (result, moduleNode, i) => {
      if (!moduleNode) return;

      result[i] = getModuleLocation(moduleNode);
    }, {});
  }

  const arrayCallExpression = getArrayCallExpression(arg);
  if (arrayCallExpression) {
    const baseModuleId = arrayCallExpression.baseModuleId;
    const modulesNodes = arrayCallExpression.modulesNodes;

    return _.transform(modulesNodes, (result, moduleNode, i) => {
      if (!moduleNode) return;

      result[baseModuleId+i] = getModuleLocation(moduleNode);
    }, {});
  }

  return {};
}

function getArrayCallExpression(arg) {
  if (arg.type === 'CallExpression') {
    // Modules contained in an array initializer, like Array(<module_id>).concat(function,function,...)
    const callee = arg.callee;
    if (callee.type === 'MemberExpression') {
      const object = callee.object;
      if (object && object.type === 'CallExpression') {
        const objectCallee = object.callee;
        if (objectCallee.type === 'Identifier' && objectCallee.name === 'Array') {
          const objectArgs = object.arguments;
          if (objectArgs && objectArgs.length === 1 && objectArgs[0].type === 'Literal' && isModuleId(objectArgs[0])) {
            const baseModuleId = objectArgs[0].value;
            const property = callee.property;
            if (property.type === 'Identifier' && property.name === 'concat') {
              const args = arg.arguments;
              if (args && args.length === 1 && args[0].type === 'ArrayExpression') {
                const modulesNodes = args[0].elements;
                return {
                  baseModuleId: baseModuleId,
                  modulesNodes: modulesNodes
                };
              }
            }
          }
        }
      }
    }
  }
  return null;
}

function getModuleLocation(node) {
  if (node.type === 'FunctionExpression') {
    node = node.body;
  }

  return _.pick(node, 'start', 'end');
}
