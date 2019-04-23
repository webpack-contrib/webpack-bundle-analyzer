const http = require('http');
const {exec} = require('child_process');

const del = require('del');

const ROOT = `${__dirname}/dev-server`;
const WEBPACK_CONFIG_PATH = `${ROOT}/webpack.config.js`;
const webpackConfig = require(WEBPACK_CONFIG_PATH);

describe('Webpack Dev Server', function () {
  before(deleteOutputDirectory);
  afterEach(deleteOutputDirectory);

  it('should save report file to the output directory', function (done) {
    const timeout = 15000;
    const startedAt = Date.now();

    this.timeout(timeout);

    const devServer = exec(`${__dirname}/../node_modules/.bin/webpack-dev-server --config ${WEBPACK_CONFIG_PATH}`, {
      cwd: ROOT
    });

    setTimeout(() => {
      http.get('http://localhost:8080/report.html', (res) => {
        if (res.statusCode === 200) {
          finish();
        } else if (Date.now() - startedAt > timeout - 1000) {
          finish(`report file wasn't found in "${webpackConfig.output.path}" directory`);
        }
      });
    }, 2000);

    function finish(errorMessage) {
      devServer.kill();
      done(errorMessage ? new Error(errorMessage) : null);
    }
  });
});

function deleteOutputDirectory() {
  del.sync(webpackConfig.output.path);
}
