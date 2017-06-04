/** @jsx h */
import { h, Component } from 'preact';
import keyBy from 'lodash/keyBy';

import Treemap from './Treemap';
import Tooltip from './Tooltip';
import Switcher from './Switcher';
import Sidebar from './Sidebar';
import CheckboxList from './CheckboxList';
import ModuleInfo from './ModuleInfo';
import ModuleSearch from './ModuleSearch';

import s from './ModulesTreemap.css';

import { compareStrings } from '../utils';
import { SIZE_SWITCH_ITEMS } from '../constants';

const getModules = ( data, accum, parent ) => data.reduce(( accumulator, group ) => {
  let gr = group;
  if ('id' in gr) {
    gr = { ...gr, parent };
    accumulator.push(gr);
  }
  if ('groups' in gr) {
    getModules(gr.groups, accumulator, gr);
  }
  return accumulator;
}, accum);

export default class ModulesTreemap extends Component {

  constructor(props) {
    super(props);
    this.setData(props.data, true);
  }

  componentDidMount( ) {
    window.addEventListener('hashchange', this.handleHashChange);
    this.handleHashChange();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.data !== this.props.data) {
      this.setData(newProps.data);
    }
  }

  render() {
    const {
      data,
      showTooltip,
      tooltipContent,
      activeSizeItem,
      modules,
      selectedModule
    } = this.state;

    const locked =
      window.location.hash.length > 1;

    return (
      <div className={s.container}>
        <Sidebar locked={locked} onCloseClick={this.handleSidebarCloseClick}>
          {!selectedModule &&
            <ModuleSearch query={this.state.query}
              onModuleClick={this.handleModuleClick}
              onChange={this.handleSearchChange}
              modules={modules}/>}
          {!!selectedModule &&
            <div className={s.moduleInfo}>
              <button className={s.backButton} type="button" onClick={this.handleBackClick}>
                ←
              </button>
              <ModuleInfo module={selectedModule} onModuleClick={this.handleModuleClick}/>
            </div>
          }
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
                onChange={this.handleVisibleChunksChange}/>
            </div>
          }
        </Sidebar>
        <Treemap className={s.map}
          data={data}
          weightProp={activeSizeItem.prop}
          onMouseLeave={this.handleMouseLeaveTreemap}
          onGroupHover={this.handleTreemapGroupHover}
          onGroupClick={this.handleTreemapGroupClick}/>
        <Tooltip visible={showTooltip}>
          {tooltipContent}
        </Tooltip>
      </div>
    );
  }

  handleBackClick = ( ) => {
    window.history.go(-1);
  }

  handleSizeSwitch = sizeSwitchItem => {
    this.setState({ activeSizeItem: sizeSwitchItem });
  };

  handleVisibleChunksChange = visibleChunkItems => {
    this.visibleChunkItems = visibleChunkItems;
    this.setState({ data: this.getVisibleChunksData() });
  };

  handleMouseLeaveTreemap = () => {
    this.setState({ showTooltip: false });
  };

  handleModuleClick = ( module ) => {

    if (this.state.query) {
      // commit query to history
      window.location.hash = this.state.query;
    }

    const identifier = module.id
      || module.path
      || module.label;

    window.location.hash = identifier;

  };

  handleHashChange = ( ) => {

    const moduleId = window.location.hash.split('#')[1];

    let selectedModule;
    let { query } = this.state;

    selectedModule = this.state.modulesById[moduleId];

    if (!selectedModule) {
      query = moduleId;
      selectedModule = null;
    } else {
      query = '';
    }

    this.setState({
      selectedModule,
      query
    });
  };

  handleSearchChange = ( event ) => {
    this.setState({ query: event.target.value });
  }

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

  handleTreemapGroupClick = event => {
    const { group } = event;

    this.handleModuleClick(group);
  }

  handleSidebarCloseClick = () => {
    window.location.hash = '';
  };

  setData(data, initial) {
    const hasParsedSizes = (typeof data[0].parsedSize === 'number');
    this.sizeSwitchItems = hasParsedSizes ? SIZE_SWITCH_ITEMS : SIZE_SWITCH_ITEMS.slice(0, 1);
    const activeSizeItemProp = initial ? `${this.props.defaultSizes}Size` : this.state.activeSizeItem.prop;
    let activeSizeItem = this.sizeSwitchItems.find(item => item.prop === activeSizeItemProp);
    if (!activeSizeItem) activeSizeItem = this.sizeSwitchItems[0];

    const chunkItems = [...data]
      .sort((chunk1, chunk2) => compareStrings(chunk1.label, chunk2.label))
      .map(chunk => ({ label: chunk.label }));

    if (initial) {
      this.visibleChunkItems = chunkItems;
    }

    const modules = getModules(data, []);

    const modulesById = keyBy(modules, 'id');

    modules.forEach(module => {
      module.reasons = module.reasons ?
        module.reasons.map(reason => (
          modulesById[reason.moduleId]
        ))
        : [];
    });

    this.setState({
      data: this.getVisibleChunksData(),
      modules,
      modulesById,
      showTooltip: false,
      tooltipContent: null,
      activeSizeItem,
      chunkItems,
      query: ''
    });
  }

  getVisibleChunksData() {
    return this.props.data.filter(chunk =>
      this.visibleChunkItems.find(item => item.label === chunk.label)
    );
  }

  getTooltipContent(module) {
    if (!module) return null;

    const parsedModule = this.state.modulesById[module.id] || module;

    return parsedModule && (<ModuleInfo module={parsedModule}
      onModuleClick={this.handleModuleClick}/>);
  }

}
