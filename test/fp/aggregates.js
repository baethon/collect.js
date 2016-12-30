import {describe, it} from 'mocha';
import assert from 'assert';
import * as R from 'ramda';
import * as aggregates from '../../src/fp/aggregates';
import suites from '../suites/aggregates';
import {runTestCase, createSuitesHelpers, toArray} from './utils';

const { getTestCaseWithArgsLength, runAllTestCases } = createSuitesHelpers(suites);

const isNot = R.complement(R.is);
const firstArgIsFunction = R.pipe(
  R.prop('args'),
  R.head,
  R.is(Function)
);

const isObject = R.both(R.is(Object), isNot(Array));
const collectionIsSimpleArray = R.pipe(
  toArray,
  R.both(
    R.compose(isNot(Object), R.head),
    R.is(Array)
  )
);

describe('aggregates functions', () => {
  runTestCase('avg', getTestCaseWithArgsLength('avg', 0), suite => {
    const items = suite.collection.getAll();
    assert.equal(aggregates.avg(items), suite.expected);
  });

  runTestCase('avgByKey', getTestCaseWithArgsLength('avg', 1), suite => {
    const items = suite.collection.getAll();
    const [key] = suite.args;
    const avgByKey = aggregates.avgByKey(key);

    assert.equal(avgByKey(items), suite.expected);
  });

  describe('contains', () => {
    const getContainsValueTestCases = R.pipe(
      () => getTestCaseWithArgsLength('contains', 1),
      R.filter(R.both(
        R.complement(firstArgIsFunction),
        R.compose(collectionIsSimpleArray, R.prop('collection'))
      ))
    );

    const getObjectContainsValueTestCases = R.pipe(
      () => getTestCaseWithArgsLength('contains', 1),
      R.filter(R.compose(isObject, toArray, R.prop('collection')))
    );

    const getAnyTestCases = R.pipe(
      () => getTestCaseWithArgsLength('contains', 1),
      R.filter(firstArgIsFunction)
    );

    runTestCase('containsValue', getContainsValueTestCases(), function (suite) {
      var [value] = suite.args;
      const items = toArray(suite.collection);
      const hasValue = aggregates.containsValue(value);

      assert.equal(suite.expected, hasValue(items));
    });

    runTestCase('objectContainsValue', getObjectContainsValueTestCases(), function (suite) {
      var [value] = suite.args;
      const items = toArray(suite.collection);
      const hasValue = aggregates.objectContainsValue(value);

      assert.equal(suite.expected, hasValue(items));
    });

    runTestCase('containsValueByKey', getTestCaseWithArgsLength('contains', 2), function (suite) {
      var [key, value] = suite.args;
      const items = toArray(suite.collection);
      const hasValue = aggregates.containsValueByKey(key, value);

      assert.equal(suite.expected, hasValue(items));
    });

    runTestCase('any', getAnyTestCases(), function (suite) {
      var [predicate] = suite.args;
      const items = toArray(suite.collection);
      const any = aggregates.any(predicate);

      assert.equal(suite.expected, any(items));
    });
  });

  runAllTestCases('count', suite => {
    const items = suite.collection.getAll();

    assert.equal(aggregates.count(items), suite.expected);
  });
});
