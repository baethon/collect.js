import * as R from 'ramda';

export const collapse = R.flatten;

export const combine = R.zipObj;

const pluckAndCombine = (valuesNames, keyName) => R.pipe(
  R.juxt([R.pluck(keyName), R.pluck(valuesNames)]),
  R.apply(combine)
);

export const pluck = (valuesName, keyName) => R.cond([
  [R.always(!!keyName), pluckAndCombine(valuesName, keyName)],
  [R.T, R.pluck(valuesName)],
]);

export const except = R.curry((exceptKeys, items) => R.pipe(
  R.keys,
  R.reject(R.flip(R.contains)(exceptKeys)),
  R.reduce(
    (prev, key) => R.assoc(key, items[key], prev),
    {}
  )
)(items));

export const flatMap = reducer => R.pipe(
  R.map(reducer),
  R.flatten,
);

const isString = value => () => R.is(String, value);
const keyToFn = key => R.cond([
  [isString(key), R.prop(key)],
  [R.T, key],
]);

export const groupBy = R.curry((key, items) => R.groupBy(
  keyToFn(key),
  items
));

const implodeByKey = (key, glue) => R.pipe(
  R.map(R.prop(key)),
  R.join(glue)
);

export const implode = (key, glue) => R.cond([
  [R.always(!!glue), implodeByKey(key, glue)],
  [R.T, R.join(key)],
]);

export const keyBy = R.curry((key, items) => R.reduceBy(
  (prev, current) => current,
  {},
  keyToFn(key),
  items
));

export const prepend = R.prepend;

export const sort = R.sort;

export const sortBy = R.curry(
  (key, items) => R.sortBy(R.prop(key), items)
);

export const reverse = R.reverse;

export const unique = key => (key ? R.uniqBy(keyToFn(key)) : R.uniq);
