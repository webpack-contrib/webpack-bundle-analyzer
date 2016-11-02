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
      // deprecated
      startAnalyzer: true,
      ...opts
    };
  }

  apply(compiler) {
    this.compiler = compiler;

    compiler.plugin('emit', (curCompiler, callback) => {
      const stats = curCompiler
        .getStats()
        .toJson();

      if (this.opts.generateStatsFile) {
        const statsStr = JSON.stringify(stats, null, 2);

        curCompiler.assets[this.opts.statsFilename] = {
          source: () => statsStr,
          size: () => statsStr.length
        };
      }

      let analyzeFn;

      // Handling deprecated `startAnalyzer` flag
      if (this.opts.analyzerMode === 'server' && !this.opts.startAnalyzer) {
        this.opts.analyzerMode = 'disabled';
      }

      if (this.opts.analyzerMode === 'server') {
        analyzeFn = () => this.startAnalyzerServer(stats);
      } else if (this.opts.analyzerMode === 'static') {
        analyzeFn = () => this.generateStaticReport(stats);
      }

      if (analyzeFn) {
        // Making analyzer logs to be after all webpack warnings in the console
        setTimeout(() => {
          console.log('');
          analyzeFn();
        }, 500);
      }

      callback();
    });
  }

  startAnalyzerServer(stats) {
    viewer.startServer(stats, {
      openBrowser: this.opts.openAnalyzer,
      port: this.opts.analyzerPort,
      bundleDir: this.compiler.outputPath
    });
  }

  generateStaticReport(stats) {
    viewer.generateReport(stats, {
      openBrowser: this.opts.openAnalyzer,
      reportFilename: this.opts.reportFilename,
      bundleDir: this.compiler.outputPath
    });
  }

}

module.exports = BundleAnalyzerPlugin;
