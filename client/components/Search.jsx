/** @jsx h */
import {h} from 'preact';
import _ from 'lodash';

import s from './Search.css';
import Button from './Button';
import PureComponent from '../lib/PureComponent';

export default class Search extends PureComponent {

  componentDidMount() {
    if (this.props.autofocus) {
      this.focus();
    }
  }

  componentWillUnmount() {
    this.handleValueChange.cancel();
  }

  render() {
    const {label, query} = this.props;

    return (
      <div className={s.container}>
        <div className={s.label}>
          {label}:
        </div>
        <div className={s.row}>
          <input ref={this.saveInputNode}
            className={s.input}
            type="text"
            value={query}
            placeholder="Enter regexp"
            onInput={this.handleValueChange}
            onBlur={this.handleInputBlur}/>
          <Button className={s.clear} onClick={this.handleClearClick}>x</Button>
        </div>
      </div>
    );
  }

  handleValueChange = _.debounce((event) => {
    this.informChange(event.target.value);
  }, 200)

  handleInputBlur = () => {
    this.handleValueChange.flush();
  }

  handleClearClick = () => {
    this.clear();
    this.focus();
  }

  handleKeyDown = event => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      this.clear();
    }
  }

  focus() {
    if (this.input) {
      this.input.focus();
    }
  }

  clear() {
    this.handleValueChange.cancel();
    this.informChange('');
  }

  informChange(value) {
    this.props.onQueryChange(value);
  }

  saveInputNode = node => this.input = node;
}
