'use strict';

const colors = require('colors');
const matchers = require('./matchers');
const tyrion = {
  SILENT: false
};

// Repeats a string n times
const repeat = (str, n) => Array(n).join(str);

// Repeats an indent (of four spaces) n times
const indent = n => repeat('    ', n);

// Indents a string with multiple lines
const indentLines = (str, n) => indent(n) + str.replace(/\n/g, `\n${indent(n)}`);

// Runs every beforeEach callback in the stack
const runEveryBeforeEach = () => {
  beforeEachStack.forEach((level) => level.forEach(cb => cb()));
};

// Logs a string to the console
const log = (str) => !tyrion.SILENT && console.log(str);

// Keeps some counters used to print the summary after the execution of a test suite is completed
const summary = { success: 0, fail: 0, disabled: 0 };

// The stack of beforeEach callbacks
const beforeEachStack = [ [] ];
let indentLevel = 0;

// Declares a testing group
const group = (title, cb) => {
  beforeEachStack.push([]);
  indentLevel++;
  log(`\n${indent(indentLevel)}⇨ ${title}`.yellow);
  cb();
  indentLevel--;
  beforeEachStack.pop();
};

// Declares a test unit
const check = (title, cb) => {
  runEveryBeforeEach();

  try{
    cb();
    log(`${indent(indentLevel + 1)}${' OK '.bgGreen.black} ${title.green}`);
    summary.success++;
  } catch(e) {
    log(`${indent(indentLevel + 1)}${' FAIL '.bgRed.black} ${title.red}`);
    log(indentLines(e.stack.red, indentLevel + 2));
    summary.fail++;
  }
};

// Disables a test unit
const xcheck = (title, cb) => {
  log(`${indent(indentLevel + 1)}${' DISABLED '.bgWhite.black} ${title.gray}`);
  summary.disabled++;
};

// The assertion function
const guarantee = (val) => {
  if (val) return true;

  throw new Error('Assertion failed.');
};

// Injects all matchers as properties of our assertion function
Object.assign(guarantee, matchers);

// Prints the test summary and finishes the process with the appropriate exit code
const end = () => {
  log(`\n${repeat('.', 60)}\n`);
  log('Test summary:\n');
  log(`  Success: ${summary.success}`.green);
  log(`  Fail: ${summary.fail}`.red);
  log(`  Disabled: ${summary.disabled}\n\n`.gray);

  if (summary.fail > 0) process.exit(1);
  process.exit(0);
};

// A dead simple (and not human-proof) implementation of the beforeAll function
const beforeAll = cb => cb();

// A simple and functional beforeEach implementation
const beforeEach = (cb) => {
  beforeEachStack[beforeEachStack.length - 1].push(cb);
};

// Exports Tyrion's DSL
const dsl = { guarantee, check, xcheck, end, group, beforeEach, beforeAll };
module.exports = Object.assign(tyrion, dsl);
