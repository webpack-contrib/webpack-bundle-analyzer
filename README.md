# Webpack Bundle Analyzer
Webpack plugin and CLI utility that represents bundle content as convenient interactive zoomable treemap

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url]

## What is this for?
Just take a look at this demo:

![webpack bundle analyzer zoomable treemap](https://cloud.githubusercontent.com/assets/302213/20628702/93f72404-b338-11e6-92d4-9a365550a701.gif)

This module will help you:

1. Realize what's *really* inside your bundle
2. Find out what modules make up the most of it's size
3. Find modules that got there by mistake
4. Optimize it!

And the best thing is it supports minified bundles! It parses them to get real size of bundled modules.
And it also shows their gzipped sizes!

## Installation and usage
There are two ways to use this module:

### As plugin
```sh
npm install --save-dev webpack-bundle-analyzer
```

In `webpack.config.js`:
```js
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// ...
plugins: [new BundleAnalyzerPlugin()]
// ...
```

`BundleAnalyzerPlugin` constructor can take an optional configuration object that defaults to this:

```js
new BundleAnalyzerPlugin({
  // Can be `server`, `static` or `disabled`.
  // In `server` mode analyzer will start HTTP server to show bundle report.
  // In `static` mode single HTML file with bundle report will be generated.
  // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
  analyzerMode: 'server',
  // Host that will be used in `server` mode to start HTTP server.
  analyzerHost: '127.0.0.1',
  // Port that will be used in `server` mode to start HTTP server.
  analyzerPort: 8888,
  // Path to bundle report file that will be generated in `static` mode.
  // Relative to bundles output directory.
  reportFilename: 'report.html',
  // Module sizes to show in report by default.
  // Should be one of `stat`, `parsed` or `gzip`.
  // See "Definitions" section for more information.
  defaultSizes: 'parsed',
  // Automatically open report in default browser
  openAnalyzer: true,
  // If `true`, Webpack Stats JSON file will be generated in bundles output directory
  generateStatsFile: false,
  // Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
  // Relative to bundles output directory.
  statsFilename: 'stats.json',
  // Options for `stats.toJson()` method.
  // For example you can exclude sources of your modules from stats file with `source: false` option.
  // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
  statsOptions: null,
  // Log level. Can be 'info', 'warn', 'error' or 'silent'.
  logLevel: 'info'
})
```

### As CLI utility
You can also analyze already existing bundles if you have Webpack Stats JSON file.

You can generate it using `BundleAnalyzerPlugin` with `generateStatsFile` option set to `true` or with this simple
command:

```
webpack --profile --json > stats.json
```

If you're on Windows and using PowerShell, you can generate the stats file with this command to [avoid BOM issues](https://github.com/th0r/webpack-bundle-analyzer/issues/47):

```
webpack --profile --json | Out-file 'stats.json' -Encoding OEM
```

`webpack-bundle-analyzer --help` will show you all usage information.

## Definitions

webpack-bundle-analyzer reports three values:

### Stat size

This is the "input" size of your files, before any transformations like
minification.

It is called "stat size" because it's obtained from Webpack's
[stats object](https://webpack.js.org/configuration/stats/).

### Parsed size

This is the "output" size of your files. If you're using a Webpack plugin such
as Uglify, then this value will reflect the minified size of your code.

### Gzip size

This is the size of running the file(s) through gzip compression.

## Contributing

Check out [CONTRIBUTING.md](./CONTRIBUTING.md) for instructions on contributing :tada:

## License

[MIT](LICENSE)

[downloads-image]: https://img.shields.io/npm/dt/webpack-bundle-analyzer.svg
[npm-url]: https://www.npmjs.com/package/webpack-bundle-analyzer
[npm-image]: https://img.shields.io/npm/v/webpack-bundle-analyzer.svg
