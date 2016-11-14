/** @jsx h */
import { h, Component } from 'preact';
import filesize from 'filesize';

import Treemap from './Treemap';
import Tooltip from './Tooltip';
import Switcher from './Switcher';

import s from './ModulesTreemap.css';

export default class ModulesTreemap extends Component {
  static sizeSwitchItems = [
    { label: 'Stat', prop: 'statSize' },
    { label: 'Parsed', prop: 'parsedSize' },
    { label: 'Gzipped', prop: 'gzipSize' }
  ];

  constructor(props) {
    super(props);
    this.treemap = null;
    this.state = {
      showTooltip: false,
      tooltipContent: null,
      activeSizeItem: ModulesTreemap.sizeSwitchItems[this.hasParsedSizes() ? 1 : 0]
    };
  }

  render() {
    const { data } = this.props;
    const { showTooltip, tooltipContent, activeSizeItem } = this.state;

    return (
      <div className={s.container}>
        {this.hasParsedSizes() &&
          <div className={s.sizesSwitcher}>
            <Switcher label="Treemap sizes" items={ModulesTreemap.sizeSwitchItems} activeItem={activeSizeItem}
              onSwitch={this.handleSizeSwitch}/>
          </div>
        }
        <Treemap data={data} className={s.map} weightProp={activeSizeItem.prop}
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

  hasParsedSizes() {
    return (typeof this.props.data[0].parsedSize === 'number');
  }

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
