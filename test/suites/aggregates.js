import {collect} from '../../lib';

const collection = collect([1, 2, 3]);

export default {
  avg: [
    {collection, args: [], expected: 2},
    {collection: collect([{pages: 176}, {pages: 1096}]), args: ['pages'], expected: 636},
  ],
};
