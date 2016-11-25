/** @jsx h */
import { h, Component } from 'preact';
import filesize from 'filesize';

import Treemap from './Treemap';
import Tooltip from './Tooltip';
import Switcher from './Switcher';
import Sidebar from './Sidebar';

import s from './ModulesTreemap.css';

const SIZE_SWITCH_ITEMS = [
  { label: 'Stat', prop: 'statSize' },
  { label: 'Parsed', prop: 'parsedSize' },
  { label: 'Gzipped', prop: 'gzipSize' }
];

export default class ModulesTreemap extends Component {

  constructor(props) {
    super(props);
    this.treemap = null;
    this.hasParsedSizes = (typeof this.props.data[0].parsedSize === 'number');
    this.sizeSwitchItems = this.hasParsedSizes ? SIZE_SWITCH_ITEMS : SIZE_SWITCH_ITEMS.slice(0, 1);
    this.state = {
      showTooltip: false,
      tooltipContent: null,
      activeSizeItem: SIZE_SWITCH_ITEMS.find(item =>
        item.label === (this.hasParsedSizes ? 'Parsed' : 'Stat')
      )
    };
  }

  render() {
    const { data } = this.props;
    const { showTooltip, tooltipContent, activeSizeItem } = this.state;

    return (
      <div className={s.container}>
        <Sidebar>
          <Switcher label="Treemap sizes"
            items={this.sizeSwitchItems}
            activeItem={activeSizeItem}
            onSwitch={this.handleSizeSwitch}/>
        </Sidebar>
        <Treemap className={s.map}
          data={data}
          weightProp={activeSizeItem.prop}
          onMouseLeave={this.handleMouseLeaveTreemap}
          onGroupHover={this.handleTreemapGroupHover}/>
        <Tooltip visible={showTooltip}>
          {tooltipContent}
        </Tooltip>
      </div>
    );
  }

  handleSizeSwitch = (sizeSwitchItem) => {
    this.setState({ activeSizeItem: sizeSwitchItem });
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

  getTooltipContent(module) {
    if (!module) return null;

    return (
      <div>
        <div><b>{module.label}</b></div>
        <br/>
        <div>Stat size: <b>{filesize(module.statSize)}</b></div>
        {(typeof module.parsedSize === 'number') &&
          <div>Parsed size: <b>{filesize(module.parsedSize)}</b></div>
        }
        {(typeof module.gzipSize === 'number') &&
          <div>Gzip size: <b>{filesize(module.gzipSize)}</b></div>
        }
        {module.path &&
          <div>Path: <b>{module.path}</b></div>
        }
      </div>
    );
  }

}
