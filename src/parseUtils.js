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
      CallExpression: (node, state) => {
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
          args.length === 1 &&
          isArgumentContainsModulesList(args[0])
        ) {
          state.sizes = getModulesSizesFromFunctionArgument(args[0]);
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
  // It's an anonymous function expression
  return (node.type === 'FunctionExpression' && !node.id);
}

function getModulesSizesFromFunctionArgument(arg) {
  if (arg.type === 'ObjectExpression') {
    const modulesNodes = arg.properties;

    return _.transform(modulesNodes, (result, moduleNode) => {
      const moduleId = moduleNode.key.name || moduleNode.key.value;
      const moduleBody = moduleNode.value.body;

      result[moduleId] = moduleBody.end - moduleBody.start;
    }, {});
  }

  if (arg.type === 'ArrayExpression') {
    const modulesNodes = arg.elements;

    return _.transform(modulesNodes, (result, moduleNode, i) => {
      if (!moduleNode) return;

      result[i] = moduleNode.body.end - moduleNode.body.start;
    }, {});
  }

  return {};
}
