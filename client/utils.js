export function isChunkParsed(chunk) {
  return (typeof chunk.parsedSize === 'number');
}

export function walkModules(modules, cb) {
  for (const module of modules) {
    cb(module);

    if (module.groups) {
      walkModules(module.groups, cb);
    }
  }
}
