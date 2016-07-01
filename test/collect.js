import {describe, it} from 'mocha'
import assert from 'assert'
import {collect, Collection} from '../lib';

describe('collect test suite', () => {
  it('returns collection instance', () => {
    const list = collect();
    assert.ok(list instanceof Collection);
  });
});
