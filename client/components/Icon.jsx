/** @jsx h */
import {h} from 'preact';
import cls from 'classnames';
import s from './Icon.css';
import PureComponent from '../lib/PureComponent';

const ICONS = {
  'arrow-right': {
    src: require('../assets/icon-arrow-right.svg'),
    size: [7, 13]
  },
  'pin': {
    src: require('../assets/icon-pin.svg'),
    size: [12, 18]
  }
};

export default class Icon extends PureComponent {
  render({className}) {
    return (
      <i className={cls(s.icon, className)}
        style={this.style}/>
    );
  }

  get style() {
    const {name, size, rotate} = this.props;
    const icon = ICONS[name];

    if (!icon) throw new TypeError(`Can't find "${name}" icon.`);

    let [width, height] = icon.size;

    if (size) {
      const ratio = size / Math.max(width, height);
      width = Math.min(width * ratio, size);
      height = Math.min(height * ratio, size);
    }

    return {
      backgroundImage: `url(${icon.src})`,
      width: `${width.toFixed(1)}px`,
      height: `${height.toFixed(1)}px`,
      transform: rotate ? `rotate(${rotate}deg)` : ''
    };
  }
}
