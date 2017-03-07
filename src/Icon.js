import React, { Component } from 'react';

class Icon extends Component {

  render() {
    const style = {
      right: (-100 * (1 - this.props.progress)) + '%',
      opacity: this.props.progress,
    };

    return (
      <li key={ this.props.className } style={ style }>
        <a href={ this.props.href } target="_blank" aria-label={ this.props.label }>
          <i className={ "fa fa-lg " + this.props.className } aria-hidden="true"></i>
          <span>{ this.props.label }</span>
        </a>
      </li>
    );
  }
}

export default Icon;
