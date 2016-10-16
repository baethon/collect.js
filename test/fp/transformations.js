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
});
