import * as R from 'ramda';

const reduceIndexed = R.addIndex(R.reduce);

export const collapse = R.flatten;

export const combine = keys => reduceIndexed(
  (combined, value, index) => R.assoc(keys[index], value, combined),
  {}
);

export function pluck(valuesName, keyName) {
  const withKeys = () => !!keyName;
  const pluckValues = R.pluck(valuesName);
  const pluckKeys = R.map(item => item[keyName]);

  return R.cond([
    [withKeys, R.pipe(
      R.juxt([pluckKeys, pluckValues]),
      ([keys, values]) => combine(keys)(values)
    )],
    [R.T, pluckValues],
  ]);
}
