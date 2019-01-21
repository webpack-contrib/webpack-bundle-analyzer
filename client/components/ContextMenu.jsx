/** @jsx h */
import {h, Component} from 'preact';
import cls from 'classnames';
import { store } from '../store';

import s from './Tooltip.css';

export default class ContextMenu extends Component {

  static marginX = 10;
  static marginY = 30;

  constructor(props) {
    super(props);

    this.mouseCoords = {
      x: 0,
      y: 0
    };

    this.state = {
      left: 0,
      top: 0
    };
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.onMouseMove, false);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.visible || nextProps.visible;
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
  }

  render() {
    const {visible} = this.props;
    const className = cls({
      [s.container]: true,
      [s.hidden]: !visible
    });

    return (
      <ul ref={this.saveNode} className={className}>
        <li onClick={this.handleClickHideChunk}>Hide chunk</li>
        <li onClick={this.handleClickFilterToParents}>Show parent chunks</li>
        <li onClick={this.handleClickFilterToChunk}>Hide all other chunks</li>
      </ul>
    );
  }

  handleClickHideChunk = () => {
    const {chunk: selectedChunk} = this.props;
    if (selectedChunk && selectedChunk.label) {
      const filteredChunks = store.allChunks.filter(chunk => chunk.label !== selectedChunk.label);
      store.selectedChunks = filteredChunks;
    }
  }

  handleClickFilterToChunk = () => {
    const {chunk: selectedChunk} = this.props;
    if (selectedChunk && selectedChunk.label) {
      const filteredChunks = store.allChunks.filter(chunk => chunk.label === selectedChunk.label);
      store.selectedChunks = filteredChunks;
    }
  }

  handleClickFilterToParents = () => {
    const {chunk: selectedChunk} = this.props;
    if (selectedChunk && selectedChunk.parentAssetNames) {
      const groupAndParentAssets = [selectedChunk.label, ...selectedChunk.parentAssetNames];
      const filteredChunks = store.allChunks.filter(chunk => groupAndParentAssets.includes(chunk.label));
      store.selectedChunks = filteredChunks;
    }
  }

  saveNode = node => (this.node = node);

  getStyle() {
    return {
      left: this.state.left,
      top: this.state.top
    };
  }

  updatePosition() {
    if (!this.props.visible) return;

    const pos = {
      left: this.mouseCoords.x + ContextMenu.marginX,
      top: this.mouseCoords.y + ContextMenu.marginY
    };

    const boundingRect = this.node.getBoundingClientRect();

    if (pos.left + boundingRect.width > window.innerWidth) {
      // Shifting horizontally
      pos.left = window.innerWidth - boundingRect.width;
    }

    if (pos.top + boundingRect.height > window.innerHeight) {
      // Flipping vertically
      pos.top = this.mouseCoords.y - ContextMenu.marginY - boundingRect.height;
    }

    this.setState(pos);
  }

  onMouseMove = event => {
    Object.assign(this.mouseCoords, {
      x: event.pageX,
      y: event.pageY
    });

    if (this.props.visible) {
      this.updatePosition();
    }
  };

}
