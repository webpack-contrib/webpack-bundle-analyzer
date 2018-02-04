<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <h1>@webpack-bundle-analyzer/bundle-parser</h1>
  <p>Calculates module sizes from webpack output files.</p>
</div>

<h2 align="center">Install</h2>

```bash
npm install --save @webpack-bundle-analyzer/bundle-parser
```

<h2 align="center">Usage</h2>

```js
const parseBundle = require('@webpack-bundle-analyzer/bundle-parser');
const Logger = require('@webpack-bundle-analyzer/logger');

const fs = require('fs');
const webpackStats = JSON.parse(
  fs.readFileSync('webpack/output/path/stats.json', 'utf8')
);

const logger = new Logger('info');

const moduleSizeData = parseBundle(
  webpackStats,
  'webpack/output/path',
  logger
);

console.log(JSON.stringify(moduleSizeData, null, 2));
```

Example output:

```json
[
  {
    "label": "bundle.js",
    "statSize": 141,
    "parsedSize": 445,
    "gzipSize": 178,
    "groups": [
      {
        "label": "my-app",
        "path": "./my-app",
        "statSize": 141,
        "parsedSize": 332,
        "gzipSize": 119,
        "groups": [
          {
            "label": "src",
            "path": "./my-app/src",
            "statSize": 141,
            "parsedSize": 332,
            "gzipSize": 119,
            "groups": [
              {
                "id": 0,
                "label": "index.js",
                "path": "./my-app/src/index.js",
                "statSize": 54,
                "parsedSize": 131,
                "gzipSize": 93
              },
              {
                "id": 1,
                "label": "a.js",
                "path": "./my-app/src/a.js",
                "statSize": 29,
                "parsedSize": 67,
                "gzipSize": 73
              },
              {
                "id": 2,
                "label": "b.js",
                "path": "./my-app/src/b.js",
                "statSize": 29,
                "parsedSize": 67,
                "gzipSize": 73
              },
              {
                "id": 3,
                "label": "a-clone.js",
                "path": "./my-app/src/a-clone.js",
                "statSize": 29,
                "parsedSize": 67,
                "gzipSize": 73
              }
            ]
          }
        ]
      }
    ]
  }
]
```


<h2 align="center">Options</h2>

```js
parseBundle(
  bundleStats: object,
  bundleDir: string,
  options: {
    logger: Logger
  }
);
```

|Name|Type|Description|
|:--:|:--:|:----------|
|**`bundleStats`**|`{Object}`|webpack compilation information as a JSON object. This is the output of [`stats.toJson()`](https://webpack.js.org/api/node/#stats-tojson-options-) webpack Node.js API.|
|**`bundleDir`**|`{String}`|Path to directory containing webpack output files, i.e. the value of [`output.path` webpack config](https://webpack.js.org/configuration/output/#output-path).|
|**`options.logger`**|`{Logger}`|An instance of a special `Logger` class also used in `webpack-bundle-analyzer`.|



<h2 align="center" id="size-definitions">Size definitions</h2>

Data contains three sizes for each module if bundle parsing has succeeded, or only `statSize` if bundle parsing has failed for some reason.

### `statSize`

The "input" size of modules, before any transformations like minification.

### `parsedSize`

The "output" size of modules. If you're using a webpack plugin such as Uglify, then this value will reflect the minified size of your code.

### `gzipSize`

Size approximation of running the parsed modules through gzip compression.

Gzip sizes of folders are calculated by concatenating the parsed sources of all modules inside a folder and running [`gzip-size`](https://github.com/sindresorhus/gzip-size) over it.


<h2 align="center">Troubleshooting</h2>

### Some inner modules are missing from the data

This is a known caveat when `webpack.optimize.ModuleConcatenationPlugin` is used. The way `ModuleConcatenationPlugin` works is that it merges multiple modules into a single one, and so that resulting module doesn't have edges anymore.

If you are interested to drill down to exact dependencies, try parsing output without `ModuleConcatenationPlugin` applied. See [issue #115](https://github.com/webpack-contrib/webpack-bundle-analyzer/issues/115) for more discussion.

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
