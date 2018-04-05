'use strict';

const deepEqual = require('deep-equal');

module.exports = (a, b) => {
  if (deepEqual(a, b)) return true;

  throw new Error(`The values are not deeply identical.\n\nFound: ${
    JSON.stringify(a, null, 4)}\nWanted: ${JSON.stringify(b, null, 4)}`);
};
