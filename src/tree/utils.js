const MULTI_MODULE_REGEXP = /^multi /u;

export function getModulePathParts(moduleData) {
  if (MULTI_MODULE_REGEXP.test(moduleData.identifier)) {
    return [moduleData.identifier];
  }

  const loaders = moduleData.name.split('!');
  const parsedPath = loaders[loaders.length - 1]
    .split('/')
    .slice(1)
    .map(part => (part === '~' ? 'node_modules' : part));

  return parsedPath.length ? parsedPath : null;
}
