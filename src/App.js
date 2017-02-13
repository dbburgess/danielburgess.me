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
    return [
      {
        key: 'mainTitle',
        style: { progress: 0 },
      },
      {
        key: 'subTitle',
        style: { progress: 0 },
        data: { precededBy: 'mainTitle' },
      },
    ];
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

  render() {
    return (
      <TransitionMotion defaultStyles={this.getDefaultStyles()} styles={this.getStyles}>
        {styles => {
          // Retrieve all of the custom styles by their key.
          const mainStyle = this.getStyleByKey(styles, 'mainTitle');
          const subStyle = this.getStyleByKey(styles, 'subTitle');

          return <div className="app">
            <h1 className="mainTitle" style={{
              opacity: mainStyle.progress,
              transform: 'scale(' + mainStyle.progress + ')',
            }}>Daniel Burgess</h1>
            <h3 className="subTitle" style={{
              opacity: subStyle.progress,
              top: (25 * (subStyle.progress - 1)) + 'px',
            }}>Software Engineer</h3>
          </div>
          }
        }
      </TransitionMotion>
    );
  }
}

export default App;
