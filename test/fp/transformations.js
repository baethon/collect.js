import {describe, it} from 'mocha';
import assert from 'assert';
import * as transformations from '../../src/fp/transformations';
import suites from '../suites/transformations';

const runTestSuite = name => callback => {
  describe(`${name} test suite`, () => {
    suites[name].forEach((item, index) => {
      it(`test suite #${index + 1}`, () => callback(item));
    });
  });
};

const toArray = items => items.getAll ? items.getAll() : items;

describe('transformation functions', () => {
  runTestSuite('collapse')(suite => {
    const items = suite.collection.getAll();
    const actual = transformations.collapse(items);
    assert.deepEqual(actual, suite.expected);
  });

  runTestSuite('combine')(suite => {
    const keys = suite.collection.getAll();
    const values = toArray(suite.args[0]);
    const combiner = transformations.combine(keys);
    assert.deepEqual(combiner(values), suite.expected);
  });

  runTestSuite('pluck')(suite => {
    const items = suite.collection.getAll();
    const pluckBy = transformations.pluck(...suite.args);

    assert.deepEqual(pluckBy(items), suite.expected);
  });

  runTestSuite('except')(suite => {
    const items = suite.collection.getAll();
    const [exceptKeys] = suite.args;
    const except = transformations.except(exceptKeys);

    assert.deepEqual(except(items), suite.expected);
  });

  runTestSuite('flatMap')(suite => {
    const items = suite.collection.getAll();
    const [reducerFn] = suite.args;
    const mapper = transformations.flatMap(reducerFn);

    assert.deepEqual(mapper(items), suite.expected);
  });

  runTestSuite('groupBy')(suite => {
    const items = suite.collection.getAll();
    const [groupByKey] = suite.args;
    const reducer = transformations.groupBy(groupByKey);

    assert.deepEqual(reducer(items), suite.expected);
  });

  runTestSuite('implode')(suite => {
    const items = suite.collection.getAll();
    const reducer = transformations.implode(...suite.args);

    assert.deepEqual(reducer(items), suite.expected);
  });

  runTestSuite('keyBy')(suite => {
    const items = suite.collection.getAll();
    const [key] = suite.args;
    const reducer = transformations.keyBy(key);

    assert.deepEqual(reducer(items), suite.expected);
  });

  runTestSuite('prepend')(suite => {
    const items = suite.collection.getAll();
    const [value] = suite.args;
    const prepend = transformations.prepend(value);

    assert.deepEqual(prepend(items), suite.expected);
  });

  runTestSuite('sort')(suite => {
    const items = suite.collection.getAll();
    const comparator = suite.args && suite.args[0];
    const sort = transformations.sort(comparator);

    assert.deepEqual(sort(items), suite.expected);
  });

  runTestSuite('sortBy')(suite => {
    const items = suite.collection.getAll();
    const [key] = suite.args;
    const sort = transformations.sortBy(key);

    assert.deepEqual(sort(items), suite.expected);
  });

  runTestSuite('reverse')(suite => {
    const items = suite.collection.getAll();

    assert.deepEqual(transformations.reverse(items), suite.expected);
  });

  runTestSuite('unique')(suite => {
    const items = suite.collection.getAll();
    const args = suite.args || [];
    const unique = transformations.unique(...args);

    assert.deepEqual(unique(items), suite.expected);
  });
});
