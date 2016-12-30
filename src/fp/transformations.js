import * as R from 'ramda';

export { 
  flatten as collapse,
  zipObj as combine,
  pluck,
  join as implode,
  prepend,
  sort,
  reverse,
  uniq as unique,
} from 'ramda';

export const pluckAndCombine = R.curry((valuesNames, keyName, items) => R.pipe(
  R.juxt([R.pluck(keyName), R.pluck(valuesNames)]),
  R.apply(R.zipObj)
)(items));

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

export const implodeByKey = R.curry((key, glue, items) => R.pipe(
  R.map(R.prop(key)),
  R.join(glue)
)(items));

export const keyBy = R.curry((key, items) => R.reduceBy(
  (prev, current) => current,
  {},
  keyToFn(key),
  items
));

export const sortBy = R.curry(
  (key, items) => R.sortBy(R.prop(key), items)
);

export const uniqueByKey = R.curry((key, items) => R.uniqBy(keyToFn(key))(items));

export const where = R.curry((key, value, items) => R.filter(
  R.propEq(key, value),
  items
));

export const whereIn = R.curry((key, values, items) => R.filter(
  R.pipe(
    R.prop(key),
    R.flip(R.contains)(values)
  ),
  items
));

export const zip = R.flip(R.zip);
