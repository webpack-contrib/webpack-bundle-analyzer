# Changelog

> **Tags:**
> - [Breaking Change]
> - [New Feature]
> - [Improvement]
> - [Bug Fix]
> - [Internal]
> - [Documentation]

_Note: Gaps between patch versions are faulty, broken or test releases._

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
