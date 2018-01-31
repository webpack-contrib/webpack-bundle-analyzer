const crypto = require('crypto');
const net = require('net');

const Logger = require('../lib/Logger');
const { startServer } = require('../lib/viewer.js');

describe('WebSocket server', function () {
  it('should not crash when an error is emitted on the websocket', function (done) {
    const bundleStats = {
      assets: [{ name: 'bundle.js', chunks: [0] }]
    };

    const options = {
      openBrowser: false,
      logger: new Logger('silent'),
      port: 0
    };

    startServer(bundleStats, options)
      .then(function ({ http: server }) {
        // The GUID constant defined in WebSocket protocol
        // https://tools.ietf.org/html/rfc6455#section-1.3
        const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

        // The client-generated "Sec-WebSocket-Key" header field value.
        const key = crypto.randomBytes(16).toString('base64');

        // The server-generated "Sec-WebSocket-Accept" header field value.
        const accept = crypto.createHash('sha1')
          .update(key + GUID)
          .digest('base64');

        const socket = net.createConnection(server.address().port, function () {
          socket.write([
            'GET / HTTP/1.1',
            'Host: localhost',
            'Upgrade: websocket',
            'Connection: Upgrade',
            `Sec-WebSocket-Key: ${key}`,
            'Sec-WebSocket-Version: 13',
            '',
            ''
          ].join('\r\n'));
        });

        socket.on('data', function (chunk) {
          const expected = Buffer.from([
            'HTTP/1.1 101 Switching Protocols',
            'Upgrade: websocket',
            'Connection: Upgrade',
            `Sec-WebSocket-Accept: ${accept}`,
            '',
            ''
          ].join('\r\n'));

          expect(chunk.equals(expected)).to.be.true;

          // Send a WebSocket frame with a reserved opcode (5) to trigger an error
          // to be emitted on the server.
          socket.write(Buffer.from([0x85, 0x00]));
          socket.on('close', function () {
            server.close(done);
          });
        });
      })
      .catch(done);
  });
});
