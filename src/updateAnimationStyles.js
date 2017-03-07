import { spring } from 'react-motion';
import getStyleByKey from './getStyleByKey';

// updateAnimationStyles: Custom React Motion utility function.
// Given a previous set of animation styles, returns an updated set of styles.
// React Motion calls this "staggering motion" and by using this method,
// you can customize how your animations are staggered.
function updateAnimationStyles(prevStyles) {
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

export default updateAnimationStyles;
