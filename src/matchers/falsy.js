'use strict';

module.exports = (val) => {
  if (!val) return true;

  throw new Error(`The value is truthy.\nValue: ${val}`);
};
