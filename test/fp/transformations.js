import {describe, it} from 'mocha';
import assert from 'assert';
import * as R from 'ramda';
import * as transformations from '../../src/fp/transformations';
import suites from '../suites/transformations';

const argsLength = length => R.pipe(
  R.prop('args'),
  R.length,
  R.equals(length)
);

const suiteWithArgsLength = (name, length) =>
  suites[name].filter(argsLength(length));

const testSuite = R.curry((name, callback) => {
  const testCases = suites[name];
  runTestSuite(name, testCases, callback);
});

const runTestSuite = R.curry((name, testCases, callback) => {
  describe(`${name} test suite`, () => {
    testCases.forEach((item, index) => {
      it(`test suite #${index + 1}`, () => callback(item));
    });
  });
});

const toArray = items => items.getAll ? items.getAll() : items;

describe('transformation functions', () => {
  testSuite('collapse')(suite => {
    const items = suite.collection.getAll();
    const actual = transformations.collapse(items);
    assert.deepEqual(actual, suite.expected);
  });

  testSuite('combine')(suite => {
    const keys = suite.collection.getAll();
    const values = toArray(suite.args[0]);
    const combiner = transformations.combine(keys);
    assert.deepEqual(combiner(values), suite.expected);
  });

  runTestSuite('pluck', suiteWithArgsLength('pluck', 1))(suite => {
    const items = suite.collection.getAll();
    const [valueKeyName] = suite.args;
    const pluckBy = transformations.pluck(valueKeyName);

    assert.deepEqual(pluckBy(items), suite.expected);
  });

  runTestSuite('pluckAndCombine', suiteWithArgsLength('pluck', 2))(suite => {
    const items = suite.collection.getAll();
    const [valuesKeyName, keysKeyName] = suite.args;
    const pluckBy = transformations.pluckAndCombine(valuesKeyName, keysKeyName);

    assert.deepEqual(pluckBy(items), suite.expected);
  });

  testSuite('except')(suite => {
    const items = suite.collection.getAll();
    const [exceptKeys] = suite.args;
    const except = transformations.except(exceptKeys);

    assert.deepEqual(except(items), suite.expected);
  });

  testSuite('flatMap')(suite => {
    const items = suite.collection.getAll();
    const [reducerFn] = suite.args;
    const mapper = transformations.flatMap(reducerFn);

    assert.deepEqual(mapper(items), suite.expected);
  });

  testSuite('groupBy')(suite => {
    const items = suite.collection.getAll();
    const [groupByKey] = suite.args;
    const reducer = transformations.groupBy(groupByKey);

    assert.deepEqual(reducer(items), suite.expected);
  });

  runTestSuite('implode', suiteWithArgsLength('implode', 1))(suite => {
    const items = suite.collection.getAll();
    const [glue] = suite.args;
    const reducer = transformations.implode(glue);

    assert.deepEqual(reducer(items), suite.expected);
  })

  runTestSuite('implodeByKey', suiteWithArgsLength('implode', 2))(suite => {
    const items = suite.collection.getAll();
    const [key, glue] = suite.args;
    const reducer = transformations.implodeByKey(key, glue);

    assert.deepEqual(reducer(items), suite.expected);
  });

  testSuite('keyBy')(suite => {
    const items = suite.collection.getAll();
    const [key] = suite.args;
    const reducer = transformations.keyBy(key);

    assert.deepEqual(reducer(items), suite.expected);
  });

  testSuite('prepend')(suite => {
    const items = suite.collection.getAll();
    const [value] = suite.args;
    const prepend = transformations.prepend(value);

    assert.deepEqual(prepend(items), suite.expected);
  });

  testSuite('sort')(suite => {
    const items = suite.collection.getAll();
    const comparator = suite.args && suite.args[0];
    const sort = transformations.sort(comparator);

    assert.deepEqual(sort(items), suite.expected);
  });

  testSuite('sortBy')(suite => {
    const items = suite.collection.getAll();
    const [key] = suite.args;
    const sort = transformations.sortBy(key);

    assert.deepEqual(sort(items), suite.expected);
  });

  testSuite('reverse')(suite => {
    const items = suite.collection.getAll();

    assert.deepEqual(transformations.reverse(items), suite.expected);
  });

  runTestSuite('unique', suiteWithArgsLength('unique', 0))(suite => {
    const items = suite.collection.getAll();
    const unique = transformations.unique;

    assert.deepEqual(unique(items), suite.expected);
  });

  runTestSuite('uniqueByKey', suiteWithArgsLength('unique', 1))(suite => {
    const items = suite.collection.getAll();
    const [key] = suite.args;
    const unique = transformations.uniqueByKey(key);

    assert.deepEqual(unique(items), suite.expected);
  });

  testSuite('where')(suite => {
    const items = suite.collection.getAll();
    const [key, value] = suite.args;
    const where = transformations.where(key, value);

    assert.deepEqual(where(items), suite.expected);
  });

  testSuite('whereIn')(suite => {
    const items = suite.collection.getAll();
    const [key, values] = suite.args;
    const where = transformations.whereIn(key, values);

    assert.deepEqual(where(items), suite.expected);
  });

  testSuite('zip')(suite => {
    const items = suite.collection.getAll();
    const [zipWith] = suite.args;
    const zip = transformations.zip(toArray(zipWith));

    assert.deepEqual(zip(items), suite.expected);
  });
});
