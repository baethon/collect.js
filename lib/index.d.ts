export declare function collect(items: any[]): Collection;
export declare type CollectionArray = Collection | any[];
export interface ArrayCallback<T> {
    (currentValue: any, index?: number, array?: any[]): T;
}
export declare class Collection {
    private _items;
    constructor(items: CollectionArray);
    getAll(): any[];
    items: any[];
    merge(items: CollectionArray): Collection;
    forEach(callback: ArrayCallback<void>): void;
    push(...values: any[]): Collection;
    map(callback: ArrayCallback<any>): Collection;
    filter(callback: ArrayCallback<boolean>): Collection;
    reject(callback: ArrayCallback<boolean>): Collection;
    ifEmpty(callback: () => CollectionArray): Collection;
}
