// getStyleByKey: Custom React Motion utility function.
// React Motion has a type called TransitionStyle, which contains transition
// information in the form of `{ key: string, data?: any, style: Style}`.
// This helper method allows us to extract a style by key, from an array of TransitionStyle.
function getStyleByKey(styles, key) {
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

export default getStyleByKey;
