import {describe, it} from 'mocha';
import * as R from 'ramda';

const getTestCaseWithArgsLength = R.curry(
  (suites, name, length) => suites[name].filter(argsLength(length))
);

const runAllTestCases = R.curry((suites, name, callback) => {
  const testCases = suites[name];
  runTestCase(name, testCases, callback);
});

export const argsLength = length => R.pipe(
  R.prop('args'),
  R.length,
  R.equals(length)
);

export const runTestCase = (name, testCases, callback) => {
  describe(`${name}`, () => {
    testCases.forEach((item, index) => {
      it(`test case #${index + 1}`, () => callback(item));
    });
  });
};

export const createSuitesHelpers = suites => ({
  getTestCaseWithArgsLength: getTestCaseWithArgsLength(suites),
  runAllTestCases: runAllTestCases(suites),
});

export const toArray = items => items.getAll ? items.getAll() : items;
