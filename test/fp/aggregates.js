import {describe, it} from 'mocha';
import assert from 'assert';
import * as aggregates from '../../src/fp/aggregates';
import suites from '../suites/aggregates';
import {runTestCase, createSuitesHelpers, toArray} from './utils';

const { getTestCaseWithArgsLength, runAllTestCases } = createSuitesHelpers(suites);

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
});
