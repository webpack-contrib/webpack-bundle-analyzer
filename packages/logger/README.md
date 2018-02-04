<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <h1>@webpack-bundle-analyzer/logger</h1>
  <p>Logging implementation used in webpack-bundle-analyzer.</p>
</div>

<h2 align="center">Install</h2>

```bash
npm install --save @webpack-bundle-analyzer/logger
```

<h2 align="center">Usage</h2>

```js
const Logger = require('@webpack-bundle-analyzer/logger');

// Possible logging levels are 'info', 'warn', 'error' and 'silent'.
const logger = new Logger('info');

logger.info('Informative message');
logger.warn('Warning, something is not right!');
logger.error('An error happened!');
```

<h2 align="center">Options</h2>

```js
new Logger(level: LogLevel);
```

|Name|Type|Description|
|:--:|:--:|:----------|
|**`level`**|One of: `info`, `warn`, `error`, `silent`|The logging level to use. `info` displays all log messages, `warn` displays only `.warn` and `.error` logs, `error` displays only `.error` logs and `silent` displays none.|


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
