/** @jsx h */
import {h, Component} from 'preact';

import Checkbox from './Checkbox';
import CheckboxList from './CheckboxList';

export default class CheckboxListItem extends Component {

  render() {
    return (
      <Checkbox {...this.props}
        onChange={this.handleChange}>
        {this.renderLabel()}
      </Checkbox>
    );
  }

  renderLabel() {
    const {children, item} = this.props;

    if (children && children.length) {
      return children[0](item);
    }

    return (item === CheckboxList.ALL_ITEM) ? 'All' : item.label;
  }

  handleChange = () => {
    this.props.onChange(this.props.item);
  }

}
