const viewer = require('./viewer');

module.exports = {
  generateReport,
  createReporter
};

function generateReport(stats, opts) {
  return viewer.generateReport(stats, opts);
}

function createReporter(initialChartData, opts) {
  const server = viewer.startServer(initialChartData, opts);
  return server.then(({ updateChartData }) => ({
    updateData: newData => {
      updateChartData(newData);
    }
  }));
}
