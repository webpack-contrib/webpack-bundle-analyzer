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

  setItem(key, value) {
    try {
      window.localStorage.setItem(`${KEY_PREFIX}.${key}`, JSON.stringify(value));
    } catch (err) { /* ignored */ }
  },

  removeItem(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (err) { /* ignored */ }
  }

};
