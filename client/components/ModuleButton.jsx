/** @jsx h */
import { h } from 'preact';
import s from './ModuleButton.css';

const ModuleButton = ( { module, onClick } ) => (
  <button className={s.button} type="button" onClick={onClick}>
    <div className={s.content}>
      {module.path.replace('./node_modules/', '~')
        .replace(/\/index\.(js|jsx)$/, '')
      }
      {module.reasons.length > 0 && ` (${module.reasons.length})`}
    </div>
  </button>
);

export default ModuleButton;
