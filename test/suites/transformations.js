import {collect} from '../../lib';

export default {
  collapse: [
    {collection: collect([[1, 2], [3, 4]]), expected: [1, 2, 3, 4]},
  ],
  combine: [
    {collection: collect(['name', 'age']), args: [['Jon', 16]], expected: {name: 'Jon', age: 16}},
    {collection: collect(['name', 'age']), args: [collect(['Jon', 16])], expected: {name: 'Jon', age: 16}},
  ],
  pluck: [
    {collection: collect([{name: 'Jon'}, {name: 'Arya'}]), args: ['name'], expected: ['Jon', 'Arya']},
  ],
  except: [
    {
      collection: collect({productId: 1, name: 'Desk', price: 100, discount: false}),
      args: [['price', 'discount']],
      expected: {productId: 1, name: 'Desk'},
    },
  ],
  flatMap: [
    {
      collection: collect([{skills: ['c++', 'php']}, {skills: ['java', 'c#']}]),
      args: [row => row.skills],
      expected: ['c++', 'php', 'java', 'c#'],
    },
  ],
};
