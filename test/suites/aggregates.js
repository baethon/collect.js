import {collect} from '../../lib';

const collection = collect([1, 2, 3]);

export default {
  avg: [
    {collection, args: [], expected: 2},
    {collection: collect([{pages: 176}, {pages: 1096}]), args: ['pages'], expected: 636},
  ],
  contains: [
    {collection, args: [2], expected: true},
    {collection, args: [5], expected: false},
    {collection: collect([{name: 'Jon'}]), args: ['name', 'Arya'], expected: false},
    {collection: collect([{name: 'Jon'}]), args: ['name', 'Jon'], expected: true},
    {collection: collect({name: 'Jon'}), args: ['Jon'], expected: true},
    {collection, args: [value => value === 1], expected: false},
  ],
  count: [
    {collection, expected: 3},
  ],
};
