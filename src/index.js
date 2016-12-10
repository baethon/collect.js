/**
 * Creates new Collection instance
 *
 * ```js
 * import {collect} from '@baethon/collect';
 *
 * const collection = collect([1, 2, 3]);
 * ```
 *
 * @param items
 * @returns {Collection}
 */
export function collect(items) {
  return new Collection(items);
}

const isArrayable = value => value instanceof Collection || Array.isArray(value);

const toArray = value => (value instanceof Collection ? value.getAll() : Array.from(value));

const isObject = value => Object.prototype.toString.call(value) === '[object Object]';

export class Collection {
  constructor(items = []) {
    const arrayable = isArrayable(items);

    if (!arrayable && !isObject(items)) {
      throw new Error('Passed items are not valid array');
    }

    this.items = arrayable ? toArray(items) : items;
  }

  /**
   * Returns array/object stored inside Collection instance
   *
   * @returns {any}
   */
  getAll() {
    if (Array.isArray(this.items)) {
      return this.items.slice();
    }

    return Object.assign({}, this.items);
  }

  /**
   * Returns all of the collection keys
   *
   * @returns {Collection}
   */
  keys() {
    return new Collection(Object.keys(this.items));
  }

  /**
   * Returns all values of collection
   *
   * ```js
   * collect({name: 'Jon'}).values();
   * // Collection of ['Jon']
   *
   * collect([1, 2, 3]).values();
   * // Collection of [1, 2, 3]
   * ```
   *
   * @returns {Collection}
   */
  values() {
    if (Array.isArray(this.items)) {
      return new Collection(this.items);
    }

    const values = Object.keys(this.items).map(key => this.items[key]);
    return new Collection(values);
  }

  /**
   * Merges the given array into the collection:
   *
   * ```js
   * collect([1, 2, 3]).merge([4, 5, 6]);
   * // Collection of [1, 2, 3, 4, 5, 6]
   * ```
   *
   * @param items
   * @returns {Collection}
   */
  merge(items) {
    return new Collection(this.items.concat(toArray(items)));
  }

  /**
   * Iterates over the items in the collection and passes each item to a given callback:
   *
   * ```js
   * const collection = collect([1, 2, 3]).forEach(item => console.log(item));
   * // Collection of [1, 2, 3]
   * ```
   *
   * @param callback
   * @returns {Collection}
   */
  forEach(callback) {
    Array.prototype.forEach.call(this.items.slice(), callback);

    return this;
  }

  /**
   * Puts given values at the end of array
   *
   * ```js
   * collect([1, 2, 3]).push(4, 5, 6);
   * // Collection of [1, 2, 3, 4, 5, 6]
   * ```
   *
   * @param values
   * @returns {Collection}
   */
  push(...values) {
    return new Collection(this.items.concat(values));
  }

  /**
   * Iterates through the collection and passes each value to the given callback.
   * The callback is free to modify the item and return it,
   * thus forming a new collection of modified items:
   *
   * ```js
   * collect([1, 2, 3]).map(item => item + 1);
   * // Collection of [2, 3, 4]
   * ```
   *
   * @param callback
   * @returns {Collection}
   */
  map(callback) {
    return new Collection(this.getAll().map(callback));
  }

  /**
   * Returns collections of items matching given predicate:
   *
   * ```js
   * collect([1, 2, 3]).filter(i => i % 2 === 0);
   * // Collection of [2]
   * ```
   *
   * @param predicate
   * @returns {Collection}
   */
  filter(predicate) {
    return new Collection(this.getAll().filter(predicate));
  }

  /**
   * Returns collection of items not matching given predicate:
   *
   * ```js
   * collect([1, 2, 3]).reject(i => i % 2 === 0);
   * // Collection of [1, 3]
   * ```
   *
   * @param predicate
   * @returns {Collection}
   */
  reject(predicate) {
    return this.filter(
      (currentValue, index, array) => !predicate(currentValue, index, array)
    );
  }

  ifEmpty(callback) {
    if (this.items.length) {
      return this;
    }

    const result = callback();

    try {
      return new Collection(result);
    } catch (e) {
      return null;
    }
  }

  slice(start, size) {
    const end = (size === undefined) ? undefined : start + size;
    const newItems = this.items.slice(start, end);
    return new Collection(newItems);
  }

