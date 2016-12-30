import * as R from 'ramda';

export const avg = list => R.pipe(
  R.sum,
  R.divide(R.__, list.length)
)(list);

export const avgByKey = R.curry(
  (key, list) => R.compose(avg, R.pluck(key))(list)
);

export const containsValue = R.contains;

export const objectContainsValue = R.curry(
  (value, object) => containsValue(value, R.values(object))
);

export const containsValueByKey = R.curry(
  (key, value, list) => R.pipe(
    R.pluck(key),
    containsValue(value)
  )(list)
);

export const any = R.any;

export const count = R.length;
