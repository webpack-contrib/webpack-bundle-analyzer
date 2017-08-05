/** @jsx h */
import { h, Component } from 'preact';
import cls from 'classnames';

import s from './Sidebar.css';

export default class Sidebar extends Component {

  static defaultProps = {
    className: '',
    showOnMount: false,
    forceVisible: false,
    position: 'left'
  };

  constructor(props, context) {
    super(props, context);

    const visible = props.forceVisible || props.showOnMount;

    this.state = {
      visible,
      renderContent: visible
    };
  }

  componentDidMount() {
    if (this.props.showOnMount && !this.props.forceVisible) {
      this.hideTimeoutId = setTimeout(() => this.toggleVisibility(false), 1500);
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.forceVisible && !this.state.visible) {
      this.toggleVisibility(true);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.hideTimeoutId);
    clearTimeout(this.hideContentTimeout);
  }

  render() {
    const { position, children } = this.props;
    const { visible, renderContent } = this.state;

    const className = cls(this.props.className, {
      [s.container]: true,
      [s[position]]: true,
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
    if (this.props.forceVisible || !this.hasContent) {
      return;
    }

    clearTimeout(this.hideTimeoutId);
    this.toggleVisibility(true);
  };

  handleMouseLeave = () => {
    if (!this.props.forceVisible) {
      this.toggleVisibility(false);
    }
  }

  toggleVisibility(flag) {
    if (this.state.visible === flag) {
      return;
    }

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

  get hasContent() {
    const { children } = this.props;
    return children && children.length && children.some(Boolean);
  }

}
