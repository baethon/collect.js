import * as R from 'ramda';

export {
  concat as merge,
} from 'ramda';

// @TODO rethink if this should be done without R.curry()
export const push = (collection, ...items) => collection.concat(items);
