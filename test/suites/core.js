import {collect} from '../../lib';

const collection = collect([1, 2, 3]);

export default {
  merge: [
    {collection, args: [[4, 5, 6]], expected: [1, 2, 3, 4, 5, 6]},
    {collection, args: [collect([4, 5, 6])], expected: [1, 2, 3, 4, 5, 6]},
  ],
  push: [
    {collection, args: ['foo'], expected: [1, 2, 3, 'foo']},
    {collection, args: ['foo', 'bar'], expected: [1, 2, 3, 'foo', 'bar']}
  ],
  map: [
    {collection, args: [i => i + 1], expected: [2, 3, 4]},
  ],
  filter: [
    {collection, args: [i => i % 2 === 0], expected: [2]},
  ],
  reject: [
    {collection, args: [i => i % 2 === 0], expected: [1, 3]},
  ],
  slice: [
    {collection, args: [0, 1], expected: [1]},
    {collection, args: [1, 2], expected: [2, 3]},
    {collection, args: [2, undefined], expected: [3]},
  ],
};
