/** @jsx h */
import _ from 'lodash';
import {h} from 'preact';
import filesize from 'filesize';
import s from './ModuleItem.css';
import PureComponent from '../lib/PureComponent';

export default class ModuleItem extends PureComponent {
  render({module, showSize}) {
    return (
      <div className={s.container} onClick={this.handleClick}>
        <span dangerouslySetInnerHTML={{__html: this.titleHtml}}/>
        {showSize && [
          ' (',
          <strong>{filesize(module[showSize])}</strong>,
          ')'
        ]}
      </div>
    );
  }

  handleClick = () => this.props.onClick(this.props.module);

  get titleHtml() {
    let html;
    const {module} = this.props;
    const title = module.path || module.label;
    const term = this.props.highlightedText;

    if (term) {
      const regexp = (term instanceof RegExp) ?
        new RegExp(term.source, 'ig') :
        new RegExp(`(?:${_.escapeRegExp(term)})+`, 'i');
      let match;
      let lastMatch;

      do {
        lastMatch = match;
        match = regexp.exec(title);
      } while (match);

      if (lastMatch) {
        html = (
          _.escape(title.slice(0, lastMatch.index)) +
          `<strong>${_.escape(lastMatch[0])}</strong>` +
          _.escape(title.slice(lastMatch.index + lastMatch[0].length))
        );
      }
    }

    if (!html) {
      html = _.escape(title);
    }

    return html;
  }
}
