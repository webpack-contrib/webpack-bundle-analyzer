/** @jsx h */
import { h, Component } from 'preact';

import CheckboxList from './CheckboxList';

import s from './CheckboxList.css';

export default class CheckboxListItem extends Component {

  render() {
    const { checked } = this.props;

    return (
      <label className={s.item}>
        <input className={s.checkbox}
          type="checkbox"
          checked={checked}
          onChange={this.handleChange}/>
        {this.renderLabel()}
      </label>
    );
  }

  renderLabel() {
    const { children, item } = this.props;

    if (children && children.length) {
      return children[0](item, s.itemText);
    }

    return (
      <span className={s.itemText}>
        {item === CheckboxList.ALL_ITEM ? 'All' : item.label}
      </span>
    );
  }

  handleChange = () => {
    this.props.onChange(this.props.item);
  }

}
