const _ = require('lodash');
const filesize = require('filesize');
const gzipSize = require('gzip-size');

class Node {

  constructor(name, parent) {
    this.name = name;
    this.parent = parent;
  }

  get path() {
    const path = [];
    let node = this;

    while (node) {
      path.push(node.name);
      node = node.parent;
    }

    return path.reverse().join('/');
  }

  toString(indent) {
    indent = indent || '|';

    return `${indent} ${this.name}`;
  }

}

class Module extends Node {

  constructor(name, data, parent) {
    super(name, parent);
    this.data = data;
  }

  get src() {
    return this.data.parsedSrc;
  }

  set src(value) {
    this.data.parsedSrc = value;
    delete this._gzipSize;
  }

  get size() {
    return this.data.size;
  }

  set size(value) {
    this.data.size = value;
  }

  get parsedSize() {
    return this.src ? this.src.length : undefined;
  }

  get gzipSize() {
    if (!_.has(this, '_gzipSize')) {
      this._gzipSize = this.src ? gzipSize.sync(this.src) : undefined;
    }

    return this._gzipSize;
  }

  mergeData(data) {
    if (data.size) {
      this.size += data.size;
    }

    if (data.parsedSrc) {
      this.src = (this.src || '') + data.parsedSrc;
    }
  }

  toString(indent) {
    return `${super.toString(indent)} [${this.data.id}] (${filesize(this.size)})`;
  }

  toChartData() {
    return {
      id: this.data.id,
      label: this.name,
      path: this.path,
      statSize: this.size,
      parsedSize: this.parsedSize,
      gzipSize: this.gzipSize
    };
  }

}


class Folder extends Node {

  constructor(name, parent) {
    super(name, parent);
    this.children = Object.create(null);
  }

  get src() {
    if (!_.has(this, '_src')) {
      this._src = this.walk((node, src, stop) => {
        if (node.src === undefined) return stop(undefined);
        return (src += node.src);
      }, '', false);
    }

    return this._src;
  }

  get size() {
    if (!_.has(this, '_size')) {
      this._size = this.walk((node, size) => (size + node.size), 0, false);
    }

    return this._size;
  }

  get parsedSize() {
    return this.src ? this.src.length : undefined;
  }

  get gzipSize() {
    if (!_.has(this, '_gzipSize')) {
      this._gzipSize = this.src ? gzipSize.sync(this.src) : undefined;
    }

    return this._gzipSize;
  }

  getChild(name) {
    return this.children[name];
  }

  addFolder(name) {
    const folder = new Folder(name, this);

    this.children[name] = folder;
    delete this._size;
    delete this._src;

    return folder;
  }

  addModule(name, data) {
    let node = this.children[name];

    // For some reason we already have this node in children and it's a folder.
    if (node && node instanceof Folder) return false;

    if (node) {
      // We already have this node in children and it's a module.
      // Merging it's data.
      node.mergeData(data);
    } else {
      // Creating new module.
      node = new Module(name, data, this);
      this.children[name] = node;
    }

    delete this._size;
    delete this._src;

    return true;
  }

  addModuleByPath(path, data) {
    const [pathParts, fileName] = [path.slice(0, -1), _.last(path)];
    let currentFolder = this;

    _.each(pathParts, pathPart => {
      let childNode = currentFolder.getChild(pathPart);

      if (
        // Folder is not created yet
        !childNode ||
        // In some situations (invalid usage of dynamic `require()`) webpack generates a module with empty require
        // context, but it's moduleId points to a directory in filesystem.
        // In this case we replace this `File` node with `Folder`.
        // See `test/stats/with-invalid-dynamic-require.json` as an example.
        !(childNode instanceof Folder)
      ) {
        childNode = currentFolder.addFolder(pathPart);
      }

      currentFolder = childNode;
    });

    currentFolder.addModule(fileName, data);
  }

  walk(walker, state = {}, deep = true) {
    let stopped = false;

    _.each(this.children, child => {
      if (deep && child.walk) {
        state = child.walk(walker, state, stop);
      } else {
        state = walker(child, state, stop);
      }

      if (stopped) return false;
    });

    return state;

    function stop(finalState) {
      stopped = true;
      return finalState;
    }
  }

  toString(indent, opts) {
    const { sortBy } = opts || {};
    indent = indent || '|';

    let str = `${indent} ${this.name} (${filesize(this.size)})\n`;

    str += _(this.children)
      .sortBy(sortBy)
      .reverse()
      .map(child => child.toString(`${indent}  |`, opts))
      .join('\n');

    return str;
  }

  toChartData() {
    return {
      label: this.name,
      path: this.path,
      statSize: this.size,
      parsedSize: this.parsedSize,
      gzipSize: this.gzipSize,
      groups: _.invokeMap(this.children, 'toChartData')
    };
  }

}

module.exports = {
  Node,
  Module,
  Folder
};
