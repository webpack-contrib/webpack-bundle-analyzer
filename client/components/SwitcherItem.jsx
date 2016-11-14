/** @jsx h */
import { h, Component } from 'preact';

import s from './Switcher.css';

export default class SwitcherItem extends Component {
  render() {
    const { item, active } = this.props;

    return (
      <span className={active ? s.activeItem : s.item}
        onClick={this.handleClick}>
        {item.label}
      </span>
    );
  }

  handleClick = () => {
    if (this.props.onClick) {
      this.props.onClick(this.props.item);
    }
  }
}