  /**
   * Return average value of all items in collection
   *
   * ```js
   * collect([1, 2, 3]).avg();
   * // 2
   * ```
   *
   * If the collection contains nested objects, keyName is required
   * to use for determining which values to calculate the average:
   *
   * ```js
   * const collection = collect([
   *   {name: 'JavaScript: The Good Parts', pages: 176},
   *   {name: 'JavaScript: The Definitive Guide', pages: 1096},
   * ]);
   *
   * collection.avg('pages');
   * // 636
   * ```
   *
   * @param keyName
   * @returns {number}
   */
  avg(keyName) {
    let items = this.getAll();

    if (keyName) {
      items = items.map(item => item[keyName]);
    }

    return items.reduce((sum, current) => sum + current, 0) / items.length;
  }

  /**
   * Collapse array of collections into flat collection
   *
   * ```js
   * collect([[1, 2], [3, 4]]).collapse();
   * // Collection of [1, 2, 3, 4]
   * ```
   */
  collapse() {
    const items = this.getAll()
      .reduce((flatArray, current) => flatArray.concat(current), []);

    return new Collection(items);
  }

  /**
   * Combines the keys of the collection with the values of another array or collection
   *
   * ```js
   * collect(['name', 'age']).combine(['Jon', 16]);
   * // Collection of { name: 'Jon', age: 16 }
   * ```
   *
   * @param values
   * @returns {Collection}
   */
  combine(values) {
    values = toArray(values);

    const combined = this.items.reduce((prev, keyName, index) => Object.assign({}, prev, {
      [keyName]: values[index],
    }), {});

    return new Collection(combined);
  }

  /**
   * Retrieves all of the collection values for a given key:
   *
   * ```js
   * collect([{name: 'Jon'}, {name: 'Arya'}]).pluck('name');
   * // Collection of ['Jon', 'Arya']
   * ```
   *
   * You may also specify how you wish the resulting collection to be keyed:
   *
   * ```js
   * collect([{name: 'Jon', house: 'Stark'}]).pluck('name', 'house');
   * // Collection of {Stark: 'Jon'}
   * ```
   *
   * @param valuesName
   * @param keyName
   * @returns {Collection}
   */
  pluck(valuesName, keyName) {
    let items;

    if (keyName) {
      items = this.items.reduce((newCollection, item) => Object.assign({}, newCollection, {
        [item[keyName]]: item[valuesName],
      }), {});
    } else {
      items = this.items.map(item => item[valuesName]);
    }

    return new Collection(items);
  }

  /**
   * Determines whether the collection contains a given item:
   *
   * ```js
   * collect({name: 'Jon'}).contains('Jon');
   * // true
   *
   * collect({name: 'Jon'}).contains('Arrya');
   * // false
   * ```
   *
   * It's possible to pass a key / value pair to the contains method,
   * which will determine if the given pair exists in the collection:
   *
   * ```js
   * const collection = collect([
   *   {name: 'Jon', lastname: 'Snow'},
   *   {name: 'Arya', lastname: 'Stark'},
   * ]);
   *
   * collection.contains('lastname', 'Stark');
   * // true
   * ```
   *
   * Also it's possible to pass own callback to perform truth test:
   *
   * ```js
   * collection([1, 2, 3]).contains(i => i >= 3);
   * // true
   * ```
   *
   * Arguments passed to callback are the same as in Array.some method.
   *
   * @param predicate
   * @param value
   * @returns {boolean}
   */
  contains(predicate, value) {
    let items;

    if (value === undefined && typeof predicate !== 'function') {
      value = predicate;
      predicate = undefined;
    }

    if (typeof predicate === 'string') {
      items = this.pluck(predicate).getAll();
    } else if (isObject(this.items)) {
      items = this.values().getAll();
    } else {
      items = this.getAll();
    }

    if (typeof predicate !== 'function') {
      predicate = currentValue => currentValue === value;
    }

    return items.some(predicate);
  }

  count() {
    return this.items.length;
  }

