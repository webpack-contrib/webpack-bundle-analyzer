/** @jsx h */
import {h, Component} from 'preact';
import _ from 'lodash';

import s from './Search.css';

export default class Search extends Component {

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
        <div>
          <input className={s.input}
            type="text" value={query}
            onInput={this.handleValueChange}
            onBlur={this.handleInputBlur}/>
        </div>
      </div>
    );
  }

  handleValueChange = _.debounce((event) => {
    this.props.onQueryChange(event.target.value);
  }, 200)

  handleInputBlur = () => {
    this.handleValueChange.flush();
  }

}
