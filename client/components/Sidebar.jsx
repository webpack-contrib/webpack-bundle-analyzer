/** @jsx h */
import {h, Component} from 'preact';
import cls from 'classnames';

import s from './Sidebar.css';
import Button from './Button';

const toggleTime = parseInt(s.toggleTime);

export default class Sidebar extends Component {
  static defaultProps = {
    position: 'left'
  };

  allowHide = true;
  toggling = false;
  hideContentTimeout = null;
  state = {
    visible: true,
    renderContent: true
  };

  componentDidMount() {
    this.hideTimeoutId = setTimeout(() => this.toggleVisibility(false), 3000);
  }

  componentWillUnmount() {
    clearTimeout(this.hideTimeoutId);
    clearTimeout(this.hideContentTimeout);
  }

  render() {
    const {position, children} = this.props;
    const {visible, renderContent} = this.state;

    const className = cls({
      [s.container]: true,
      [s.left]: (position === 'left'),
      [s.hidden]: !visible
    });

    return (
      <div className={className}
        onMouseLeave={this.handleMouseLeave}>
        <Button type="button"
          className={s.toggleButton}
          onClick={this.handleToggleButtonClick}>
          {visible ? '<' : '>'}
        </Button>
        <div className={s.content}
          onClick={this.handleClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseMove={this.handleMouseMove}>
          {renderContent ? children : null}
        </div>
      </div>
    );
  }

  handleClick = () => {
    this.allowHide = false;
  }

  handleMouseEnter = () => {
    if (!this.toggling) {
      clearTimeout(this.hideTimeoutId);
      this.toggleVisibility(true);
    }
  };

  handleMouseMove = () => {
    this.allowHide = true;
  }

  handleMouseLeave = () => {
    if (this.allowHide && !this.toggling) {
      this.toggleVisibility(false);
    }
  }

  handleToggleButtonClick = () => {
    this.toggleVisibility();
  }

  toggleVisibility(flag) {
    clearTimeout(this.hideContentTimeout);

    const {visible} = this.state;

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

    if (flag) {
      this.setState({renderContent: true});
    } else {
      // Waiting for the CSS animation to finish and hiding content
      this.hideContentTimeout = setTimeout(() => {
        this.hideContentTimeout = null;
        this.setState({renderContent: false});
      }, toggleTime);
    }
  }

}