  /**
   * Returns all items in the collection except for those with the specified keys:
   *
   * ```js
   * const collection = collect({productId: 1, name: 'Desk', price: 100, discount: false});
   * const filtered = collection.except(['price', 'discount']);
   * filtered.all();
   * // Collection of {productId: 1, name: 'Desk'}
   * ```
   *
   * @param keys
   * @returns {Collection}
   */
  except(keys) {
    const newCollection = {};
    this.keys()
      .reject(name => keys.indexOf(name) >= 0)
      .forEach(name => Object.assign(newCollection, {
        [name]: this.items[name],
      }));

    return new Collection(newCollection);
  }

  /**
   * Iterates through the collection and passes each value to the given callback.
   * The callback is free to modify the item and return it,
   * thus forming a new collection of modified items.
   *
   * Then, the array is flattened by a level:
   *
   * ```js
   * const people = collect([
   *    {name: 'Jon', titles: ['King of the North', 'Knower of nothing']},
   *    {name: 'Arya', titles: ['Little assasin']}
   * ]);
   *
   * const titles = people.flatMap(person => person.titles);
   * // Collection of ['King of the North', 'Knower of nothing', 'Little assasin']
   * ```
   *
   * @param callback
   * @returns {Collection}
   */
  flatMap(callback) {
    return this.map(callback).collapse();
  }

  /**
   * Groups the collection's items by a given key:
   *
   * ```js
   * const collection = collect([
   *    { house: 'Stark', name: 'Jon' },
   *    { house: 'Stark', name: 'Arrya' },
   * ]);
   *
   * const byHouse = collection.groupBy('house');
   * // Collection of {
   * //   Stark: [
   * //     { house: 'Stark', name: 'Jon' },
   * //     { house: 'Stark', name: 'Arrya' },
   * //   ],
   * // }
   * ```
   *
   * In addition to passing a string `key`, it's possible to pass a callback.
   * The callback should return the value you wish to key the group by:
   *
   * ```js
   * const collection = collect([
   *    { house: 'Stark', name: 'Jon' },
   *    { house: 'Stark', name: 'Arrya' },
   * ]);
   *
   * const byHouse = collection.groupBy(person => person.house.toUpperCase());
   * // Collection of {
   * //   STARK: [
   * //     { house: 'Stark', name: 'Jon' },
   * //     { house: 'Stark', name: 'Arrya' },
   * //   ],
   * // }
   * ```
   *
   * @param key
   * @returns {Collection}
   */
  groupBy(key) {
    let keyFactory;

    if (typeof key === 'function') {
      keyFactory = key;
    } else {
      keyFactory = current => current[key];
    }

    const newCollection = this.items.reduce((items, current, index, array) => {
      const key = keyFactory(current, index, array);
      const values = items[key] || [];

      return Object.assign({}, items, {
        [key]: values.concat(current),
      });
    }, {});

    return new Collection(newCollection);
  }

  /**
   * Determines if a given key exists in the collection:
   *
   * ```js
   * collect({name: 'Jon'}).has('name');
   * // true
   * ```
   *
   * @param key
   */
  has(key) {
    return key in this.items;
  }

  /**
   * Join the items in a collection.
   *
   * Arguments depend on the type of items in the collection.
   *
   * If the collection contains array of objects,
   * you should pass the key of the attributes you wish to join,
   * and the "glue" string you wish to place between the values:
   *
   * ```js
   * collect([{name: 'Jon'}, {name: 'Arya'}]).implode('name', ', ');
   * // Jon, Arya
   * ```
   *
   * If the collection contains simple strings or numeric values,
   * simply pass the "glue" as the only argument to the method:
   *
   * ```js
   * collect(['Jon', 'Arya']).implode(', ');
   * // Jon, Arya
   * ```
   *
   * @param key
   * @param glue
   * @returns {string}
   */
  implode(key, glue) {
    if (!glue) {
      glue = key;
      key = null;
    }

    const values = key ? this.pluck(key) : this;

    return values.getAll().join(glue);
  }

