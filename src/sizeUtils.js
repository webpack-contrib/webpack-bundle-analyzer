const zlib = require('zlib');

export function gzipSize(input) {
  return zlib.gzipSync(input, {level: 9}).length;
}
