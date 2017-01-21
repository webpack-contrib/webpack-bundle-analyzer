const startServer = require('./startServer');
const generateReport = require('./generateReport');

module.exports = {
  startServer,
  generateReport,
  // deprecated
  start: startServer
};
