import {collect} from '../../lib';

export default {
  collapse: [
    {collection: collect([[1, 2], [3, 4]]), expected: [1, 2, 3, 4]},
  ],
};
