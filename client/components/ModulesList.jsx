import React from 'react';
import cls from 'classnames';

import s from './ModulesList.css';
import ModuleItem from './ModuleItem';

export default class ModulesList extends React.PureComponent {
  render({modules, showSize, highlightedText, isModuleVisible, className}) {
    return (
      <div className={cls(s.container, className)}>
        {modules.map(module =>
          <ModuleItem key={module.cid}
            module={module}
            showSize={showSize}
            highlightedText={highlightedText}
            isVisible={isModuleVisible}
            onClick={this.handleModuleClick}/>
        )}
      </div>
    );
  }

  handleModuleClick = module => this.props.onModuleClick(module);
}
