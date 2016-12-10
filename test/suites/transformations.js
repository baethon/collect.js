import {collect} from '../../src';

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
    {collection: collect([{name: 'Jon', house: 'Stark'}]), args: ['name', 'house'], expected: {Stark: 'Jon'}},
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
  groupBy: [
    {
      collection: collect([
        {accountId: 'account-x10', product: 'Chair'},
        {accountId: 'account-x10', product: 'Bookcase'},
        {accountId: 'account-x11', product: 'Desk'},
      ]),
      args: ['accountId'],
      expected: {
        'account-x10': [
          {accountId: 'account-x10', product: 'Chair'},
          {accountId: 'account-x10', product: 'Bookcase'},
        ],
        'account-x11': [
          {accountId: 'account-x11', product: 'Desk'},
        ],
      },
    },
    {
      collection: collect([
        {accountId: 'account-x10', product: 'Chair'},
        {accountId: 'account-x10', product: 'Bookcase'},
        {accountId: 'account-x11', product: 'Desk'},
      ]),
      args: [current => current.accountId.substr(-3)],
      expected: {
        x10: [
          {accountId: 'account-x10', product: 'Chair'},
          {accountId: 'account-x10', product: 'Bookcase'},
        ],
        x11: [
          {accountId: 'account-x11', product: 'Desk'},
        ],
      },
    }
  ],
  implode: [
    {
      collection: collect([
        {name: 'Jon'},
        {name: 'Arya'},
      ]),
      args: ['name', ', '],
      expected: 'Jon, Arya',
    },
    {
      collection: collect(['Jon', 'Arya']),
      args: [', '],
      expected: 'Jon, Arya',
    },
  ],
  keyBy: [
    {
      collection: collect([
        {accountId: 'account-x10', product: 'Chair'},
        {accountId: 'account-x11', product: 'Bookcase'},
      ]),
      args: ['accountId'],
      expected: {
        'account-x10': {accountId: 'account-x10', product: 'Chair'},
        'account-x11': {accountId: 'account-x11', product: 'Bookcase'},
      },
    },
    {
      collection: collect([
        {accountId: 'account-x10', product: 'Chair'},
        {accountId: 'account-x11', product: 'Bookcase'},
      ]),
      args: [item => item.accountId.toUpperCase()],
      expected: {
        'ACCOUNT-X10': {accountId: 'account-x10', product: 'Chair'},
        'ACCOUNT-X11': {accountId: 'account-x11', product: 'Bookcase'},
      },
    },
  ],
  prepend: [
    {collection: collect([1, 2, 3]), args: [0], expected: [0, 1, 2, 3]},
  ],
  sort: [
    {collection: collect([3, 5, 1]), expected: [1, 3, 5]},
    {collection: collect([3, 5, 1]), args: [(a, b) => b - a], expected: [5, 3, 1]},
  ],
  sortBy: [
    {
      collection: collect([
        {name: 'Desk', price: 200},
        {name: 'Chair', price: 100},
        {name: 'Bookcase', price: 150},
      ]),
      args: ['price'],
      expected: [
        {name: 'Chair', price: 100},
        {name: 'Bookcase', price: 150},
        {name: 'Desk', price: 200},
      ],
    },
  ],
  reverse: [
    {collection: collect([1, 2, 3]), expected: [3, 2, 1]},
  ],
  unique: [
    {collection: collect([2, 1, 1, 2, 2, 3, 4, 2]), expected: [2, 1, 3, 4]},
    {
      collection: collect([
        {name: 'iPhone 6', brand: 'Apple', type: 'phone'},
        {name: 'iPhone 5', brand: 'Apple', type: 'phone'},
        {name: 'Apple Watch', brand: 'Apple', type: 'watch'},
        {name: 'Galaxy S6', brand: 'Samsung', type: 'phone'},
        {name: 'Galaxy Gear', brand: 'Samsung', type: 'watch'},
      ]),
      args: ['brand'],
      expected: [
        {name: 'iPhone 6', brand: 'Apple', type: 'phone'},
        {name: 'Galaxy S6', brand: 'Samsung', type: 'phone'},
      ],
    },
    {
      collection: collect([
        {name: 'iPhone 6', brand: 'Apple', type: 'phone'},
        {name: 'iPhone 5', brand: 'Apple', type: 'phone'},
        {name: 'Apple Watch', brand: 'Apple', type: 'watch'},
        {name: 'Galaxy S6', brand: 'Samsung', type: 'phone'},
        {name: 'Galaxy Gear', brand: 'Samsung', type: 'watch'},
      ]),
      args: [item => `${item.brand}${item.type}`],
      expected: [
        {name: 'iPhone 6', brand: 'Apple', type: 'phone'},
        {name: 'Apple Watch', brand: 'Apple', type: 'watch'},
        {name: 'Galaxy S6', brand: 'Samsung', type: 'phone'},
        {name: 'Galaxy Gear', brand: 'Samsung', type: 'watch'},
      ],
    }
  ],
  where: [
    {
      collection: collect([
        {product: 'Desk', price: 200},
        {product: 'Chair', price: 100},
        {product: 'Bookcase', price: 150},
        {product: 'Door', price: 100},
      ]),
      args: ['price', 100],
      expected: [
        {product: 'Chair', price: 100},
        {product: 'Door', price: 100},
      ],
    },
  ],
  whereIn: [
    {
      collection: collect([
        {product: 'Desk', price: 200},
        {product: 'Chair', price: 100},
        {product: 'Bookcase', price: 150},
        {product: 'Door', price: 100},
      ]),
      args: ['price', [100, 150]],
      expected: [
        {product: 'Chair', price: 100},
        {product: 'Bookcase', price: 150},
        {product: 'Door', price: 100},
      ],
    },
  ],
  zip: [
    {
      collection: collect(['Chair', 'Desk']),
      args: [[100, 200]],
      expected: [['Chair', 100], ['Desk', 200]],
    },
    {
      collection: collect(['Chair', 'Desk']),
      args: [[100, 200], ['good', 'broken']],
      expected: [['Chair', 100, 'good'], ['Desk', 200, 'broken']],
    },
    {
      collection: collect(['Chair', 'Desk']),
      args: [[100]],
      expected: [['Chair', 100], ['Desk', undefined]],
    },
    {
      collection: collect(['Chair', 'Desk']),
      args: [collect([100, 200])],
      expected: [['Chair', 100], ['Desk', 200]],
    },
  ],
};
