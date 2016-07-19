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
};
