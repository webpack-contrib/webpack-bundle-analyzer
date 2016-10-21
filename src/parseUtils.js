'use strict';

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
      CallExpression: (node, state, c) => {
        if (state.sizes) return;

        const args = node.arguments;

        if (_.get(node, 'callee.name') === 'webpackJsonp') {
          // Additional bundle without webpack loader
          // Modules are stored in second argument
          state.sizes = getModulesSizesFromFunctionArgument(args[1]);
          return;
        }

        if (
          args.length === 1 &&
          (args[0].type === 'ObjectExpression' || args[0].type === 'ArrayExpression')
        ) {
          // Main bundle with webpack loader
          // Modules are stored in first argument
          state.sizes = getModulesSizesFromFunctionArgument(args[0]);
          return;
        }

        // Continue searching
        c(node, state);
      }
    }
  );

  return walkState.sizes;
}

function getModulesSizesFromFunctionArgument(arg) {
  if (arg.type === 'ObjectExpression') {
    const modulesNodes = arg.properties;

    return _.transform(modulesNodes, (result, moduleNode) => {
      const moduleBody = moduleNode.value.body;

      result[moduleNode.key.value] = moduleBody.end - moduleBody.start;
    }, {});
  } else {
    const modulesNodes = arg.elements;

    return _.transform(modulesNodes, (result, moduleNode, i) => {
      if (!moduleNode) return;

      result[i] = moduleNode.body.end - moduleNode.body.start;
    }, {});
  }
}
