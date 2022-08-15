import PureComponent from '../lib/PureComponent';
import DropdownOption from './DropdownOption';

import s from './Dropdown.css';
import {store} from '../store';

const DEFAULT_DROPDOWN_SELECTION = 'Select an entrypoint';

export default class Dropdown extends PureComponent {

  constructor(props) {
    super(props);
  }

  render() {
    const {label, options} = this.props;

    return (
      <div className={s.container}>
        <div className={s.label}>
          {label}:
        </div>
        <div>
          <select className={s.select} id={label} name={label} onChange={this.handleSelection}>
            <DropdownOption value={DEFAULT_DROPDOWN_SELECTION}/>
            {options.map(option =>
              <DropdownOption value={option}/>
            )}
          </select>
        </div>
      </div>
    );
  }

  handleSelection = (event) => {
    const selected = event.target.value;

    if (selected === DEFAULT_DROPDOWN_SELECTION) {
      store.selectedChunks = store.allChunks;
      return;
    }

    store.selectedChunks = store.allChunks.filter(chunk => chunk.isInitialByEntrypoint[selected] ?? false);
  }
}
