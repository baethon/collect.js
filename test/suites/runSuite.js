import {describe, it} from 'mocha';
import assert from 'assert';
import {Collection} from '../../lib';

const isObject = value => Object.prototype.toString.call(value) === '[object Object]';

function runTestCase(methodName, {collection, args = [], expected}, index) {
  it(`test case #${index + 1}: ${JSON.stringify(args)}`, () => {
    const result = collection[methodName](...args);

    assert.notStrictEqual(result, collection);
    
    if (Array.isArray(expected) || isObject(expected)) {
      assert.ok(result instanceof Collection);
      assert.deepEqual(result.getAll(), expected);
      assert.notDeepEqual(result.getAll(), collection.getAll());
    } else {
      assert.equal(result, expected);
    }
  });
}

export function runSuite(testCases) {
  Object.keys(testCases).forEach(name => {
    const testData = testCases[name];

    describe(`${name}()`, () => {
      testData.forEach((testCase, index) => runTestCase(name, testCase, index));
    });
  });
}
