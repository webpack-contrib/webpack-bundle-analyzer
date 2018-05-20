/** @jsx h */
import { h, Component } from 'preact';
import filesize from 'filesize';

import { isChunkParsed } from '../utils';
import Treemap from './Treemap';
import Tooltip from './Tooltip';
import Switcher from './Switcher';
import Sidebar from './Sidebar';
import CheckboxList from './CheckboxList';

import s from './ModulesTreemap.css';

const SIZE_SWITCH_ITEMS = [
  { label: 'Stat', prop: 'statSize' },
  { label: 'Parsed', prop: 'parsedSize' },
  { label: 'Gzipped', prop: 'gzipSize' }
];

export default class ModulesTreemap extends Component {

  constructor(props) {
    super(props);
    this.updateChunks(props.chunks, { initial: true });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.chunks !== this.props.chunks) {
      this.updateChunks(newProps.chunks);
    }
  }

  render() {
    const { visibleChunks, showTooltip, tooltipContent, activeSizeItem } = this.state;

    return (
      <div className={s.container}>
        <Sidebar>
          <div className={s.sidebarGroup}>
            <Switcher label="Treemap sizes"
              items={this.sizeSwitchItems}
              activeItem={activeSizeItem}
              onSwitch={this.handleSizeSwitch}/>
          </div>
          {this.state.chunkItems.length > 1 &&
            <div className={s.sidebarGroup}>
              <CheckboxList label="Show chunks"
                items={this.state.chunkItems}
                checkedItems={this.visibleChunkItems}
                renderLabel={this.renderChunkItemLabel}
                onChange={this.handleVisibleChunksChange}/>
            </div>
          }
        </Sidebar>
        <Treemap className={s.map}
          data={visibleChunks}
          weightProp={activeSizeItem.prop}
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
    const isActive = (this.state.activeSizeItem.prop === sizeProp);

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
    const size = isAllItem ? this.totalChunksSize : item[this.state.activeSizeItem.prop];

    return (
      <span className={labelClass}>{label} (<strong>{filesize(size)}</strong>)</span>
    );
  };

  handleSizeSwitch = sizeSwitchItem => {
    this.updateChunks(this.chunks, { activeSizeItem: sizeSwitchItem });
  };

  handleVisibleChunksChange = visibleChunkItems => {
    this.visibleChunkItems = visibleChunkItems;
    this.updateVisibleChunks();
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

  get totalChunksSize() {
    const sizeProp = this.state.activeSizeItem.prop;
    return this.chunks.reduce((totalSize, chunk) =>
      totalSize + (chunk[sizeProp] || 0),
    0);
  }

  updateChunks(chunks, { initial, activeSizeItem } = {}) {
    this.chunks = chunks;

    const hasParsedSizes = chunks.some(isChunkParsed);
    this.sizeSwitchItems = hasParsedSizes ? SIZE_SWITCH_ITEMS : SIZE_SWITCH_ITEMS.slice(0, 1);

    if (!activeSizeItem) {
      const activeSizeItemProp = initial ? `${this.props.defaultSizes}Size` : this.state.activeSizeItem.prop;
      activeSizeItem = this.sizeSwitchItems.find(item => item.prop === activeSizeItemProp);
      if (!activeSizeItem) activeSizeItem = this.sizeSwitchItems[0];
    }

    let chunkItems = [...chunks];

    if (activeSizeItem.prop !== 'statSize') {
      chunkItems = chunkItems.filter(isChunkParsed);
    }

    chunkItems.sort((chunk1, chunk2) => chunk2[activeSizeItem.prop] - chunk1[activeSizeItem.prop]);

    if (initial) {
      this.visibleChunkItems = chunkItems;
    }

    this.setState({
      showTooltip: false,
      tooltipContent: null,
      activeSizeItem,
      chunkItems
    });
    this.updateVisibleChunks();
  }

  updateVisibleChunks() {
    this.setState({
      visibleChunks: this.chunks.filter(chunk =>
        this.visibleChunkItems.find(visibleChunk => chunk.label === visibleChunk.label)
      )
    });
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
