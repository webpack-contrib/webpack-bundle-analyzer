/** @jsx h */
import { h, Component } from 'preact';

import CheckboxListItem from './CheckboxListItem';
import s from './CheckboxList.css';

const ALL_ITEM = {
  label: 'All'
};

export default class CheckboxList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      checkedItems: props.checkedItems || props.items
    };
  }

  render() {
    const { label, items } = this.props;

    return (
      <div className={s.container}>
        <div className={s.label}>
          {label}:
        </div>
        <div>
          <CheckboxListItem item={ALL_ITEM}
            checked={this.isAllChecked()}
            onChange={this.handleToggleAllCheck}/>
          {items.map(item =>
            <CheckboxListItem key={item.label}
              item={item}
              checked={this.isItemChecked(item)}
              onChange={this.handleItemCheck}/>
          )}
        </div>
      </div>
    );
  }

  handleToggleAllCheck = () => {
    const checkedItems = this.isAllChecked() ? [] : this.props.items;
    this.setState({ checkedItems });
    this.informAboutChange(checkedItems);
  };

  handleItemCheck = item => {
    let checkedItems;

    if (this.isItemChecked(item)) {
      checkedItems = this.state.checkedItems.filter(checkedItem => checkedItem !== item);
    } else {
      checkedItems = [...this.state.checkedItems, item];
    }

    this.setState({ checkedItems });
    this.informAboutChange(checkedItems);
  };

  isItemChecked(item) {
    return this.state.checkedItems.includes(item);
  }

  isAllChecked() {
    return (this.props.items.length === this.state.checkedItems.length);
  }

  informAboutChange(checkedItems) {
    setTimeout(() => this.props.onChange(checkedItems));
  }

}
