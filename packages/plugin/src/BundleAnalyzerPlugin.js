const bfj = require('bfj-node4');
const path = require('path');
const mkdir = require('mkdirp');
const { bold } = require('chalk');

const Logger = require('./Logger');
const analyzer = require('./analyzer');

class BundleAnalyzerPlugin {

  constructor(opts) {
    const {
      reporter,
      reporterOptions,
      ...pluginOptions
    } = opts;

    this.opts = {
      analyzerMode: 'server',
      generateStatsFile: false,
      statsFilename: 'stats.json',
      statsOptions: null,
      logLevel: 'info',
      ...pluginOptions
    };

    if (!reporter) {
      // TODO: Improve this error message a lot, as this will be the first
      // error of backwards-incompatibility compared to v2
      throw new Error('options.reporter is not set!');
    }
    if (typeof reporter !== 'string') {
      // We can't support passing `reporter: require('my-reporter')` syntax as
      // if we did, we'd have no way of ensuring CLI works, too.
      // TODO: Improve this error message, explain about options.reporterOptions
      throw new Error('options.reporter is not a string!');
    }
    this.reporter = require(reporter);
    this.reporterOptions = reporterOptions || {};

    this.server = null;
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

  async generateStatsFile(stats) {
    const statsFilepath = path.resolve(this.compiler.outputPath, this.opts.statsFilename);
    mkdir.sync(path.dirname(statsFilepath));

    try {
      await bfj.write(statsFilepath, stats, {
        promises: 'ignore',
        buffers: 'ignore',
        maps: 'ignore',
        iterables: 'ignore',
        circular: 'ignore'
      });

      this.logger.info(
        `${bold('Webpack Bundle Analyzer')} saved stats file to ${bold(statsFilepath)}`
      );
    } catch (error) {
      this.logger.error(
        `${bold('Webpack Bundle Analyzer')} error saving stats file to ${bold(statsFilepath)}: ${error}`
      );
    }
  }

  async startAnalyzerServer(stats) {
    const chartData = analyzer.getChartData(this.logger, stats, this.getBundleDirFromCompiler());
    if (this.server) {
      (await this.server).updateData(chartData);
    } else {
      this.server = this.reporter.createReporter(chartData, {
        ...this.reporterOptions,
        outputPath: this.compiler.outputPath,
        logger: this.logger
      });
    }
  }

  generateStaticReport(stats) {
    const chartData = analyzer.getChartData(this.logger, stats, this.getBundleDirFromCompiler());
    this.reporter.generateReport(chartData, {
      ...this.reporterOptions,
      outputPath: this.compiler.outputPath,
      logger: this.logger
    });
  }

  getBundleDirFromCompiler() {
    return (this.compiler.outputFileSystem.constructor.name === 'MemoryFileSystem') ? null : this.compiler.outputPath;
  }

}

module.exports = BundleAnalyzerPlugin;
