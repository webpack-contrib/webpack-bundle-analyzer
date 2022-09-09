import {observable, computed} from 'mobx';
import {isChunkParsed, walkModules} from './utils';
import localStorage from './localStorage';
import SEARCH_MODE from './searchMode';

export class Store {
  cid = 0;
  sizes = new Set(['statSize', 'parsedSize', 'gzipSize']);

  @observable.ref allChunks;
  @observable.shallow selectedChunks;
  @observable searchQuery = '';
  @observable searchMode = SEARCH_MODE.MODULES;
  @observable defaultSize;
  @observable selectedSize;
  @observable showConcatenatedModulesContent = (localStorage.getItem('showConcatenatedModulesContent') === true);

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
      return new RegExp(query, 'iu');
    } catch (err) {
      return null;
    }
  }

  @computed get isSearching() {
    return !!this.searchQueryRegexp;
  }

  @computed get foundModulesByChunk() {
    if (!this.isSearching) {
      return [];
    }

    const query = this.searchQueryRegexp;

    return this.visibleChunks
      .map(chunk => {
        let foundGroups = [];

        if (this.searchMode === SEARCH_MODE.MODULES) {
          walkModules(chunk.groups, module => {
            let weight = 0;

            /**
             * Splitting found modules/directories into groups:
             *
             * 1) Module with matched label (weight = 4)
             * 2) Directory with matched label (weight = 3)
             * 3) Module with matched path (weight = 2)
             * 4) Directory with matched path (weight = 1)
             */
            if (query.test(module.label)) {
              weight += 3;
            } else if (module.path && query.test(module.path)) {
              weight++;
            }

            if (!weight) return;

            if (!module.groups) {
              weight += 1;
            }

            const foundModules = foundGroups[weight - 1] = foundGroups[weight - 1] || [];
            foundModules.push(module);
          });

          const {activeSize} = this;

          // Filtering out missing groups
          foundGroups = foundGroups.filter(Boolean).reverse();
          // Sorting each group by active size
          foundGroups.forEach(modules =>
            modules.sort((m1, m2) => m2[activeSize] - m1[activeSize])
          );

          return {
            chunk,
            modules: [].concat(...foundGroups)
          };
        } else {
          let modules = [];
          if (query.test(chunk.label)) {
            modules = chunk.groups;
          }

          return {
            chunk,
            modules
          };
        }
      })
      .filter(result => result.modules.length > 0)
      .sort((c1, c2) => c1.modules.length - c2.modules.length);
  }

  @computed get foundModules() {
    return this.foundModulesByChunk.reduce((arr, chunk) => arr.concat(chunk.modules), []);
  }

  @computed get hasFoundModules() {
    return this.foundModules.length > 0;
  }

  @computed get hasConcatenatedModules() {
    let result = false;

    walkModules(this.visibleChunks, module => {
      if (module.concatenated) {
        result = true;
        return false;
      }
    });

    return result;
  }

  @computed get foundModulesSize() {
    return this.foundModules.reduce(
      (summ, module) => summ + module[this.activeSize],
      0
    );
  }

  filterModulesForSize(modules, sizeProp) {
    return modules.reduce((filteredModules, module) => {
      if (module[sizeProp]) {
        if (module.groups) {
          const showContent = (!module.concatenated || this.showConcatenatedModulesContent);

          module = {
            ...module,
            groups: showContent ? this.filterModulesForSize(module.groups, sizeProp) : null
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