  /**
   * Keys the collection by the given key:
   *
   * ```js
   * let collection = collect([
   *    {productId: 'prod-100', name: 'desk'},
   *    {productId: 'prod-200', name: 'table'},
   * ]);
   *
   * collection.keyBy('productId');
   * // Collection of {
   * //   'prod-100': {productId: 'prod-100', name: 'desk'},
   * //   'prod-200': {productId: 'prod-200', name: 'table'},
   * // }
   * ```
   *
   * If multiple items have the same key, only the last one will appear in the new collection.
   *
   * You may also pass your own callback, which should return the value to key the collection by:
   *
   * ```js
   * collection.keyBy(item => item.productId.toUpperCase());
   * // Collection of {
   * //   'PROD-100': {productId: 'prod-100', name: 'desk'},
   * //   'PROD-200': {productId: 'prod-200', name: 'table'},
   * // }
   * ```
   *
   * @param key
   * @returns {Collection}
   */
  keyBy(key) {
    let keyFactory;

    if (typeof key === 'function') {
      keyFactory = key;
    } else {
      keyFactory = current => current[key];
    }

    const newCollection = this.items.reduce((newCollection, current, index, array) => {
      const key = keyFactory(current, index, array);

      return Object.assign({}, newCollection, {
        [key]: current,
      });
    }, {});

    return new Collection(newCollection);
  }

  /**
   * Add an item to the beginning of the collection
   *
   * @param value
   * @returns {Collection}
   */
  prepend(value) {
    const items = this.getAll();
    items.unshift(value);

    return new Collection(items);
  }

  /**
   * Reduce the collection to a single value,
   * passing the result of each iteration into the subsequent iteration:
   *
   * ```js
   * collect([1, 2, 3]).reduce((carry, current) => {
   *    return carry ? carry + current : current;
   * });
   * // 6
   * ```
   *
   * The value for carry on the first iteration is null;
   * however, its initial value can be specified by passing a second argument to reduce:
   *
   * ```js
   * collect([1, 2, 3]).reduce((carry, current) => carry + current, 0);
   * // 6
   * ```
   *
   * @param callback
   * @param carry
   * @returns {any}
   */
  reduce(callback, carry = null) {
    const items = this.getAll();
    return items.reduce(callback, carry);
  }

  /**
   * Sort collection with given compareFunction.
   *
   * ```js
   * collect([3, 5, 1]).sort((a, b) => b-a);
   * // Collection of [5, 3, 1]
   * ```
   *
   * If compareFunction is omitted, the array is sorted according to each character's
   * Unicode code point value, according to the string conversion of each element.
   *
   * ```js
   * collect([3,5,1]).sort();
   * // Collection of [1, 3, 5]
   * ```
   *
   * @param compareFunction
   * @returns {Collection}
   */
  sort(compareFunction) {
    const items = this.getAll().sort(compareFunction);
    return new Collection(items);
  }

  /**
   * Sort the collection by the given key
   *
   * ```js
   * const collection = collect([
   *    {name: 'Desk', price: 200},
   *    {name: 'Chair', price: 100},
   *    {name: 'Bookcase', price: 150},
   * ]);
   *
   * const sorted = collection.sortBy('price');
   * // Collection of [
   * //    {name: 'Chair', price: 100},
   * //    {name: 'Bookcase', price: 150},
   * //    {name: 'Desk', price: 200},
   * // ]
   * ```
   *
   * @param key
   * @returns {Collection}
   */
  sortBy(key) {
    return this.sort((a, b) => a[key] - b[key]);
  }

  /**
   * Return the sum of all items in the collection:
   *
   * ```js
   * collect([1, 2, 3]).sum();
   * // 6
   * ```
   *
   * If the collection contains nested objects,
   * a key to use for determining which values to sum should be passed:
   *
   * ```js
   * collect([
   *    {name: 'Desk', price: 200},
   *    {name: 'Chair', price: 100},
   *    {name: 'Bookcase', price: 150},
   * ]).sum('price');
   * // 450
   * ```
   *
   * @param key
   * @returns {number}
   */
  sum(key) {
    let items;

    if (key) {
      items = this.pluck(key).getAll();
    } else {
      items = this.getAll();
    }

    return items.reduce((sum, current) => sum + current, 0);
  }

  /**
   * Reverse the order of the collection's items:
   *
   * ```js
   * collect([1, 2, 3]).revese();
   * // Collection of [3, 2, 1]
   * ```
   *
   * @returns {Collection}
   */
  reverse() {
    const items = Array.from(this.getAll()).reverse();
    return new Collection(items);
  }

