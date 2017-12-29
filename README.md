[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![downloads][downloads]][downloads-url]

<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <h1>Webpack Bundle Analyzer</h1>
  <p>Visualize size of webpack output files with an interactive zoomable treemap.</p>
</div>

<h2 align="center">Install</h2>

```bash
npm install --save-dev webpack-bundle-analyzer
```

<h2 align="center">Usage (as a plugin)</h2>

```js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}
```

It will create an interactive treemap visualization of the contents of all your bundles.

![webpack bundle analyzer zoomable treemap](https://cloud.githubusercontent.com/assets/302213/20628702/93f72404-b338-11e6-92d4-9a365550a701.gif)

This module will help you:

1. Realize what's *really* inside your bundle
2. Find out what modules make up the most of its size
3. Find modules that got there by mistake
4. Optimize it!

And the best thing is it supports minified bundles! It parses them to get real size of bundled modules.
And it also shows their gzipped sizes!

<h2 align="center">Options (for plugin)</h2>

```js
new BundleAnalyzerPlugin(options?: object)
```

|Name|Type|Description|
|:--:|:--:|:----------|
|**`analyzerMode`**|One of: `server`, `static`, `disabled`|Default: `server`. In `server` mode analyzer will start HTTP server to show bundle report. In `static` mode single HTML file with bundle report will be generated. In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`. |
|**`analyzerHost`**|`{String}`|Default: `127.0.0.1`. Host that will be used in `server` mode to start HTTP server.|
|**`analyzerPort`**|`{Number}`|Default: `8888`. Port that will be used in `server` mode to start HTTP server.|
|**`reportFilename`**|`{String}`|Default: `report.html`. Path to bundle report file that will be generated in `static` mode. Relative to bundle output directory (which is `output.path` in webpack config).|
|**`defaultSizes`**|One of: `stat`, `parsed`, `gzip`|Default: `parsed`. Module sizes to show in report by default. [Size definitions](#size-definitions) section describes what these values mean.|
|**`openAnalyzer`**|`{Boolean}`|Default: `true`. Automatically open report in default browser.|
|**`generateStatsFile`**|`{Boolean}`|Default: `false`. If `true`, webpack stats JSON file will be generated in bundle output directory|
|**`statsFilename`**|`{String}`|Default: `stats.json`. Name of webpack stats JSON file that will be generated if `generateStatsFile` is `true`. Relative to bundle output directory.|
|**`statsOptions`**|`null` or `{Object}`|Default: `null`. Options for `stats.toJson()` method. For example you can exclude sources of your modules from stats file with `source: false` option. [See more options here](https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21). |
|**`logLevel`**|One of: `info`, `warn`, `error`, `silent`|Default: `info`. Used to control how much details the plugin outputs.|

<h2 align="center">Usage (as a CLI utility)</h2>

You can analyze an existing bundle if you have a webpack stats JSON file.

You can generate it using `BundleAnalyzerPlugin` with `generateStatsFile` option set to `true` or with this simple
command:

```bash
webpack --profile --json > stats.json
```

If you're on Windows and using PowerShell, you can generate the stats file with this command to [avoid BOM issues](https://github.com/webpack-contrib/webpack-bundle-analyzer/issues/47):

```
webpack --profile --json | Out-file 'stats.json' -Encoding OEM
```

Then you can run the CLI tool.

```
webpack-bundle-analyzer bundle/output/path/stats.json
```

<h2 align="center">Options (for CLI)</h2>

```bash
webpack-bundle-analyzer <bundleStatsFile> [bundleDir] [options]
```

Arguments are documented below:

### `bundleStatsFile`

Path to webpack stats JSON file

### `bundleDir`

Directory containing all generated bundles.

### `options`

```
  -h, --help                  output usage information
  -V, --version               output the version number
  -m, --mode <mode>           Analyzer mode. Should be `server` or `static`.
                              In `server` mode analyzer will start HTTP server to show bundle report.
                              In `static` mode single HTML file with bundle report will be generated.
                              Default is `server`.
  -h, --host <host>           Host that will be used in `server` mode to start HTTP server.
                              Default is `127.0.0.1`.
  -p, --port <n>              Port that will be used in `server` mode to start HTTP server.
                              Default is 8888.
  -r, --report <file>         Path to bundle report file that will be generated in `static` mode.
                              Default is `report.html`.
  -s, --default-sizes <type>  Module sizes to show in treemap by default.
                              Possible values: stat, parsed, gzip
                              Default is `parsed`.
  -O, --no-open               Don't open report in default browser automatically.
```

<h2 align="center" id="size-definitions">Size definitions</h2>

webpack-bundle-analyzer reports three values for sizes. `defaultSizes` can be used to control which of these is shown by default. The different reported sizes are:

### `stat`

This is the "input" size of your files, before any transformations like
minification.

It is called "stat size" because it's obtained from Webpack's
[stats object](https://webpack.js.org/configuration/stats/).

### `parsed`

This is the "output" size of your files. If you're using a Webpack plugin such
as Uglify, then this value will reflect the minified size of your code.

### `gzip`

This is the size of running the parsed bundles/modules through gzip compression.

<h2 align="center">Troubleshooting</h2>

### I can't see all the dependencies in a chunk

This is a known caveat when `webpack.optimize.ModuleConcatenationPlugin` is used. The way `ModuleConcatenationPlugin` works is that it merges multiple modules into a single one, and so that resulting module doesn't have edges anymore.

If you are interested to drill down to exact dependencies, try analyzing your bundle without `ModuleConcatenationPlugin`. See [issue #115](https://github.com/webpack-contrib/webpack-bundle-analyzer/issues/115) for more discussion.

<h2 align="center">Maintainers</h2>

<table>
  <tbody>
    <tr>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars3.githubusercontent.com/u/302213?v=4&s=150">
        </br>
        <a href="https://github.com/th0r">Yuriy Grunin</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars3.githubusercontent.com/u/482561?v=4&s=150">
        </br>
        <a href="https://github.com/valscion">Vesa Laakso</a>
      </td>
    </tr>
  <tbody>
</table>


[npm]: https://img.shields.io/npm/v/webpack-bundle-analyzer.svg
[npm-url]: https://npmjs.com/package/webpack-bundle-analyzer

[node]: https://img.shields.io/node/v/webpack-bundle-analyzer.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack-contrib/webpack-bundle-analyzer.svg
[deps-url]: https://david-dm.org/webpack-contrib/webpack-bundle-analyzer

[tests]: http://img.shields.io/travis/webpack-contrib/webpack-bundle-analyzer.svg
[tests-url]: https://travis-ci.org/webpack-contrib/webpack-bundle-analyzer

[downloads]: https://img.shields.io/npm/dt/webpack-bundle-analyzer.svg
[downloads-url]: https://npmjs.com/package/webpack-bundle-analyzer

<h2 align="center">Contributing</h2>

Check out [CONTRIBUTING.md](./CONTRIBUTING.md) for instructions on contributing :tada:
