import {describe, it} from 'mocha';
import assert from 'assert';
import * as R from 'ramda';
import * as core from '../../src/fp/core';
import suites from '../suites/core';
import {runTestCase, createSuitesHelpers, toArray} from './utils';

const { getTestCaseWithArgsLength, runAllTestCases } = createSuitesHelpers(suites);

describe('core functions', () => {
  runAllTestCases('merge', suite => {
    const items = suite.collection.getAll();
    const mergeItems = toArray(suite.args[0]);
    const mergeWith = core.merge(items);

    assert.deepEqual(mergeWith(mergeItems), suite.expected);
  });
});
