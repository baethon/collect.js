import * as R from 'ramda';

export const avg = items => R.pipe(
  R.sum,
  R.divide(R.__, items.length)
)(items);

export const avgByKey = R.curry(
  (key, items) => R.compose(avg, R.pluck(key))(items)
);
