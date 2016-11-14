/** @jsx h */
import { h, Component } from 'preact';

import SwitcherItem from './SwitcherItem';
import s from './Switcher.css';

export default class Switcher extends Component {
  render() {
    const { label, items, activeItem, onSwitch } = this.props;

    return (
      <div className={s.container}>
        <span className={s.label}>{label}:</span>
        {items.map(item =>
          <SwitcherItem key={item.label} item={item} active={item === activeItem}
            onClick={onSwitch}/>
        )}
      </div>
    );
  }
}
