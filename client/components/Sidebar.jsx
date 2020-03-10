import React from 'react';
import cls from 'classnames';

import s from './Sidebar.css';
import Button from './Button';
import Icon from './Icon';

const toggleTime = parseInt(s.toggleTime);

export default class Sidebar extends React.Component {
  static defaultProps = {
    pinned: false,
    position: 'left',
    autoShow: true
  };

  allowHide = true;
  toggling = false;
  hideContentTimeout = null;
  width = null;

  constructor(props) {
    super(props);

    const {pinned, autoShow} = props;
    const visible = pinned || autoShow;

    this.state = {
      visible,
      pinned,
      renderContent: visible
    };
  }

  componentDidMount() {
    if (!this.state.pinned && this.props.autoShow) {
      this.hideTimeoutId = setTimeout(() => this.toggleVisibility(false), 3000);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.hideTimeoutId);
    clearTimeout(this.hideContentTimeout);
  }

  render() {
    const {position, children} = this.props;
    const {visible, pinned, renderContent} = this.state;

    const className = cls(s[position], {
      [s.container]: true,
      [s.pinned]: pinned,
      [s.hidden]: !visible,
      [s.empty]: !renderContent
    });

    return (
      <div ref={this.saveNode}
        className={className}
        onClick={this.handleClick}
        onMouseLeave={this.handleMouseLeave}>
        {visible &&
          <Button type="button"
            title="Pin"
            className={s.pinButton}
            active={pinned}
            toggle
            onClick={this.handlePinButtonClick}>
            <Icon name="pin" size={13}/>
          </Button>
        }
        <Button type="button"
          title={visible ? 'Hide' : 'Show sidebar'}
          className={s.toggleButton}
          onClick={this.handleToggleButtonClick}>
          <Icon name="arrow-right"
            size={10}
            rotate={this.toggleIconRotationAngle}/>
        </Button>
        {pinned && visible &&
          <div className={s.resizer} onMouseDown={this.handleResizeStart}/>
        }
        <div className={s.content}
          onMouseEnter={this.handleMouseEnter}
          onMouseMove={this.handleMouseMove}>
          {renderContent ? children : null}
        </div>
      </div>
    );
  }

  get nodeWidth() {
    return this.node.getBoundingClientRect().width;
  }

  get toggleIconRotationAngle() {
    const {position} = this.props;
    const {visible} = this.state;
    return (position === 'left' && visible) || (position === 'right' && !visible) ? 180 : 0;
  }

  handleClick = () => {
    this.allowHide = false;
  }

  handleMouseEnter = () => {
    if (!this.toggling && !this.state.pinned) {
      clearTimeout(this.hideTimeoutId);
      this.toggleVisibility(true);
    }
  };

  handleMouseMove = () => {
    this.allowHide = true;
  }

  handleMouseLeave = () => {
    if (this.allowHide && !this.toggling && !this.state.pinned) {
      this.toggleVisibility(false);
    }
  }

  handleToggleButtonClick = () => {
    this.toggleVisibility();
  }

  handlePinButtonClick = () => {
    const pinned = !this.state.pinned;
    this.width = pinned ? this.nodeWidth : null;
    this.updateNodeWidth();
    this.setState({pinned});
  }

  handleResizeStart = event => {
    this.width = this.nodeWidth;
    this.updateNodeWidth();
    this.resizeInfo = {
      startPageX: event.pageX,
      initialWidth: this.width
    };
    document.body.classList.add('resizing', 'col');
    document.addEventListener('mousemove', this.handleResize, true);
    document.addEventListener('mouseup', this.handleResizeEnd, true);
  }

  handleResize = event => {
    const k = (this.state.position === 'left') ? 1 : -1;
    this.width = this.resizeInfo.initialWidth + ((event.pageX - this.resizeInfo.startPageX) * k);
    this.updateNodeWidth();
  }

  handleResizeEnd = () => {
    document.body.classList.remove('resizing', 'col');
    document.removeEventListener('mousemove', this.handleResize, true);
    document.removeEventListener('mouseup', this.handleResizeEnd, true);
  }

  toggleVisibility(flag) {
    clearTimeout(this.hideContentTimeout);

    const {visible, pinned} = this.state;

    if (flag === undefined) {
      flag = !visible;
    } else if (flag === visible) {
      return;
    }

    this.setState({visible: flag});
    this.toggling = true;
    setTimeout(() => {
      this.toggling = false;
    }, toggleTime);

    if (pinned) {
      this.updateNodeWidth(flag ? this.width : null);
    }

    if (flag || pinned) {
      this.setState({renderContent: flag});
    } else if (!flag) {
      // Waiting for the CSS animation to finish and hiding content
      this.hideContentTimeout = setTimeout(() => {
        this.hideContentTimeout = null;
        this.setState({renderContent: false});
      }, toggleTime);
    }
  }

  saveNode = node => this.node = node;

  updateNodeWidth(width = this.width) {
    this.node.style.width = width ? `${width}px` : '';
  }

}
