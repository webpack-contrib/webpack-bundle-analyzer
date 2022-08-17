import PureComponent from '../lib/PureComponent';

import s from './Dropdown.css';
export default class Dropdown extends PureComponent {

  render() {
    const {label, defaultOption, onSelectionChange, options} = this.props;

    return (
      <div className={s.container}>
        <div className={s.label}>
          {label}:
        </div>
        <div>
          <select className={s.select} id={label} name={label} onChange={onSelectionChange}>
            <option value={defaultOption}>{defaultOption}</option>
            {options.map(option =>
              <option key={option} value={option}>{option}</option>
            )}
          </select>
        </div>
      </div>
    );
  }
}
