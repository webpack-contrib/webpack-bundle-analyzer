const fs = require('fs');
const path = require('path');
const mkdir = require('mkdirp');
const { bold } = require('chalk');

const Logger = require('./Logger');
const viewer = require('./viewer');

class BundleAnalyzerPlugin {

  constructor(opts) {
    this.opts = {
      analyzerMode: 'server',
      analyzerPort: 8888,
      reportFilename: 'report.html',
      openAnalyzer: true,
      generateStatsFile: false,
      statsFilename: 'stats.json',
      statsOptions: null,
      logLevel: 'info',
      // deprecated
      startAnalyzer: true,
      ...opts
    };

    this.logger = new Logger(this.opts.logLevel);
  }

  apply(compiler) {
    this.compiler = compiler;

    compiler.plugin('done', stats => {
      stats = stats.toJson(this.opts.statsOptions);

      const actions = [];

      if (this.opts.generateStatsFile) {
        actions.push(() => this.generateStatsFile(stats));
      }

      // Handling deprecated `startAnalyzer` flag
      if (this.opts.analyzerMode === 'server' && !this.opts.startAnalyzer) {
        this.opts.analyzerMode = 'disabled';
      }

      if (this.opts.analyzerMode === 'server') {
        actions.push(() => this.startAnalyzerServer(stats));
      } else if (this.opts.analyzerMode === 'static') {
        actions.push(() => this.generateStaticReport(stats));
      }

      if (actions.length) {
        // Making analyzer logs to be after all webpack logs in the console
        setImmediate(() => {
          actions.forEach(action => action());
        });
      }
    });
  }

  generateStatsFile(stats) {
    let statsFilepath = this.opts.statsFilename;

    if (!path.isAbsolute(statsFilepath)) {
      statsFilepath = path.resolve(this.compiler.outputPath, statsFilepath);
    }

    mkdir.sync(path.dirname(statsFilepath));

    fs.writeFileSync(
      statsFilepath,
      JSON.stringify(stats, null, 2)
    );

    this.logger.info(
      `${bold('Webpack Bundle Analyzer')} saved stats file to ${bold(statsFilepath)}`
    );
  }

  startAnalyzerServer(stats) {
    viewer.startServer(stats, {
      openBrowser: this.opts.openAnalyzer,
      port: this.opts.analyzerPort,
      bundleDir: this.compiler.outputPath,
      logger: this.logger
    });
  }

  generateStaticReport(stats) {
    viewer.generateReport(stats, {
      openBrowser: this.opts.openAnalyzer,
      reportFilename: this.opts.reportFilename,
      bundleDir: this.compiler.outputPath,
      logger: this.logger
    });
  }

}

module.exports = BundleAnalyzerPlugin;
