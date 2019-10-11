export function isChunkParsed(chunk) {
  return (typeof chunk.parsedSize === 'number');
}

export function walkModules(modules, cb) {
  for (const module of modules) {
    if (cb(module) === false) return false;

    if (module.groups) {
      if (walkModules(module.groups, cb) === false) {
        return false;
      }
    }
  }
}

export function elementIsOutside(elem, container) {
  return !(elem === container || container.contains(elem));
}

export const localStorage = {

  getItem(k) {
    try {
      return window.localStorage.getItem(k);
    } catch (x) {
      return null;
    }
  },

  setItem(k, v) {
    try {
      window.localStorage.setItem(k, v);
    } catch (x) { /* ignored */ }
  },

  removeItem(k) {
    try {
      window.localStorage.removeItem(k);
    } catch (x) { /* ignored */ }
  }

};