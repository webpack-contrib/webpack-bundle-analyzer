const zlib = require('zlib');

export function gzipSize(input) {
  return zlib.gzipSync(input, {level: 9}).length;
}

export function brotliSize(input) {
  if (typeof zlib.brotliCompressSync !== 'function') {
    throw new Error('Brotli compression requires Node.js v10.16.0 or higher.');
  }

  return zlib.brotliCompressSync(input).length;
}
