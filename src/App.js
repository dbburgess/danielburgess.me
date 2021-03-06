import React, { Component } from 'react';
import { TransitionMotion } from 'react-motion';
import getStyleByKey from './getStyleByKey';
import updateAnimationStyles from './updateAnimationStyles';
import Menu from './Menu';
import './App.css';

class App extends Component {

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

  render() {
    return (
      <TransitionMotion defaultStyles={this.getDefaultStyles()} styles={updateAnimationStyles}>
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

            const summaryStyle = ((progress) => ({
              opacity: progress,
              transform: 'scaleX(' + progress + ')',
            }))(getStyleByKey(styles, 'summary').progress);

            return (
              <div className="app">
                <Menu animationStyles={ styles } />
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
