/** @jsx h */
import { h, Component } from 'preact';
import cls from 'classnames';

import s from './Sidebar.css';

export default class Sidebar extends Component {

  static defaultProps = {
    position: 'left'
  };

  state = {
    visible: true
  };

  componentDidMount() {
    this.hideTimeoutId = setTimeout(() => this.toggleVisibility(false), 1500);
  }

  componentWillUnmount() {
    clearInterval(this.hideTimeoutId);
  }

  render() {
    const { position, children } = this.props;
    const visible = this.state.visible || this.props.locked;

    const className = cls({
      [s.container]: true,
      [s.left]: (position === 'left'),
      [s.hidden]: !visible
    });

    return (
      <div className={className}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}>
        <button className={s.closeButton} onClick={this.handleCloseClick}>
          ✕
        </button>
        <div>
          {children}
        </div>
      </div>
    );
  }

  handleMouseEnter = () => {
    clearTimeout(this.hideTimeoutId);
    this.toggleVisibility(true);
  };

  handleMouseLeave = () => this.toggleVisibility(false);

  handleCloseClick = ( event ) => {
    this.toggleVisibility(false);
    this.props.onCloseClick(event);
  }

  toggleVisibility(flag) {
    this.setState({ visible: flag });
  }

}
