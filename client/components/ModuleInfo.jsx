/** @jsx h */
/* eslint-disable react/no-multi-comp */
import { h } from 'preact';
import cls from 'classnames';
import ModuleList from './ModuleList';
import s from './ModuleInfo.css';
import filesize from 'filesize';

import { SIZE_SWITCH_ITEMS } from '../constants';

const ModuleSize = ({ module, sizeType } ) => {
  const sizeProp = `${sizeType}Size`;
  const size = module[sizeProp];
  const sizeLabel = SIZE_SWITCH_ITEMS.find(item => item.prop === sizeProp).label;

  return (typeof size === 'number') ?
    <div>
      {sizeLabel} size: <strong>{filesize(size)}</strong>
    </div>
    :
    null;
};

const ModuleInfo = ({ module, className, onModuleClick } ) => (
  <div className={cls(className, s.wrapper)}>
    <div><strong>{module.label}</strong></div>
    <br/>
    <ModuleSize module={module} sizeType="stat"/>
    <ModuleSize module={module} sizeType="parsed"/>
    <ModuleSize module={module} sizeType="gzip"/>
    {module.path &&
      <span className={s.path}>Path: <strong>{module.path}</strong></span>
    }
    {module.reasons &&
      [
        <div key="reasons-header" className={s.reasons}>Reasons:</div>,
        <ModuleList key="reasons-list" className={s.list} modules={module.reasons} onModuleClick={onModuleClick}/>
      ]
    }
  </div>
);

export default ModuleInfo;
