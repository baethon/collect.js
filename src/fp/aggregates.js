import * as R from 'ramda';

export {
  any,
  has,
  sum,
  contains as containsValue,
  length as count,
} from 'ramda';

export const avg = list => R.pipe(
  R.sum,
  R.divide(R.__, list.length)
)(list);

export const avgByKey = R.curry(
  (key, list) => R.compose(avg, R.pluck(key))(list)
);

export const objectContainsValue = R.curry(
  (value, object) => R.contains(value, R.values(object))
);

export const containsValueByKey = R.curry(
  (key, value, list) => R.pipe(
    R.pluck(key),
    R.contains(value)
  )(list)
);

export const sumByKey = R.curry(
  (key, list) => R.pipe(R.pluck(key), R.sum)(list)
);
