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

  describe('forEach() method', () => {
    it('iterates over items', () => {
      let string = '';

      collect(['foo', 'bar']).forEach(item => string += item);
      assert.equal('foobar', string);
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
});
