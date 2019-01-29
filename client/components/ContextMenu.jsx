/** @jsx h */
import {h, Component} from 'preact';
import cls from 'classnames';
import {store} from '../store';
import {elementIsOutside} from '../utils';

import s from './ContextMenu.css';

export default class ContextMenu extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.boundingRect = this.node.getBoundingClientRect();
  }

  shouldComponentUpdate(nextProps) {
    return this.props.visible || nextProps.visible;
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible && !prevProps.visible) {
      document.addEventListener('mousedown', this.handleDocumentMousedown, true);
    } else if (prevProps.visible && !this.props.visible) {
      document.removeEventListener('mousedown', this.handleDocumentMousedown, true);
    }
  }

  render() {
    const {visible} = this.props;
    const containerClassName = cls({
      [s.container]: true,
      [s.hidden]: !visible
    });
    const itemClassName = cls({
      [s.item]: true
    });
    return (
      <ul ref={this.saveNode} className={containerClassName} style={this.getStyle()}>
        <li className={itemClassName} onClick={this.handleClickHideChunk}>Hide chunk</li>
        <li className={itemClassName} onClick={this.handleClickFilterToParents}>Show parent chunks</li>
        <li className={itemClassName} onClick={this.handleClickFilterToChunk}>Hide all other chunks</li>
        <hr/>
        <li className={itemClassName} onClick={this.handleClickShowAllChunks}>Show all chunks</li>
      </ul>
    );
  }

  handleClickHideChunk = () => {
    const {chunk: selectedChunk} = this.props;
    if (selectedChunk && selectedChunk.label) {
      const filteredChunks = store.selectedChunks.filter(chunk => chunk.label !== selectedChunk.label);
      store.selectedChunks = filteredChunks;
    }
    this.hide();
  }

  handleClickFilterToChunk = () => {
    const {chunk: selectedChunk} = this.props;
    if (selectedChunk && selectedChunk.label) {
      const filteredChunks = store.allChunks.filter(chunk => chunk.label === selectedChunk.label);
      store.selectedChunks = filteredChunks;
    }
    this.hide();
  }

  handleClickFilterToParents = () => {
    const {chunk: selectedChunk} = this.props;
    if (selectedChunk && selectedChunk.parentAssetNames) {
      const groupAndParentAssets = [selectedChunk.label, ...selectedChunk.parentAssetNames];
      const filteredChunks = store.allChunks.filter(chunk => groupAndParentAssets.includes(chunk.label));
      store.selectedChunks = filteredChunks;
    }
    this.hide();
  }

  handleClickShowAllChunks = () => {
    store.selectedChunks = store.allChunks;
    this.hide();
  }

  handleDocumentMousedown = (e) => {
    if (elementIsOutside(e.target, this.node)) {
      e.preventDefault();
      e.stopPropagation();
      this.hide();
    }
  }

  hide() {
    if (this.props.onHide) {
      this.props.onHide();
    }
  }

  saveNode = node => (this.node = node);

  getStyle() {
    const {boundingRect} = this;
    if (!this.props.visible || !boundingRect) return;

    const {coords} = this.props;

    const pos = {
      left: coords.x,
      top: coords.y
    };

    if (pos.left + boundingRect.width > window.innerWidth) {
      // Shifting horizontally
      pos.left = window.innerWidth - boundingRect.width;
    }

    if (pos.top + boundingRect.height > window.innerHeight) {
      // Flipping vertically
      pos.top = coords.y - boundingRect.height;
    }
    return pos;
  }
}
