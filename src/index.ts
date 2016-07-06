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

  merge(items: Collection|any[]): Collection {
    return new Collection(this._items.concat(toArray(items)));
  }

  forEach(callback: ArrayCallback<void>): void {
    Array.prototype.forEach.call(this._items.slice(), callback);
  }

  push(...values: any[]): Collection {
    return new Collection(this._items.concat(values));
  }

  map(callback: ArrayCallback<any>): Collection {
    const newItems = Array.prototype.map.call(this._items.slice(), callback);
    return new Collection(newItems);
  }

  filter(callback: ArrayCallback<boolean>): Collection {
    const newItems = Array.prototype.filter.call(this._items.slice(), callback);
    return new Collection(newItems);
  }

  reject(callback: ArrayCallback<boolean>): Collection {
    return this.filter(
      (currentValue: any, index: number, array: any[]) => !callback(currentValue, index, array)
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
   * @param keyName
   * @returns {Collection}
   */
  pluck(keyName: string): Collection {
    const items = this._items.map(item => item[keyName]);
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
}
