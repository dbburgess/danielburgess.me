import React, { Component } from 'react';
import { TransitionMotion, spring } from 'react-motion';

import getStyleByKey from './getStyleByKey';

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    // Bind this to the methods that need it.
    this.getStyles = this.getStyles.bind(this);
  }

  // Default styles are essentially just the initial state for React Motion.
  // In most of the React Motion examples, they define this in terms of what
  // is being animated (e.g. x position). However, their examples also tend
  // to be very simple, animating the same thing for all elements. Ours will
  // be a little bit more complex. To simplify things, I'm just going to define
  // it in terms of animation progress. This allows us to centralize exactly
  // what properties are animated in one place, the render method, rather than
  // three places it would be otherwise (render, here, and the styles function).
  // Another hack we're implementing allows us to use a cascading sort of effect
  // for animating various elements, by including what element should precede
  // a definition, we can easily only start animating certain elements once the
  // others have reached a certain level of completion.
  getDefaultStyles() {
    const styles = [
      {
        key: 'mainTitle',
        style: { progress: 0 },
      },
      {
        key: 'subTitle',
        style: { progress: 0 },
        data: { precededBy: 'mainTitle' },
      },
      {
        key: 'divider',
        style: { progress: 0 },
        data: { precededBy: 'subTitle' },
      },
      {
        key: 'summary',
        style: { progress: 0 },
        data: { precededBy: 'divider', triggeredAt: 0.55 },
      },
    ];

    // Setup the icon styles using a loop, since they're all super similar.
    for (var i = 1; i <= 7; i++) {
      styles.push({
        key: 'icon' + i,
        style: { progress: 0 },
        data: { precededBy: 'divider', triggeredAt: (0.14 * i - 0.05) },
      });
    }

    return styles;
  }

  // Given a previous set of styles, returns an updated set of styles.
  // React Motion calls this "staggering motion" and by using this method,
  // you can customize how your animations are staggered.
  getStyles(prevStyles) {
    // Iterate over all of the previous styles, allowing us to
    // return a new set of styles with whatever changes we'd like.
    return prevStyles.map((style, i) => {
      // We use the preceding style's progress to determine what to do
      // with this current style, so we'll need to retrieve that. In
      // the event there is no preceding style, we'll use 100% as the
      // progress, as that just means the current style may be applied,
      // which should be the case if there was no style to precede it.
      const precedingProgress = (
        style.data && style.data.precededBy
          ? getStyleByKey(prevStyles, style.data.precededBy).progress
          : 1.0
      );

      // This allows us to customize when in a staggered animation the next
      // animation should be triggered. Just add a `triggeredAt` property
      // to the data object of the next object. The default value if this
      // isn't provided is 95%.
      const triggerProgress = (
        style.data && style.data.triggeredAt
          ? style.data.triggeredAt
          : 0.95
      );

      // Return a new style object with all of the important data copied.
      // In the event the preceding style's progress is complete (or nearly so),
      // we'll go ahead and start the spring to move our progress to 100%.
      // Otherwise, we'll just use whatever the current progress value is (likely 0).
      return {
        key: style.key,
        data: style.data,
        style: {
          progress: (
            precedingProgress >= triggerProgress
              ? spring(1.0)
              : style.style.progress
          )
        }
      };
    });
  }

  renderIcon(icon) {
    const style = {
      right: (-100 * (1 - icon.progress)) + '%',
      opacity: icon.progress,
    };

    return (
      <li key={ icon.className } style={ style }>
        <a href={ icon.href } target="_blank" aria-label={ icon.label }>
          <i className={ "fa fa-lg " + icon.className } aria-hidden="true"></i>
          <span>{ icon.label }</span>
        </a>
      </li>
    );
  }

  render() {
    return (
      <TransitionMotion defaultStyles={this.getDefaultStyles()} styles={this.getStyles}>
        {
          styles => {
            // Setup all of the elements animation styles by their key and current progress.
            const mainStyle = ((progress) => ({
              opacity: progress,
              transform: 'scale(' + progress + ')',
            }))(getStyleByKey(styles, 'mainTitle').progress);

            const subStyle = ((progress) => ({
              opacity: progress,
              top: (-1.5 * (1 - progress)) + 'em',
            }))(getStyleByKey(styles, 'subTitle').progress);

            const dividerStyle = ((progress) => ({
              height: (100 * progress) + '%'
            }))(getStyleByKey(styles, 'divider').progress);

            const summaryStyle = ((progress) => ({
              opacity: progress,
              transform: 'scaleX(' + progress + ')',
            }))(getStyleByKey(styles, 'summary').progress);

            // Aggregate the icon metadata and styles, since their markup is all
            // the same, we can just easily iterate over this to output everything.
            const icons = [
              { progress: getStyleByKey(styles, 'icon1').progress, className: 'fa-envelope-o', href: 'mailto:chat@danielburgess.me', label: 'Email' },
              { progress: getStyleByKey(styles, 'icon2').progress, className: 'fa-github', href: 'https://github.com/dbburgess', label: 'Github' },
              { progress: getStyleByKey(styles, 'icon3').progress, className: 'fa-stack-overflow', href: 'https://stackoverflow.com/users/5191100/dbburgess', label: 'Stack Overflow' },
              { progress: getStyleByKey(styles, 'icon4').progress, className: 'fa-linkedin', href: 'https://linkedin.com/in/dbburgess', label: 'LinkedIn' },
              { progress: getStyleByKey(styles, 'icon5').progress, className: 'fa-twitter', href: 'https://twitter.com/dbburgess', label: 'Twitter' },
              { progress: getStyleByKey(styles, 'icon6').progress, className: 'fa-facebook-official', href: 'https://facebook.com/dbburgess', label: 'Facebook' },
              { progress: getStyleByKey(styles, 'icon7').progress, className: 'fa-file-text-o', href: 'https://dbburgess.github.io/resume', label: 'Résumé' },
            ];

            return (
              <div className="app">
                <ul className="social" style={ dividerStyle }>
                  {
                    // Render all of the social icons.
                    icons.map(this.renderIcon)
                  }
                </ul>
                <h1 className="mainTitle" style={ mainStyle }>Daniel Burgess</h1>
                <h3 className="subTitle" style={ subStyle }>Software Engineer</h3>
                <p className="summary" style={ summaryStyle }>
                  Daniel is a full stack software engineer with a broad set of skills and experience in numerous languages, platforms, and frameworks. Whether it is mobile, backend, or web, Daniel's experience allows him to rapidly learn new tech and gain a working understanding of complex systems quickly. With an entrepreneurial background, he has a rare understanding of how to balance a meticulous approach to technical design and implementation with practical business needs.
                </p>
              </div>
            );
          }
        }
      </TransitionMotion>
    );
  }
}

export default App;
