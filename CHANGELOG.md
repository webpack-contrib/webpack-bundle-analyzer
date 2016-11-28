# Changelog

> **Tags:**
> - [Breaking Change]
> - [New Feature]
> - [Improvement]
> - [Bug Fix]
> - [Internal]
> - [Documentation]

_Note: Gaps between patch versions are faulty, broken or test releases._

## 2.1.1
 * **Improvement**
  * Add support for `output.jsonpFunction` webpack config option (fixes [#16])

## 2.1.0
 * **New Feature**
  * Add `logLevel` option (closes [#19])

## 2.0.1
 * **Bug Fix**
  * Support query in bundle filenames (fixes [#22])

 * **Internal**
  * Minimize CSS for report UI

## 2.0.0
 * **New Feature**
  * Analyzer now also shows gzipped sizes (closes [#6])
  * Added switcher that allows to choose what sizes will be used to generate tree map.
  Just move your mouse to the left corner of the browser and settings sidebar will appear.

 * **Bug Fix**
  * Properly show sizes for some asset modules (e.g. CSS files loaded with `css-loader`)

 * **Internal**
  * Completely rewritten analyzer UI. Now uses Preact and Webpack 2.

## 1.5.4

 * **Bug Fix**
  * Fix bug when Webpack build is being controlled by some wrapper like `grunt-webpack` (see [#21])

## 1.5.3

 * **Bug Fix**
  * Workaround `Express` bug that caused wrong `ejs` version to be used as view engine (fixes [#17])

## 1.5.2
 
 * **Bug Fix**
  * Support array module descriptors that can be generated if `DedupePlugin` is used (fixes [#4])

## 1.5.1
 
 * **Internal**
  * Plug analyzer to Webpack compiler `done` event instead of `emit`. Should fix [#15].

## 1.5.0
 
 * **New Feature**
  * Add `statsOptions` option for `BundleAnalyzerPlugin`

## 1.4.2
 
 * **Bug Fix**
  * Fix "Unable to find bundle asset" error when bundle name starts with `/` (fixes [#3])

## 1.4.1
 
 * **Bug Fix**
  * Add partial support for `DedupePlugin` (see [#4] for more info)

## 1.4.0
 
 * **New Feature**
  * Add "static report" mode (closes [#2])

## 1.3.0
 
 * **Improvement**
  * Add `startAnalyzer` option for `BundleAnalyzerPlugin` (fixes [#1])
 * **Internal**
  * Make module much slimmer - remove/replace bloated dependencies

## 1.2.5

 * Initial public release
