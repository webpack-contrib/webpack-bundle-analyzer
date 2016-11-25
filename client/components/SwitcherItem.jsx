/** @jsx h */
import { h, Component } from 'preact';
import cls from 'classnames';

import s from './Switcher.css';

export default class SwitcherItem extends Component {

  render() {
    const { item, active } = this.props;

    const className = cls({
      [s.item]: true,
      [s.active]: active
    });

    return (
      <span className={className}
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
