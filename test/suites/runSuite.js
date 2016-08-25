const {describe, it} = require('mocha');
const assert = require('assert');
const {Collection} = require('../../lib');

const isObject = value => Object.prototype.toString.call(value) === '[object Object]';

function runTestCase(methodName, {collection, args = [], expected}, index) {
  it(`test case #${index + 1}: ${JSON.stringify(args)}`, () => {
    const result = collection[methodName](...args);

    assert.notStrictEqual(result, collection);

    if (Array.isArray(expected) || isObject(expected)) {
      assert.ok(result instanceof Collection, 'Result should be an instance of Collection');
      assert.deepEqual(result.getAll(), expected);
      assert.notDeepEqual(result.getAll(), collection.getAll());
    } else {
      assert.equal(result, expected);
    }
  });
}

module.exports = {
  runSuite: function(testCases) {
    Object.keys(testCases).forEach(name => {
      const testData = testCases[name];

      describe(`${name}()`, () => {
        testData.forEach((testCase, index) => runTestCase(name, testCase, index));
      });
    });
  }
}