  /**
   * Return all of the unique items in the collection:
   *
   * ```js
   * collect([1, 1, 2, 2, 3, 4, 2]).unique();
   * // Collection of [1, 2, 3, 4]
   * ```
   *
   * When dealing with nested objects,
   * it's possible to specify the key used to determine uniqueness:
   *
   * ```js
   * const collection = collect([
   *    {name: 'iPhone 6', brand: 'Apple', type: 'phone'},
   *    {name: 'iPhone 5', brand: 'Apple', type: 'phone'},
   *    {name: 'Apple Watch', brand: 'Apple', type: 'watch'},
   *    {name: 'Galaxy S6', brand: 'Samsung', type: 'phone'},
   *    {name: 'Galaxy Gear', brand: 'Samsung', type: 'watch'},
   * ]);
   *
   * collection.unique('brand');
   * // Collection of [
   * //   {name: 'iPhone 6', brand: 'Apple', type: 'phone'},
   * //   {name: 'Galaxy S6', brand: 'Samsung', type: 'phone'},
   * // ]
   * ```
   *
   * It's also possible to pass own callback to determine item uniqueness:
   *
   * ```js
   * collection.unique(item => `${item.brand}${item.type}`);
   * // Collection of [
   * //   {name: 'iPhone 6', brand: 'Apple', type: 'phone'},
   * //   {name: 'Apple Watch', brand: 'Apple', type: 'watch'},
   * //   {name: 'Galaxy S6', brand: 'Samsung', type: 'phone'},
   * //   {name: 'Galaxy Gear', brand: 'Samsung', type: 'watch'},
   * // ]
   * ```
   *
   * @param key
   * @returns {Collection}
   */
  unique(key) {
    let uniqueKey = value => value;

    if (typeof key === 'string') {
      uniqueKey = value => value[key];
    } else if (typeof key === 'function') {
      uniqueKey = key;
    }

    const items = this.getAll().reduce((items, value) => {
      const key = uniqueKey(value);

      if (!items.some(item => item.key === key)) {
        items.push({ key, value });
      }

      return items;
    }, []);

    return new Collection(items.map(({ value }) => value));
  }

  /**
   * Filters the collection by a given key / value pair:
   *
   * ```js
   * const collection = collect([
   *    {product: 'Desk', price: 200},
   *    {product: 'Chair', price: 100},
   *    {product: 'Bookcase', price: 150},
   *    {product: 'Door', price: 100},
   * ]);
   *
   * collection.where('price', 100);
   * // Collection of [
   * //   {product: 'Chair', price: 100},
   * //   {product: 'Door', price: 100},
   * // ]
   * ```
   *
   * Method uses strict comparisons when checking item values.
   *
   * @param key
   * @param value
   * @returns {Collection}
   */
  where(key, value) {
    return this.whereIn(key, [value]);
  }

  /**
   * Filters the collection by a given key / value contained within the given array:
   *
   * ```js
   * const collection = collect([
   *    {product: 'Desk', price: 200},
   *    {product: 'Chair', price: 100},
   *    {product: 'Bookcase', price: 150},
   *    {product: 'Door', price: 100},
   * ]);
   *
   * collection.whereIn('price', [100, 150]);
   * // Collection of [
   * //   {product: 'Chair', price: 100},
   * //   {product: 'Bookcase', price: 150},
   * //   {product: 'Door', price: 100},
   * // ]
   * ```
   *
   * Method uses strict comparisons when checking item values.
   *
   * @param key
   * @param values
   * @returns {Collection}
   */
  whereIn(key, values) {
    return this.filter(item => values.indexOf(item[key]) >= 0);
  }

  /**
   * Merges together the values of the given array
   * with the values of the collection at the corresponding index:
   *
   * ```js
   * const collection = collect(['Chair', 'Desk']);
   * const zipped = collection.zip([100, 200]);
   * // Collection of [['Chair', 100], ['Desk', 200]]
   * ```
   *
   * @param items
   */
  zip(...items) {
    const arrayableItems = items.map(toArray);
    const zipped = this.reduce((zippedItems, currentItem, index) => {
      const value = arrayableItems.map(item => item[index]);
      value.unshift(currentItem);

      return [...zippedItems, value];
    }, []);

    return new Collection(zipped);
  }

  static macro(name, callback) {
    Collection.prototype[name] = function macroWrapper(...args) {
      const result = callback.call(this, ...args);

      try {
        return new Collection(result);
      } catch (e) {
        return result;
      }
    };
  }
}
