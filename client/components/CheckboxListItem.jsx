/** @jsx h */
import { h, Component } from 'preact';

import s from './CheckboxList.css';

export default class CheckboxListItem extends Component {

  render() {
    const { item, checked } = this.props;

    return (
      <label className={s.item}>
        <input className={s.checkbox} type="checkbox" checked={checked}
          onChange={this.handleChange}/>
        <span className={s.itemText}>
          {item.label}
        </span>
      </label>
    );
  }

  handleChange = () => {
    this.props.onChange(this.props.item);
  }

}
