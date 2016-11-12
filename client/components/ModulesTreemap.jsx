/** @jsx h */
import { h, Component } from 'preact';
import filesize from 'filesize';

import Treemap from './Treemap';
import Tooltip from './Tooltip';
import s from './ModulesTreemap.css';

export default class ModulesTreemap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTooltip: false
    };
    this.tooltipContent = null;
  }

  render() {
    const { data } = this.props;
    const { showTooltip } = this.state;

    return (
      <div className={s.container}>
        <Treemap data={data} className={s.map}
          onGroupHover={this.handleTreemapGroupHover}/>
        <Tooltip visible={showTooltip}>
          {this.tooltipContent}
        </Tooltip>
      </div>
    );
  }

  handleTreemapGroupHover = event => {
    const { group } = event;

    if (group) {
      this.tooltipContent = this.getTooltipContent(group);
      this.setState({ showTooltip: true });
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
        {(typeof module.parsedSize === 'number') &&
          <div>Parsed size: <b>{filesize(module.parsedSize)}</b></div>
        }
        <div>Stat size: <b>{filesize(module.statSize)}</b></div>
        {module.path &&
          <div>Path: <b>{module.path}</b></div>
        }
      </div>
    );
  }
}
