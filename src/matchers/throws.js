'use strict';

module.exports = (fn, errorMsg = '') => {
  const didNotThrowError = new Error('The supplied function didn\'t throw an error');
  try {
    fn();
    throw didNotThrowError;
  } catch (e) {
    if (e === didNotThrowError) throw didNotThrowError;
    if (!errorMsg || e.message === errorMsg) return true;

    throw new Error('The error message is different from the expected one.'
      + `\n\nFound: ${e.message}\nWanted: ${errorMsg}`);
  }
};
