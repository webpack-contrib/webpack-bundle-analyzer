/** @jsx h */
import { h, Component } from 'preact';
import ModuleList from './ModuleList';
import s from './ModuleSearch.css';

export default class ModuleSearch extends Component {

  constructor( props ) {
    super(props);
  }

  componentDidMount( ) {
    this.input.focus();
  }

  render( ) {

    const { query } = this.props;
    let modules = [];

    if (query) {
      modules = this.props.modules.filter(module => (
        module.path.indexOf(query) !== -1
      ));
    }

    return (
      <div className={s.wrapper}>
        <input ref={this.onRef}
          value={query}
          className={s.input}
          onInput={this.props.onChange}/>
        <ModuleList className={s.list} modules={modules} onModuleClick={this.props.onModuleClick}/>
      </div>
    );
  }

  onRef = ref => {
    this.input = ref;
  }

}
