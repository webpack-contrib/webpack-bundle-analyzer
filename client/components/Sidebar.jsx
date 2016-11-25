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
    const { visible } = this.state;

    const className = cls({
      [s.container]: true,
      [s.left]: (position === 'left'),
      [s.hidden]: !visible
    });

    return (
      <div className={className}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}>
        {children}
      </div>
    );
  }

  handleMouseEnter = () => {
    clearTimeout(this.hideTimeoutId);
    this.toggleVisibility(true);
  };

  handleMouseLeave = () => this.toggleVisibility(false);

  toggleVisibility(flag) {
    this.setState({ visible: flag });
  }

}
