import {describe, it} from 'mocha';
import assert from 'assert';
import {collect, Collection} from '../lib';
import {runSuite} from './suites/runSuite';

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

describe('Collection', () => {
  it('returns collection instance', () => {
    const items = ['foo', 'bar'];
    const collection = collect(items);

    assert.ok(collection instanceof Collection);
    assertCollectionItems(collection, items);
    assert.notStrictEqual(collection.getAll(), items);
  });

  it('allows to set arrays, objects or other collections', () => {
    assert.throws(() => collect(null), Error);
    assert.throws(() => collect(123), Error);
    assert.throws(() => collect('123'), Error);
    assert.throws(() => collect(() => {}), Error);
    assert.doesNotThrow(() => collect([]));
    assert.doesNotThrow(() => collect({}));
    assert.doesNotThrow(() => collect(collect([])));
  });

  it('returns copy of items', () => {
    let collection = collect(['foo']);
    assert.notStrictEqual(collection.getAll(), collection.items);
    
    collection = collect({name: 'Jon'});
    assert.notStrictEqual(collection.getAll(), collection.items);
    assertCollectionItems(collection, {name: 'Jon'});
  });

  it('can be created from other collection', () => {
    const collection = collect(['foo']);
    const newColleciton = collect(collection);

    assert.notStrictEqual(collection.items, newColleciton.items);
    assertCollectionItems(newColleciton, collection.getAll());
  });

  describe('forEach() method', () => {
    it('iterates over items', () => {
      let string = '';
      const collection = collect(['foo', 'bar']);
      const result = collection.forEach(item => string += item);

      assert.equal('foobar', string);
      assert.equal(collection, result);
    });

    assertArrayCallbacks.passing('forEach');
    assertArrayCallbacks.preventFromModifying('forEach');
  });

  describe('map() callback arguments', () => {
    assertArrayCallbacks.passing('map');
    assertArrayCallbacks.preventFromModifying('map');
  });

  describe('filter() callback arguments', () => {
    assertArrayCallbacks.passing('filter');
    assertArrayCallbacks.preventFromModifying('filter');
  });

  describe('reject() callback arguments', () => {
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

  it('retuns values of an array', () => {
    const collection = collect([1, 2, 3]);
    assert.deepEqual(collection.values().getAll(), [1, 2, 3]);
  });
});

describe('reduce() method', () => {
  it('reduces values without initial carry value', () => {
    const collection = collect([1, 2, 3]);
    const reducedValue = collection.reduce((carry, current) => {
      if (!carry) {
        return current + 100;
      }

      return carry + current;
    });

    assert.equal(reducedValue, 106);
  });

  it('reduces values with initial carry value', () => {
    const collection = collect([1, 2, 3]);
    const reducedValue = collection.reduce((carry, current) => carry + current, 100);

    assert.equal(reducedValue, 106);
  });

  it('passes index and array to callback', () => {
    collect(['foo']).reduce((carry, current, index, array) => {
      assert.equal(index, 0);
      assert.deepEqual(array, ['foo']);
    });
  });

  it('prevents from modifying array agrument', () => {
    const collection = collect(['foo']);
    collection.reduce((carry, current, index, array) => array.push('bar'));

    assertCollectionItems(collection, ['foo']);
  });
});

describe('Collection test suites', () => {
  const suites = [
    './suites/core',
    './suites/aggregates',
    './suites/transformations',
  ];

  suites.forEach(path => {
    runSuite(require(path).default);
  });

  describe('extending via macros', () => {
    afterEach(() => {
      delete Collection.prototype.assert;
    });

    it('returns new collection if macro returns arrayable', () => {
      Collection.macro('assert', function (assert, instance) {
        assert.strictEqual(this, instance);

        return [1, 2, 3];
      });

      const collection = collect([]);
      const newCollection = collection.assert(assert, collection);

      assert.notStrictEqual(collection, newCollection);
      assert.notDeepEqual(collection.getAll(), newCollection.getAll());
      assert.deepEqual(newCollection.getAll(), [1, 2, 3]);
    });

    it('returns non-array values', () => {
      Collection.macro('assert', function () {
        return 42;
      });

      assert.equal(collect([]).assert(), 42);
    });
  });
});
