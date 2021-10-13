const fs = require('fs');
const ROOT = `${__dirname}/dev-server`;
const WEBPACK_CONFIG_PATH = `${ROOT}/webpack.config.js`;
const webpackConfig = require(WEBPACK_CONFIG_PATH);
const DevServer = require('webpack-dev-server');
const webpack = require('webpack');

describe('Webpack Dev Server', function () {
  it('should save report file to memory file system when writeToDisk is empty', async function () {
    expect.assertions(2);
    const compiler = webpack(webpackConfig);
    const devServer = await new Promise((resolve) => {
      const devServerOptions = {host: '127.0.0.1', port: 8080};
      const devServer = new DevServer(compiler, devServerOptions);
      devServer.listen(devServerOptions.port, devServerOptions.host, () => {
        resolve(devServer);
      });
    });
    await new Promise((resolve) => {
      compiler.hooks.afterDone.tap('webpack-bundle-analyzer', resolve);
    });
    const path = `${webpackConfig.output.path}/report.html`;
    expect(compiler.outputFileSystem.existsSync(path)).toBeTruthy();
    expect(fs.existsSync(path)).toBeFalsy();
    compiler.outputFileSystem.unlinkSync(path);
    await new Promise((resolve) => {
      devServer.close(() => {
        resolve();
      });
    });

  });

  it.skip('should save report file to the output directory when writeToDisk is true', async function () {
    expect.assertions(2);
    const compiler = webpack(webpackConfig);
    const devServer = await new Promise((resolve) => {
      const devServerOptions = {host: '127.0.0.1', port: 8080, writeToDisk: true};
      const devServer = new DevServer(compiler, devServerOptions);
      devServer.listen(devServerOptions.port, devServerOptions.host, () => {
        resolve(devServer);
      });
    });
    await new Promise((resolve) => {
      compiler.hooks.afterDone.tap('webpack-bundle-analyzer', resolve);
    });
    const path = `${webpackConfig.output.path}/report.html`;
    expect(compiler.outputFileSystem.existsSync(path)).toBeTruthy();
    expect(fs.existsSync(path)).toBeTruthy();
    compiler.outputFileSystem.unlinkSync(path);
    return await new Promise((resolve) => {
      devServer.close(() => {
        resolve();
      });
    });
  });
});

