'use strict';

module.exports = (a, b) => {
  // eslint-disable-next-line
  if (a == b) return true;

  throw new Error(`The values are not identical.\n\nFound: ${a}\nWanted: ${b}`);
};
