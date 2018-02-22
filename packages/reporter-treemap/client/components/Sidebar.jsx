/** @jsx h */
import { h, Component } from 'preact';
import cls from 'classnames';

import s from './Sidebar.css';

export default class Sidebar extends Component {

  static defaultProps = {
    position: 'left'
  };

  state = {
    visible: true,
    renderContent: true
  };

  componentDidMount() {
    this.hideTimeoutId = setTimeout(() => this.toggleVisibility(false), 1500);
    this.hideContentTimeout = null;
  }

  componentWillUnmount() {
    clearTimeout(this.hideTimeoutId);
    clearTimeout(this.hideContentTimeout);
  }

  render() {
    const { position, children } = this.props;
    const { visible, renderContent } = this.state;

    const className = cls({
      [s.container]: true,
      [s.left]: (position === 'left'),
      [s.hidden]: !visible
    });

    return (
      <div className={className}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}>
        {renderContent ? children : null}
      </div>
    );
  }

  handleMouseEnter = () => {
    clearTimeout(this.hideTimeoutId);
    this.toggleVisibility(true);
  };

  handleMouseLeave = () => this.toggleVisibility(false);

  toggleVisibility(flag) {
    clearTimeout(this.hideContentTimeout);

    this.setState({ visible: flag });

    if (flag) {
      this.setState({ renderContent: true });
    } else {
      // Waiting for the CSS animation to finish and hiding content
      this.hideContentTimeout = setTimeout(
        () => this.setState({ renderContent: false }),
        500
      );
    }
  }

}
