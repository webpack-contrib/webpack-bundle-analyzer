/** @jsx h */
import {h, Component} from 'preact';
import cls from 'classnames';
import s from './Button.css';

export default class Button extends Component {
  render({active, disabled, className, children, ...props}) {
    const classes = cls(className, {
      [s.container]: true,
      [s.active]: active
    });

    return (
      <button {...props}
        ref={this.saveRef}
        type="button"
        className={classes}
        disabled={active || disabled}
        onClick={this.handleClick}>
        {children}
      </button>
    );
  }

  handleClick = (event) => {
    this.elem.blur();
    this.props.onClick(event);
  }

  saveRef = elem => this.elem = elem;
}
