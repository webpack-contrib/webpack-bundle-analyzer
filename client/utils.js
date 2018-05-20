export function isChunkParsed(chunk) {
  return (typeof chunk.parsedSize === 'number');
}
