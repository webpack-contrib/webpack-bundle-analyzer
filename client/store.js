import { observable, computed } from 'mobx';
import { isChunkParsed, walkModules } from './utils';

export class Store {
  sizes = new Set(['statSize', 'parsedSize', 'gzipSize']);

  @observable.ref allChunks;
  @observable.shallow selectedChunks;
  @observable searchQuery = '';
  @observable defaultSize;
  @observable selectedSize;

  @computed get hasParsedSizes() {
    return this.allChunks.some(isChunkParsed);
  }

  @computed get activeSize() {
    const activeSize = this.selectedSize || this.defaultSize;

    if (!this.hasParsedSizes || !this.sizes.has(activeSize)) {
      return 'statSize';
    }

    return activeSize;
  }

  @computed get visibleChunks() {
    return this.allChunks.filter(chunk =>
      this.selectedChunks.includes(chunk)
    );
  }

  @computed get totalChunksSize() {
    return this.allChunks.reduce((totalSize, chunk) =>
      totalSize + (chunk[this.activeSize] || 0),
    0);
  }

  @computed get foundModules() {
    const foundModules = [];

    walkModules(this.visibleChunks, module => {
      if (module.label.includes(this.searchQuery)) {
        foundModules.push(module);
      }
    });

    return foundModules;
  }
}

export const store = new Store();
