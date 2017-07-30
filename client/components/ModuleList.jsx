/** @jsx h */
import { h } from 'preact';
import cls from 'classnames';
import ModuleButton from './ModuleButton';
import s from './ModuleList.css';

const ModuleList = ( { modules, onModuleClick, className } ) => (
  <ul className={cls(s.list, className)}>
    {modules.map(module => (
      <li key={module.id} className={s.listItem}>
        {
          // eslint-disable-next-line react/jsx-no-bind
        }<ModuleButton module={module} onClick={onModuleClick.bind(null, module)}/>
      </li>
    ))}
  </ul>
);

export default ModuleList;
