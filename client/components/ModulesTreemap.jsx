/** @jsx h */
import { h, Component } from 'preact';
import filesize from 'filesize';
import { computed } from 'mobx';
import { observer } from 'mobx-preact';

import { isChunkParsed } from '../utils';
import Treemap from './Treemap';
import Tooltip from './Tooltip';
import Switcher from './Switcher';
import Sidebar from './Sidebar';
import CheckboxList from './CheckboxList';

import s from './ModulesTreemap.css';
import Search from './Search';
import { store } from '../store';

const SIZE_SWITCH_ITEMS = [
  { label: 'Stat', prop: 'statSize' },
  { label: 'Parsed', prop: 'parsedSize' },
  { label: 'Gzipped', prop: 'gzipSize' }
];

@observer
export default class ModulesTreemap extends Component {
  state = {
    showTooltip: false,
    tooltipContent: null
  };

  render() {
    const { showTooltip, tooltipContent } = this.state;

    return (
      <div className={s.container}>
        <Sidebar>
          <div className={s.sidebarGroup}>
            <Switcher label="Treemap sizes"
              items={this.sizeSwitchItems}
              activeItem={this.activeSizeItem}
              onSwitch={this.handleSizeSwitch}/>
          </div>
          <div className={s.sidebarGroup}>
            <Search label="Search modules"
              query={store.searchQuery}
              onQueryChange={this.handleQueryChange}/>
          </div>
          {this.chunkItems.length > 1 &&
            <div className={s.sidebarGroup}>
              <CheckboxList label="Show chunks"
                items={this.chunkItems}
                checkedItems={store.selectedChunks}
                renderLabel={this.renderChunkItemLabel}
                onChange={this.handleSelectedChunksChange}/>
            </div>
          }
        </Sidebar>
        <Treemap className={s.map}
          data={store.visibleChunks}
          weightProp={store.activeSize}
          onMouseLeave={this.handleMouseLeaveTreemap}
          onGroupHover={this.handleTreemapGroupHover}/>
        <Tooltip visible={showTooltip}>
          {tooltipContent}
        </Tooltip>
      </div>
    );
  }

  renderModuleSize(module, sizeType) {
    const sizeProp = `${sizeType}Size`;
    const size = module[sizeProp];
    const sizeLabel = SIZE_SWITCH_ITEMS.find(item => item.prop === sizeProp).label;
    const isActive = (store.activeSize === sizeProp);

    return (typeof size === 'number') ?
      <div className={isActive ? s.activeSize : ''}>
        {sizeLabel} size: <strong>{filesize(size)}</strong>
      </div>
      :
      null;
  }

  renderChunkItemLabel = (item, labelClass) => {
    const isAllItem = (item === CheckboxList.ALL_ITEM);
    const label = isAllItem ? 'All' : item.label;
    const size = isAllItem ? store.totalChunksSize : item[store.activeSize];

    return (
      <span className={labelClass}>{label} (<strong>{filesize(size)}</strong>)</span>
    );
  };

  handleSizeSwitch = sizeSwitchItem => {
    store.selectedSize = sizeSwitchItem.prop;
  };

  handleQueryChange = query => {
    store.searchQuery = query;
  }

  handleSelectedChunksChange = selectedChunks => {
    store.selectedChunks = selectedChunks;
  };

  handleMouseLeaveTreemap = () => {
    this.setState({ showTooltip: false });
  };

  handleTreemapGroupHover = event => {
    const { group } = event;

    if (group) {
      this.setState({
        showTooltip: true,
        tooltipContent: this.getTooltipContent(group)
      });
    } else {
      this.setState({ showTooltip: false });
    }
  };

  @computed get sizeSwitchItems() {
    return store.hasParsedSizes ? SIZE_SWITCH_ITEMS : SIZE_SWITCH_ITEMS.slice(0, 1);
  }

  @computed get activeSizeItem() {
    return this.sizeSwitchItems.find(item => item.prop === store.activeSize);
  }

  @computed get chunkItems() {
    const { allChunks, activeSize } = store;
    let chunkItems = [...allChunks];

    if (activeSize !== 'statSize') {
      chunkItems = chunkItems.filter(isChunkParsed);
    }

    chunkItems.sort((chunk1, chunk2) => chunk2[activeSize] - chunk1[activeSize]);

    return chunkItems;
  }

  getTooltipContent(module) {
    if (!module) return null;

    return (
      <div>
        <div><strong>{module.label}</strong></div>
        <br/>
        {this.renderModuleSize(module, 'stat')}
        {!module.inaccurateSizes && this.renderModuleSize(module, 'parsed')}
        {!module.inaccurateSizes && this.renderModuleSize(module, 'gzip')}
        {module.path &&
          <div>Path: <strong>{module.path}</strong></div>
        }
      </div>
    );
  }

}
