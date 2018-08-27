import {observable, computed} from 'mobx';
import {isChunkParsed, walkModules} from './utils';

export class Store {
  cid = 0;
  sizes = new Set(['statSize', 'parsedSize', 'gzipSize']);

  @observable.ref allChunks;
  @observable.shallow selectedChunks;
  @observable searchQuery = '';
  @observable defaultSize;
  @observable selectedSize;

  setModules(modules) {
    walkModules(modules, module => {
      module.cid = this.cid++;
    });

    this.allChunks = modules;
    this.selectedChunks = this.allChunks;
  }

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
    const visibleChunks = this.allChunks.filter(chunk =>
      this.selectedChunks.includes(chunk)
    );

    return this.filterModulesForSize(visibleChunks, this.activeSize);
  }

  @computed get allChunksSelected() {
    return this.visibleChunks.length === this.allChunks.length;
  }

  @computed get totalChunksSize() {
    return this.allChunks.reduce((totalSize, chunk) =>
      totalSize + (chunk[this.activeSize] || 0),
    0);
  }

  @computed get searchQueryRegexp() {
    const query = this.searchQuery.trim();

    if (!query) {
      return null;
    }

    try {
      return new RegExp(query, 'i');
    } catch (err) {
      return null;
    }
  }

  @computed get isSearching() {
    return !!this.searchQueryRegexp;
  }

  @computed get foundModules() {
    if (!this.isSearching) {
      return [];
    }

    const query = this.searchQueryRegexp;
    const foundByName = [];
    const foundByPath = [];

    walkModules(this.visibleChunks, module => {
      if (query.test(module.label)) {
        foundByName.push(module);
      } else if (module.path && query.test(module.path)) {
        foundByPath.push(module);
      }
    });

    return [...foundByName, ...foundByPath];
  }

  filterModulesForSize(modules, sizeProp) {
    return modules.reduce((filteredModules, module) => {
      if (module[sizeProp]) {
        if (module.groups) {
          module = {
            ...module,
            groups: this.filterModulesForSize(module.groups, sizeProp)
          };
        }

        module.weight = module[sizeProp];
        filteredModules.push(module);
      }

      return filteredModules;
    }, []);
  }
}

export const store = new Store();
