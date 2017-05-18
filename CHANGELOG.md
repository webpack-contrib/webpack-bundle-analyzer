# Changelog

> **Tags:**
> - [Breaking Change]
> - [New Feature]
> - [Improvement]
> - [Bug Fix]
> - [Internal]
> - [Documentation]

_Note: Gaps between patch versions are faulty, broken or test releases._

## 2.8.2
 * **Improvement**
   * Greatly improved accuracy of gzip sizes
 
 * **Bug Fix**
   * Generate report file in the bundle output directory when used with Webpack Dev Server (fixes #75)

## 2.8.1
 * **Improvement**
   * Improve warning message when analyzer client couldn't connect to WebSocket server

## 2.8.0
 * **Improvement**
   * Analyzer now supports `webpack --watch` and Webpack Dev Server!
     It will automatically update modules treemap according to changes in the sources via WebSockets!
 
 * **Internal**
   * Use `babel-preset-env` and two different Babel configs to compile node and browser code
   * Update deps

## 2.7.0
 * **New Feature**
   * Add control to sidebar that allows to choose shown chunks (closes #71 and partially addresses #38)

## 2.6.0
 * **New Feature**
   * Add `defaultSizes` option (closes #52)

## 2.5.0
 * **New Feature**
   * Added `--host` CLI option (@difelice)

## 2.4.1
 * **Improvement**
   * Support `NamedChunksPlugin` (@valscion)

## 2.4.0
 * **Bug Fix**
   * Fix `TypeError: currentFolder.addModule is not a function`
  
 * **Internal**
   * Update deps

## 2.3.1
 * **Improvement**
   * Improve compatibility with Webpack 2 (@valscion)

## 2.3.0
 * **Improvement**
   * Add `analyzerHost` option (@freaz)
  
 * **Internal**
   * Update deps

## 2.2.3
 * **Bug Fix**
   * Support bundles that uses `Array.concat` expression in modules definition (@valscion)

## 2.2.1
 * **Bug Fix**
   * Fix regression in analyzing stats files with non-empty `children` property (@gbakernet)

## 2.2.0
 * **Improvement**
   * Improve treemap sharpness on hi-res displays (fixes #33)
   * Add support for stats files with all the information under `children` property (fixes #10)

 * **Internal**
   * Update deps

## 2.1.1
 * **Improvement**
   * Add support for `output.jsonpFunction` webpack config option (fixes #16)

## 2.1.0
 * **New Feature**
   * Add `logLevel` option (closes #19)

## 2.0.1
 * **Bug Fix**
   * Support query in bundle filenames (fixes #22)

 * **Internal**
   * Minimize CSS for report UI

## 2.0.0
 * **New Feature**
   * Analyzer now also shows gzipped sizes (closes #6)
   * Added switcher that allows to choose what sizes will be used to generate tree map.
     Just move your mouse to the left corner of the browser and settings sidebar will appear.

 * **Bug Fix**
   * Properly show sizes for some asset modules (e.g. CSS files loaded with `css-loader`)

 * **Internal**
   * Completely rewritten analyzer UI. Now uses Preact and Webpack 2.

## 1.5.4

 * **Bug Fix**
   * Fix bug when Webpack build is being controlled by some wrapper like `grunt-webpack` (see #21)

## 1.5.3

 * **Bug Fix**
   * Workaround `Express` bug that caused wrong `ejs` version to be used as view engine (fixes #17)

## 1.5.2
 
 * **Bug Fix**
   * Support array module descriptors that can be generated if `DedupePlugin` is used (fixes #4)

## 1.5.1
 
 * **Internal**
   * Plug analyzer to Webpack compiler `done` event instead of `emit`. Should fix #15.

## 1.5.0
 
 * **New Feature**
   * Add `statsOptions` option for `BundleAnalyzerPlugin`

## 1.4.2
 
 * **Bug Fix**
   * Fix "Unable to find bundle asset" error when bundle name starts with `/` (fixes #3)

## 1.4.1
 
 * **Bug Fix**
   * Add partial support for `DedupePlugin` (see #4 for more info)

## 1.4.0
 
 * **New Feature**
   * Add "static report" mode (closes #2)

## 1.3.0
 
 * **Improvement**
   * Add `startAnalyzer` option for `BundleAnalyzerPlugin` (fixes #1)
 * **Internal**
   * Make module much slimmer - remove/replace bloated dependencies

## 1.2.5

 * Initial public release
