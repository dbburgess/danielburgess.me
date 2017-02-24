import React, { Component } from 'react';
import { TransitionMotion, spring } from 'react-motion';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    // Bind this to the methods that need it.
    this.getStyles = this.getStyles.bind(this);
  }

  // React Motion has a type called TransitionStyle, which contains transition
  // information in the form of `{ key: string, data?: any, style: Style}`.
  // This helper method allows us to extract a style by key, from an array of TransitionStyle.
  getStyleByKey(styles, key) {
    // Find the TransitionStyle that contains the provided key.
    const config = styles.find((style) => {
      return style.key === key;
    });

    // Return the style from the TransitionStyle object.
    // In the event a TransitionStyle was not found, we'll
    // catch that and just return an empty object.
    return (
      config && config.style
        ? config.style
        : {}
    );
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
    for (var i = 1; i <= 5; i++) {
      styles.push({
        key: 'icon' + i,
        style: { progress: 0 },
        data: { precededBy: 'divider', triggeredAt: (0.20 * i - 0.05) },
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
          ? this.getStyleByKey(prevStyles, style.data.precededBy).progress
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
            }))(this.getStyleByKey(styles, 'mainTitle').progress);

            const subStyle = ((progress) => ({
              opacity: progress,
              top: (-1.5 * (1 - progress)) + 'em',
            }))(this.getStyleByKey(styles, 'subTitle').progress);

            const dividerStyle = ((progress) => ({
              height: (100 * progress) + '%'
            }))(this.getStyleByKey(styles, 'divider').progress);

            const summaryStyle = ((progress) => ({
              opacity: progress,
              transform: 'scaleX(' + progress + ')',
            }))(this.getStyleByKey(styles, 'summary').progress);

            // Aggregate the icon metadata and styles, since their markup is all
            // the same, we can just easily iterate over this to output everything.
            const icons = [
              { progress: this.getStyleByKey(styles, 'icon1').progress, className: 'fa-github', href: 'https://github.com/dbburgess', label: 'Github' },
              { progress: this.getStyleByKey(styles, 'icon2').progress, className: 'fa-stack-overflow', href: 'https://stackoverflow.com/users/5191100/dbburgess', label: 'Stack Overflow' },
              { progress: this.getStyleByKey(styles, 'icon3').progress, className: 'fa-linkedin', href: 'https://linkedin.com/in/dbburgess', label: 'LinkedIn' },
              { progress: this.getStyleByKey(styles, 'icon4').progress, className: 'fa-twitter', href: 'https://twitter.com/dbburgess', label: 'Twitter' },
              { progress: this.getStyleByKey(styles, 'icon5').progress, className: 'fa-facebook', href: 'https://facebook.com/dbburgess', label: 'Facebook' },
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
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pharetra quam a ullamcorper luctus. Mauris suscipit mauris vitae sodales porta. In vel aliquet lorem, non blandit nisl. Mauris in ornare diam. Vivamus nec nisi sed turpis accumsan tincidunt. Proin sodales justo id elementum ultricies.
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
