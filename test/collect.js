import {describe, it} from 'mocha';
import assert from 'assert';
import {collect, Collection} from '../lib';

const assertCollectionItems = (collection, items) => {
  assert.deepEqual(collection.getAll(), items);
}

const assertArrayCallbacks = {
  passing(method) {
    it('passes index and array to callback', () => {
      collect(['foo'])[method]((item, index, array) => {
        assert.equal(index, 0);
        assert.deepEqual(array, ['foo']);
      })
    });
  },

  preventFromModifying(method) {
    it('prevents from modifying collection items', () => {
      const collection = collect(['foo']);
      collection[method]((item, index, array) => {
        array.push('bar');
      });

      assertCollectionItems(collection, ['foo']);
    });
  }
}

describe('collect test suite', () => {
  it('returns collection instance', () => {
    const items = ['foo', 'bar'];
    const collection = collect(items);

    assert.ok(collection instanceof Collection);
    assertCollectionItems(collection, items);
    assert.notStrictEqual(collection.getAll(), items);
  });

  it('allows to set arrays only', () => {
    assert.throws(() => collect(null), Error);
  });

  it('returns copy of items', () => {
    const collection = collect(['foo']);

    assert.notStrictEqual(collection.getAll(), collection._items);
  });

  it('can be created from other collection', () => {
    const collection = collect(['foo']);
    const newColleciton = collect(collection);

    assert.notStrictEqual(collection.items, newColleciton.items);
    assertCollectionItems(newColleciton, collection.getAll());
  });

  it('merges other arrays', () => {
    const collection = collect([]);
    const mergedCollection = collection.merge(['foo']);

    assert.ok(mergedCollection instanceof Collection);
    assert.notStrictEqual(mergedCollection, collection);
    assertCollectionItems(mergedCollection, ['foo']);
  });

  it('merges other collections', () => {
    const collection = collect(['foo']);
    const mergedCollection = collection.merge(collect(['bar']));

    assertCollectionItems(mergedCollection, ['foo', 'bar']);
  });

  describe('forEach() method', () => {
    it('iterates over items', () => {
      let string = '';

      collect(['foo', 'bar']).forEach(item => string += item);
      assert.equal('foobar', string);
    });

    assertArrayCallbacks.passing('forEach');
    assertArrayCallbacks.preventFromModifying('forEach');
  });

  it('allows to push new values', () => {
    const collection = collect(['foo']);
    const newCollection = collection.push('bar');

    assertCollectionItems(collection, ['foo']);
    assertCollectionItems(newCollection, ['foo', 'bar']);
    assertCollectionItems(collection.push('bar', 'baz'), ['foo', 'bar', 'baz']);
  });

  describe('map() method', () => {
    it('allows to map values', () => {
      const collection = collect([1, 2, 3]);
      const newCollection = collection.map(i => i + 1);

      assertCollectionItems(collection, [1, 2, 3]);
      assertCollectionItems(newCollection, [2, 3, 4]);
    });

    assertArrayCallbacks.passing('map');
    assertArrayCallbacks.preventFromModifying('map');
  });

  describe('filter() method', () => {
    it('filters values', () => {
      const collection = collect([1, 2, 3, 4]);
      const newCollection = collection.filter(i => i % 2 === 0);

      assertCollectionItems(collection, [1, 2, 3, 4]);
      assertCollectionItems(newCollection, [2, 4]);
    });

    assertArrayCallbacks.passing('filter');
    assertArrayCallbacks.preventFromModifying('filter');
  });

  describe('reject() method', () => {
    it('rejects values', () => {
      const collection = collect([1, 2, 3, 4]);
      const newCollection = collection.reject(i => i % 2 === 0);

      assertCollectionItems(collection, [1, 2, 3, 4]);
      assertCollectionItems(newCollection, [1, 3]);
    });

    assertArrayCallbacks.passing('reject');
    assertArrayCallbacks.preventFromModifying('reject');
  });

  describe('ifEmpty() method', () => {
    it('calls ifEmpty when collection is empty', () => {
      let called = false;
      const collection = collect([]).ifEmpty(() => called = true);

      assert.ok(called);
      assert.equal(null, collection);
    });

    it('skips call when collection is not empty', () => {
      let called = false;
      const collection = collect(['foo'])
        .ifEmpty(() => called = true)
        .push('bar');

      assert.equal(called, false);
      assertCollectionItems(collection, ['foo', 'bar']);
    });

    it('pipes returned array', () => {
      const collection = collect([]).ifEmpty(() => [1, 2, 3]);
      assertCollectionItems(collection, [1, 2, 3]);
    });
  });
  
  describe('slice() method', () => {
    const collection = collect(['foo', 'bar', 'baz']);
    const cases = [
      {start: 0, size: 1, expected: ['foo']},
      {start: 1, size: 2, expected: ['bar', 'baz']},
      {start: 2, size: undefined, expected: ['baz']},
    ];

    cases.forEach((testCase, index) => {
      const {start, size, expected} = testCase;

      it(`test case #${index+1}: ${JSON.stringify(testCase)}`, () => {
        const newCollection = collection.slice(...[start, size]);
        assert.deepEqual(newCollection.getAll(), expected);
      });
    });
  });

  describe('extending via macros', () => {
    it('return new collection if macro returns array', () => {
      Collection.macro('assert', function (assert, instance) {
        assert.strictEqual(this, instance);

        return [1, 2, 3];
      });

      const collection = collect([]);
      const newCollection = collection.assert(assert, collection);

      assert.notStrictEqual(collection, newCollection);
      assert.notDeepEqual(collection.getAll(), newCollection.getAll());
      assert.deepEqual(newCollection.getAll(), [1, 2, 3]);

      delete Collection.prototype.assert;
    });

    it('returns non-array values', () => {
      Collection.macro('assert', function () {
        return 42;
      });

      assert.equal(collect([]).assert(), 42);

      delete Collection.prototype.assert;
    });
  });
});
