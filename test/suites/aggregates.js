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
    {collection, args: [value => value === 1], expected: true},
  ],
  count: [
    {collection, expected: 3},
  ],
  has: [
    {collection: collect({name: 'Jon'}), args: ['name'], expected: true},
    {collection: collect({name: 'Jon'}), args: ['lastname'], expected: false},
  ],
  sum: [
    {collection, expected: 6},
    {
      collection: collect([
        {name: 'Desk', price: 200},
        {name: 'Chair', price: 100},
        {name: 'Bookcase', price: 150},
      ]),
      args: ['price'],
      expected: 450,
    }
  ],
}
