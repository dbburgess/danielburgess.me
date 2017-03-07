import React, { Component } from 'react';
import getStyleByKey from './getStyleByKey';
import Icon from './Icon';

class Menu extends Component {

  render() {
    const styles = this.props.animationStyles;
    const dividerStyle = ((progress) => ({
      height: (100 * progress) + '%'
    }))(getStyleByKey(styles, 'divider').progress);

    return (
      <ul className="social" style={ dividerStyle }>
        <Icon
          className="fa-envelope-o"
          href="mailto:chat@danielburgess.me"
          label="Email"
          progress={ getStyleByKey(styles, 'icon1').progress }
        />
        <Icon
          className="fa-github"
          href="https://github.com/dbburgess"
          label="Github"
          progress={ getStyleByKey(styles, 'icon2').progress }
        />
        <Icon
          className="fa-stack-overflow"
          href="https://stackoverflow.com/users/5191100/dbburgess"
          label="Stack Overflow"
          progress={ getStyleByKey(styles, 'icon3').progress }
        />
        <Icon
          className="fa-linkedin"
          href="https://linkedin.com/in/dbburgess"
          label="LinkedIn"
          progress={ getStyleByKey(styles, 'icon4').progress }
        />
        <Icon
          className="fa-twitter"
          href="https://twitter.com/dbburgess"
          label="Twitter"
          progress={ getStyleByKey(styles, 'icon5').progress }
        />
        <Icon
          className="fa-facebook-official"
          href="https://facebook.com/dbburgess"
          label="Facebook"
          progress={ getStyleByKey(styles, 'icon6').progress }
        />
        <Icon
          className="fa-file-text-o"
          href="https://dbburgess.github.io/resume"
          label="Résumé"
          progress={ getStyleByKey(styles, 'icon7').progress }
        />
      </ul>
    );
  }
}

export default Menu;
