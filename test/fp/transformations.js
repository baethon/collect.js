import {describe, it} from 'mocha';
import assert from 'assert';
import * as transformations from '../../src/fp/transformations';
import suites from '../suites/transformations';
import {runTestCase, createSuitesHelpers, toArray} from './utils';

const { getTestCaseWithArgsLength, runAllTestCases } = createSuitesHelpers(suites);

describe('transformation functions', () => {
  runAllTestCases('collapse', suite => {
    const items = suite.collection.getAll();
    const actual = transformations.collapse(items);
    assert.deepEqual(actual, suite.expected);
  });

  runAllTestCases('combine', suite => {
    const keys = suite.collection.getAll();
    const values = toArray(suite.args[0]);
    const combiner = transformations.combine(keys);
    assert.deepEqual(combiner(values), suite.expected);
  });

  runTestCase('pluck', getTestCaseWithArgsLength('pluck', 1), suite => {
    const items = suite.collection.getAll();
    const [valueKeyName] = suite.args;
    const pluckBy = transformations.pluck(valueKeyName);

    assert.deepEqual(pluckBy(items), suite.expected);
  });

  runTestCase('pluckAndCombine', getTestCaseWithArgsLength('pluck', 2), suite => {
    const items = suite.collection.getAll();
    const [valuesKeyName, keysKeyName] = suite.args;
    const pluckBy = transformations.pluckAndCombine(valuesKeyName, keysKeyName);

    assert.deepEqual(pluckBy(items), suite.expected);
  });

  runAllTestCases('except', suite => {
    const items = suite.collection.getAll();
    const [exceptKeys] = suite.args;
    const except = transformations.except(exceptKeys);

    assert.deepEqual(except(items), suite.expected);
  });

  runAllTestCases('flatMap', suite => {
    const items = suite.collection.getAll();
    const [reducerFn] = suite.args;
    const mapper = transformations.flatMap(reducerFn);

    assert.deepEqual(mapper(items), suite.expected);
  });

  runAllTestCases('groupBy', suite => {
    const items = suite.collection.getAll();
    const [groupByKey] = suite.args;
    const reducer = transformations.groupBy(groupByKey);

    assert.deepEqual(reducer(items), suite.expected);
  });

  runTestCase('implode', getTestCaseWithArgsLength('implode', 1), suite => {
    const items = suite.collection.getAll();
    const [glue] = suite.args;
    const reducer = transformations.implode(glue);

    assert.deepEqual(reducer(items), suite.expected);
  })

  runTestCase('implodeByKey', getTestCaseWithArgsLength('implode', 2), suite => {
    const items = suite.collection.getAll();
    const [key, glue] = suite.args;
    const reducer = transformations.implodeByKey(key, glue);

    assert.deepEqual(reducer(items), suite.expected);
  });

  runAllTestCases('keyBy', suite => {
    const items = suite.collection.getAll();
    const [key] = suite.args;
    const reducer = transformations.keyBy(key);

    assert.deepEqual(reducer(items), suite.expected);
  });

  runAllTestCases('prepend', suite => {
    const items = suite.collection.getAll();
    const [value] = suite.args;
    const prepend = transformations.prepend(value);

    assert.deepEqual(prepend(items), suite.expected);
  });

  runAllTestCases('sort', suite => {
    const items = suite.collection.getAll();
    const comparator = suite.args && suite.args[0];
    const sort = transformations.sort(comparator);

    assert.deepEqual(sort(items), suite.expected);
  });

  runAllTestCases('sortBy', suite => {
    const items = suite.collection.getAll();
    const [key] = suite.args;
    const sort = transformations.sortBy(key);

    assert.deepEqual(sort(items), suite.expected);
  });

  runAllTestCases('reverse', suite => {
    const items = suite.collection.getAll();

    assert.deepEqual(transformations.reverse(items), suite.expected);
  });

  runTestCase('unique', getTestCaseWithArgsLength('unique', 0), suite => {
    const items = suite.collection.getAll();
    const unique = transformations.unique;

    assert.deepEqual(unique(items), suite.expected);
  });

  runTestCase('uniqueByKey', getTestCaseWithArgsLength('unique', 1), suite => {
    const items = suite.collection.getAll();
    const [key] = suite.args;
    const unique = transformations.uniqueByKey(key);

    assert.deepEqual(unique(items), suite.expected);
  });

  runAllTestCases('where', suite => {
    const items = suite.collection.getAll();
    const [key, value] = suite.args;
    const where = transformations.where(key, value);

    assert.deepEqual(where(items), suite.expected);
  });

  runAllTestCases('whereIn', suite => {
    const items = suite.collection.getAll();
    const [key, values] = suite.args;
    const where = transformations.whereIn(key, values);

    assert.deepEqual(where(items), suite.expected);
  });

  runAllTestCases('zip', suite => {
    const items = suite.collection.getAll();
    const [zipWith] = suite.args;
    const zip = transformations.zip(toArray(zipWith));

    assert.deepEqual(zip(items), suite.expected);
  });
});
