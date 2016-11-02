const fs = require('fs');
const _ = require('lodash');
const acorn = require('acorn');
const walk = require('acorn/dist/walk');

module.exports = {
  getModuleSizesFromBundle
};

function getModuleSizesFromBundle(bundlePath) {
  const ast = acorn.parse(
    fs.readFileSync(bundlePath, 'utf8'), {
      sourceType: 'script'
    }
  );

  const walkState = {
    sizes: null
  };

  walk.recursive(
    ast,
    walkState,
    {
      CallExpression(node, state, c) {
        if (state.sizes) return;

        const args = node.arguments;

        // Additional bundle without webpack loader
        // Modules are stored in second argument:
        // webpackJsonp([<chunks>], <modules>)
        if (_.get(node, 'callee.name') === 'webpackJsonp') {
          state.sizes = getModulesSizesFromFunctionArgument(args[1]);
          return;
        }

        // Main bundle with webpack loader
        // Modules are stored in first argument:
        // (function (...) {...})(<modules>)
        if (
          node.callee.type === 'FunctionExpression' &&
          !node.callee.id &&
          args.length === 1
        ) {
          const [arg] = args;

          if (arg.type === 'CallExpression') {
            // DedupePlugin and maybe some others wrap modules in additional self-invoking function expression.
            // Walking into it.
            return c(arg, state);
          } else if (isArgumentContainsModulesList(arg)) {
            state.sizes = getModulesSizesFromFunctionArgument(arg);
          }
        }
      }
    }
  );

  return walkState.sizes;
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

  return false;
}

function isModuleWrapper(node) {
  return (
    // It's an anonymous function expression that wraps module
    (node.type === 'FunctionExpression' && !node.id) ||
    // If `DedupePlugin` is used it can be an ID of duplicated module
    (node.type === 'Literal' && (typeof node.value === 'number' || typeof node.value === 'string'))
  );
}

function getModulesSizesFromFunctionArgument(arg) {
  if (arg.type === 'ObjectExpression') {
    const modulesNodes = arg.properties;

    return _.transform(modulesNodes, (result, moduleNode) => {
      const moduleId = moduleNode.key.name || moduleNode.key.value;

      result[moduleId] = getModuleSize(moduleNode.value);
    }, {});
  }

  if (arg.type === 'ArrayExpression') {
    const modulesNodes = arg.elements;

    return _.transform(modulesNodes, (result, moduleNode, i) => {
      if (!moduleNode) return;

      result[i] = getModuleSize(moduleNode);
    }, {});
  }

  return {};
}

function getModuleSize(node) {
  if (node.type === 'FunctionExpression') {
    return node.body.end - node.body.start;
  }

  if (node.type === 'Literal') {
    return node.end - node.start;
  }

  // Fallback for unknown node types
  return 0;
}
