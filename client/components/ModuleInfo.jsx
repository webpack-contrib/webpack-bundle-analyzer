import React from 'react';
import {observer} from 'mobx-preact';

import {store} from '../store';
import s from './ModuleInfo.css';
import sidebarStyles from './Sidebar.css';
import ModuleItem from './ModuleItem';

@observer
export default class ModuleInfo extends React.PureComponent {
  render({module}) {
    return (
      <div>
        <div className={sidebarStyles.group}>
          {module.label}
        </div>
        {store.selectedModuleReasons &&
          <div className={sidebarStyles.group}>
            <div className={sidebarStyles.groupLabel}>
              Reasons:
            </div>
            {store.selectedModuleReasons.map(({chunk, reasons}) =>
              <>
                <div>{chunk.label}</div>
                {reasons.map(reasonModule =>
                  <ModuleItem key={reasonModule.id}
                    module={reasonModule}
                    showSize={store.activeSize}
                    onClick={this.handleReasonModuleClick}/>
                )}
              </>
            )}
          </div>
        }
      </div>
    );
  }

  get reasonModules() {
    const {reasons} = this.props.module;
    return reasons ? reasons.map(id => store.modulesById.get(id)) : [];
  }

  handleReasonModuleClick = module => {
    store.selectedModule = module;
  }
}
