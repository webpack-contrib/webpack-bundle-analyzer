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
  // Port that will be used in `server` mode to start HTTP server.
  analyzerPort: 8888,
  // Path to bundle report file that will be generated in `static` mode.
  // Relative to bundles output directory.
  reportFilename: 'report.html',
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
command: `webpack --profile --json > stats.json`

`webpack-bundle-analyzer --help` will show you all usage information.

## Contributing

To contribute to `webpack-bundle-analyzer`, fork the repository and clone it to your machine. [See this GitHub help page for what forking and cloning means](https://help.github.com/articles/fork-a-repo/)

### Setup packages

Then install [`yarn`](https://yarnpkg.com/):

```sh
npm install --global yarn
```

Next, install this package's dependencies with `yarn`:

```sh
yarn install --pure-lockfile
```

We're using `--pure-lockfile` for this first time as the `yarn.lock` file should not be unnecessarily changed unless we modify `package.json`.

### Develop with your own project

Run the following to build this library and watch its source files for changes:

```sh
yarn run start
```

You will now have a fully functioning local build of this library ready to be used. **Leave the `start` script running**, and continue with a new Terminal/shell window.

Link the local package with `yarn` and/or `npm` to use it in your own projects:

```sh
# Needed if your own project uses `yarn` to handle dependencies:
yarn link
# Needed if your own project uses `npm` to handle dependencies:
npm link
```

Now go to your own project directory, and tell `npm` or `yarn` to use the local copy of `webpack-bundle-analyzer` package:

```sh
cd /path/to/my/own/project
# If you're using yarn, run this:
yarn link webpack-bundle-analyzer
# ...and if you're not, and you're using just npm in your own
# project, run this:
npm link webpack-bundle-analyzer
```

Now when you call `require('webpack-bundle-analyzer')` in your own project, you will actually be using the local copy of the `webpack-bundle-analyzer` project.

If your own project's Webpack config has `BundleAnalyzerPlugin` configured with `analyzerMode: 'server'`, the changes you do inside `client` folder within your local copy of `webpack-bundle-analyzer` should now be immediately visible after you refresh your browser page. Hack away!

### Send your changes back to us! :revolving_hearts:

We'd love for you to contribute your changes back to `webpack-bundle-analyzer`! To do that, it would be ace if you could commit your changes to a separate feature branch and open a Pull Request for those changes:

```sh
# Inside your own copy of `webpack-bundle-analyzer` package:
git checkout --branch feature-branch-name-here
# ...hack away, and commit your changes:
git add -A
git commit -m "Few words about the changes I did"
# Push your local changes back to your fork. The following assumes
# your fork lives in the remote named "origin"
git push --set-upstream origin feature-branch-name-here
```

After these steps, you should be able to create a new Pull Request for this repository. If you hit any issues following these instructions, please open an issue and we'll see if we can improve these instructions even further.

### Add tests for your changes :tada:

It would be really great if the changes you did could be tested somehow. Our tests live inside the `test` directory, and they can be run with the following command:

```sh
yarn run test-dev
```

Now whenever you change some files, the tests will be rerun immediately. If you don't want that, and want to run tests as a one-off operation, you can use:

```sh
yarn run test
```

## License

[MIT](LICENSE)

[downloads-image]: https://img.shields.io/npm/dt/webpack-bundle-analyzer.svg
[npm-url]: https://www.npmjs.com/package/webpack-bundle-analyzer
[npm-image]: https://img.shields.io/npm/v/webpack-bundle-analyzer.svg
