export function collect(items: any[]): Collection {
  return new Collection(items);
}

export type CollectionArray = Collection|any[];

export interface ArrayCallback<T> {
  (currentValue: any, index?: number, array?: any[]): T;
}

export class Collection {
  private _items: any[];

  constructor(items: CollectionArray) {
    if (items instanceof Collection) {
      items = (<Collection>items).getAll();
    }

    if (!Array.isArray(items)) {
      throw new Error('Passed items are not valid array');
    }

    this._items = Array.from(<any[]>items);
  }

  getAll(): any[] {
    return this._items.slice();
  }

  get items() {
    return this.getAll();
  }

  merge(items: CollectionArray): Collection {
    if (items instanceof Collection) {
      items = (<Collection>items).getAll();
    }

    return new Collection(this._items.concat(items));
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

  ifEmpty(callback: () => CollectionArray): Collection {
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
    let items = this.getAll();

    if (keyName) {
      items = this.getAll().map(item => item[keyName]);
    }

    const sum = items.reduce((sum, current) => sum + current, 0);
    return sum / items.length;
  }
}
