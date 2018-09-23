import React from 'react';

import Button from './Button';

export default class SwitcherItem extends React.PureComponent {
  render({item, ...props}) {
    return (
      <Button {...props} onClick={this.handleClick}>
        {item.label}
      </Button>
    );
  }

  handleClick = () => {
    this.props.onClick(this.props.item);
  }
}
