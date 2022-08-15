import {Component} from 'preact';

export default class DropdownOption extends Component {
  render() {
    const {value} = this.props;

    return (
      <option value={value}>{value}</option>
    );
  }
}
