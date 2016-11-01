const viewer = require('./viewer');

class BundleAnalyzerPlugin {

  constructor(opts) {
    this.opts = {
      startAnalyzer: true,
      openAnalyzer: true,
      analyzerPort: 8888,
      generateStatsFile: false,
      statsFilename: 'stats.json',
      ...opts
    };
  }

  apply(compiler) {
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

      if (this.opts.startAnalyzer) {
        // Making analyzer logs to be after all webpack warnings in the console
        setTimeout(() => {
          console.log('');

          viewer.start(stats, {
            openBrowser: this.opts.openAnalyzer,
            port: this.opts.analyzerPort,
            bundleDir: compiler.outputPath
          });
        }, 500);
      }

      callback();
    });
  }

}

module.exports = BundleAnalyzerPlugin;
