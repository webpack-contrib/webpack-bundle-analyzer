/** @jsx h */
import { h, Component } from 'preact';

import filesize from 'filesize';

import s from './ModuleDetails.css';

export default class ModuleDetails extends Component {

  render() {
    const { module } = this.props;

    return (
      <div className={s.container}>
        <div className={s.group}>
          <div className={s.groupTitle}>
            Details
          </div>
          <dl className={s.item}>
            <dt>Name</dt>
            <dd>{module.label}</dd>
          </dl>
          <dl className={s.item}>
            <dt>Path</dt>
            <dd>{module.path}</dd>
          </dl>
          <dl className={s.item}>
            <dt>Parsed size</dt>
            <dd>{filesize(module.parsedSize)}</dd>
          </dl>
          <dl className={s.item}>
            <dt>Gzipped size</dt>
            <dd>{filesize(module.gzipSize)}</dd>
          </dl>
        </div>

        {module.requiredBy && module.requiredBy.length &&
          <div className={s.group}>
            <div className={s.groupTitle}>
              Required by modules
            </div>
            {module.requiredBy.map(moduleId =>
              <dl key={moduleId} className={s.item}>
                <dd>{moduleId}</dd>
              </dl>
            )}
          </div>
        }
      </div>
    );
  }

}
