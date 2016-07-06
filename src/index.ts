export function collect(items: any[]): Collection {
  return new Collection(items);
}

const isArrayable = (value: any) => value instanceof Collection || Array.isArray(value);
const toArray = (value: any)=> value instanceof Collection ? value.getAll() : Array.from(value);
const isObject = (value: any) => Object.prototype.toString.call(value) === '[object Object]';

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
    const items = (<any[]>this.getAll()).reduce((flatArray, current) => flatArray.concat(current), []);
    return new Collection(items);
  }
}
