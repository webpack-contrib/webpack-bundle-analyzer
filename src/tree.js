const _ = require('lodash');
const filesize = require('filesize');

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

class File extends Node {

  constructor(name, data, parent) {
    super(name, parent);
    this.data = data;
  }

  get size() {
    return this.data.size;
  }

  get parsedSize() {
    return this.data.parsedSize;
  }

  toString(indent) {
    return `${super.toString(indent)} [${this.data.id}] (${filesize(this.size)} / ${filesize(this.parsedSize)})`;
  }

  toChartData() {
    return {
      id: this.data.id,
      label: this.name,
      path: this.path,
      weight: (this.parsedSize === undefined) ? this.size : this.parsedSize,
      statSize: this.size,
      parsedSize: this.parsedSize
    };
  }

}


class Folder extends Node {

  constructor(name, parent) {
    super(name, parent);
    this.children = Object.create(null);
  }

  get size() {
    if (!_.has(this, '_size')) {
      this._size = this.walk((node, size) => (size + node.size), 0);
    }

    return this._size;
  }

  get parsedSize() {
    if (!_.has(this, '_parsedSize')) {
      this._parsedSize = this.walk((node, size, stop) => {
        if (node.parsedSize === undefined) {
          return stop(undefined);
        }

        return (size + node.parsedSize);
      }, 0);
    }

    /*if (this.name === 'bluebird') {
      console.log(this._parsedSize);
    }*/

    return this._parsedSize;
  }

  getChild(name) {
    return this.children[name];
  }

  addFolder(name) {
    const folder = new Folder(name, this);

    this.children[name] = folder;
    delete this._size;
    delete this._parsedSize;

    return folder;
  }

  addFile(name, data, overwrite = false) {
    const file = new File(name, data, this);

    if (this.children[name] && !overwrite) {
      return this.children[name];
    }

    this.children[name] = file;
    delete this._size;
    delete this._parsedSize;

    return file;
  }

  addFileByPath(path, data) {
    const [folderNames, fileName] = [path.slice(0, -1), _.last(path)];
    let currentFolder = this;

    _.each(folderNames, folderName => {
      currentFolder = currentFolder.getChild(folderName) || currentFolder.addFolder(folderName);
    });

    currentFolder.addFile(fileName, data);
  }

  walk(walker, state = {}) {
    let stopped = false;

    _.each(this.children, child => {
      if (child.walk) {
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

    let str = `${indent} ${this.name} (${filesize(this.size)} / ${filesize(this.parsedSize)})\n`;

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
      weight: (this.parsedSize === undefined) ? this.size : this.parsedSize,
      statSize: this.size,
      parsedSize: this.parsedSize,
      groups: _.invokeMap(this.children, 'toChartData')
    };
  }

}

module.exports = {
  Node,
  File,
  Folder
};
