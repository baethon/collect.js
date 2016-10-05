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
export function collect(items: any): Collection {
  return new Collection(items);
}

const isArrayable: (value: any) => boolean =
  value => value instanceof Collection || Array.isArray(value);

const toArray: (value: any) => any[] =
  value => value instanceof Collection ? <any[]>value.getAll() : Array.from(value);

const isObject: (value: any) => boolean =
  value => Object.prototype.toString.call(value) === '[object Object]';

export interface ArrayCallback<T> {
  (currentValue: any, index?: number, array?: any[]): T;
}

export interface ReduceCallback {
  (carry: any, currentValue: any, index?: number, array?: any[]): any;
}

export interface UniqueCallback {
  (value: any): any;
}

/**
 * @interface
 */
export class Collection {
  private _items: any[];

  constructor(items: any) {
    const arrayable = isArrayable(items);

    if (!arrayable && !isObject(items)) {
      throw new Error('Passed items are not valid array');
    }

    if (arrayable) {
      items = toArray(items);
    }

    this._items = items;
  }

	/**
   * Returns array/object stored inside Collection instance
   *
   * @returns {any}
   */
  getAll(): any[]|Object {
    if (Array.isArray(this._items)) {
      return this._items.slice();
    }

    return Object.assign({}, this._items);
  }

  get items() {
    return this.getAll();
  }

  /**
   * Returns all of the collection keys
   *
   * @returns {Collection}
   */
  keys(): Collection {
    return new Collection(Object.keys(this._items));
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
  values(): Collection {
    if (Array.isArray(this._items)) {
      return new Collection(this._items);
    }

    const values = Object.keys(this._items).map(key => this._items[key]);
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
  merge(items: Collection|any[]): Collection {
    return new Collection(this._items.concat(toArray(items)));
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
  forEach(callback: ArrayCallback<void>): Collection {
    Array.prototype.forEach.call(this._items.slice(), callback);

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
  push(...values: any[]): Collection {
    return new Collection(this._items.concat(values));
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
  map(callback: ArrayCallback<any>): Collection {
    return new Collection((<any[]>this.items).map(callback));
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
  filter(predicate: ArrayCallback<boolean>): Collection {
    return new Collection((<any[]>this.items).filter(predicate));
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
  reject(predicate: ArrayCallback<boolean>): Collection {
    return this.filter(
      (currentValue: any, index: number, array: any[]) => !predicate(currentValue, index, array)
    );
  }

  ifEmpty(callback: () => any): Collection {
    if (this._items.length) {
      return this;
    }

    const result = callback();

    try {
      return new Collection(result);
    } catch (e) {
      return null;
    }
  }

  slice(start: number, size?: number): Collection {
    const end = (size === undefined) ? undefined : start + size;
    const newItems = Array.prototype.slice.call(this._items, start, end);
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
  avg(keyName?: string): number {
    let items = <any[]>this.getAll();

    if (keyName) {
      items = items.map(item => item[keyName]);
    }

    const sum = items.reduce((sum, current) => sum + current, 0);
    return sum / items.length;
  }

  /**
   * Collapse array of collections into flat collection
   *
   * ```js
   * collect([[1, 2], [3, 4]]).collapse();
   * // Collection of [1, 2, 3, 4]
   * ```
   */
  collapse(): Collection {
    const items = (<any[]>this.getAll())
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
  combine(values: Collection|any[]): Collection {
    values = toArray(values);

    const combined = this._items.reduce((combined, keyName, index) => Object.assign(combined, {
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
  pluck(valuesName: string, keyName?: string): Collection {
    let items: any[]|Object;

    if (keyName) {
      items = this._items.reduce((newCollection, item) => Object.assign({}, newCollection, {
        [item[keyName]]: item[valuesName],
      }), {});
    } else {
      items = this._items.map(item => item[valuesName]);
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
  contains(predicate: string, value: any): boolean;
  contains(predicate: ArrayCallback<boolean>, value: any): boolean;
  contains(predicate: any, value?: any): boolean {
    let items = <any[]>this.getAll();

    if (value === undefined) {
      value = predicate;
      predicate = undefined;
    }

    if (typeof predicate === 'string') {
      items = <any[]>this.pluck(predicate).getAll();
    } else if (isObject(this._items)) {
      items = <any[]>this.values().getAll();
    }

    if (typeof predicate !== 'function') {
      predicate = (currentValue: any): boolean => currentValue === value;
    }

    return items.some(predicate);
  }

  count(): number {
    return this._items.length;
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
  except(keys: string[]): Collection {
    const newCollection = {};
    this.keys()
      .reject(name => keys.indexOf(name) >= 0)
      .forEach(name => Object.assign(newCollection, {
        [name]: this._items[name],
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
  flatMap(callback: ArrayCallback<any>): Collection {
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
  groupBy(key: string|ArrayCallback<string>): Collection {
    let keyFactory: ArrayCallback<string>;

    if (typeof key === 'function') {
      keyFactory = <ArrayCallback<string>>key;
    } else {
      keyFactory = current => current[key];
    }

    const newCollection = this._items.reduce((newCollection, current, index, array) => {
      const key = keyFactory(current, index, array);
      const values = newCollection[key] || [];

      return Object.assign({}, newCollection, {
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
  has(key: string): boolean {
    return key in this._items;
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
  implode(key: string, glue?: string): string {
    if (!glue) {
      glue = key;
      key = null;
    }

    const values = key ? this.pluck(key) : this;

    return (<any[]>values.getAll()).join(glue);
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
  keyBy(key: string|ArrayCallback<string>): Collection {
    let keyFactory: ArrayCallback<string>;

    if (typeof key === 'function') {
      keyFactory = <ArrayCallback<string>>key;
    } else {
      keyFactory = current => current[key];
    }

    const newCollection = this._items.reduce((newCollection, current, index, array) => {
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
  prepend(value: any): Collection {
    const items = <any[]>this.items;
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
  reduce(callback: ReduceCallback, carry: any = null): any {
    const items = <any[]>this.items;
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
  sort(compareFunction?: (a: any, b: any) => number): Collection {
    const items = (<any[]>this.items).sort(compareFunction);
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
  sortBy(key: string): Collection {
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
  sum(key?: string): number {
    let items: any[];

    if (key) {
      items = <any[]>this.pluck(key).getAll();
    } else {
      items = <any[]>this.items;
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
  reverse(): Collection {
    const items = <any[]>this.items;
    const indexes: number[] = [];

    for (let i = items.length - 1; i >= 0; i--) {
      indexes.push(i);
    }

    return new Collection(indexes.map(i => items[i]));
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
  unique(key?: string|UniqueCallback): Collection {
    let uniqueKey: UniqueCallback = (value: any): any => value;

    if (typeof key === 'string') {
      uniqueKey = (value: Object): any => value[key];
    } else if (typeof key === 'function') {
      uniqueKey = key;
    }

    const items: any[] = (<any[]>this.items).reduce((items: any[], value: any) => {
      const key: any = uniqueKey(value);

      if (!items.some(item => item.key === key)) {
        items.push({key, value});
      }

      return items;
    }, []);

    return new Collection(items.map(({value}) => value));
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
  where(key: string, value: any): Collection {
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
  whereIn(key: string, values: any[]): Collection {
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
  zip(...items: any[]): Collection {
    const arrayableItems = items.map(toArray);
    const zipped = this.reduce((zippedItems, currentItem, index) => {
      const value = arrayableItems.map(item => item[index]);
      value.unshift(currentItem);

      return [...zippedItems, value];
    }, []);

    return new Collection(zipped);
  }
}
