# @baethon/collect

This package is supposed to be immutable, eventually consistent (let's say heavily inspired), clone of Laravel's support class for [collections](https://laravel.com/docs/master/collections).

## Installation

```
npm install --save @baethon/collect
```

## Requirements

Package is compiled to ES5 so it can be used almost in every environment.  
It may be required to install [es5-shim](https://github.com/es-shims/es5-shim).

## Development

To execute tests run:

```
npm test
```

This will run TSLint with Mocha unit tests.

To execute unit tests run:

```
npm run mocha
```

To compile library (note that compiled sources are not comitted to repo):

```
npm run lib
```

To generate API docs run:

```
npm run docs
```

## Functions

### collect(items) 

Creates new Collection instance

```js
import {collect} from '@baethon/collect';

const collection = collect([1, 2, 3]);
```

**Returns**: `Collection`

## Class: Collection

### Collection.getAll() 

Returns array/object stored inside Collection instance

**Returns**: `any`
### Collection.keys() 

Returns all of the collection keys

**Returns**: `Collection`
### Collection.values() 

Returns all values of collection

```js
collect({name: 'Jon'}).values();
// Collection of ['Jon']

collect([1, 2, 3]).values();
// Collection of [1, 2, 3]
```

**Returns**: `Collection`
### Collection.merge(items) 

Merges the given array into the collection:

```js
collect([1, 2, 3]).merge([4, 5, 6]);
// Collection of [1, 2, 3, 4, 5, 6]
```

**Returns**: `Collection`
### Collection.forEach(callback) 

Iterates over the items in the collection and passes each item to a given callback:

```js
const collection = collect([1, 2, 3]).forEach(item => console.log(item));
// Collection of [1, 2, 3]
```

**Returns**: `Collection`
### Collection.push(values) 

Puts given values at the end of array

```js
collect([1, 2, 3]).push(4, 5, 6);
// Collection of [1, 2, 3, 4, 5, 6]
```

**Returns**: `Collection`
### Collection.map(callback) 

Iterates through the collection and passes each value to the given callback.
The callback is free to modify the item and return it,
thus forming a new collection of modified items:

```js
collect([1, 2, 3]).map(item => item + 1);
// Collection of [2, 3, 4]
```

**Returns**: `Collection`
### Collection.filter(predicate) 

Returns collections of items matching given predicate:

```js
collect([1, 2, 3]).filter(i => i % 2 === 0);
// Collection of [2]
```

**Returns**: `Collection`
### Collection.reject(predicate) 

Returns collection of items not matching given predicate:

```js
collect([1, 2, 3]).reject(i => i % 2 === 0);
// Collection of [1, 3]
```

**Returns**: `Collection`
### Collection.avg(keyName) 

Return average value of all items in collection

```js
collect([1, 2, 3]).avg();
// 2
```

If the collection contains nested objects, keyName is required
to use for determining which values to calculate the average:

```js
const collection = collect([
  {name: 'JavaScript: The Good Parts', pages: 176},
  {name: 'JavaScript: The Definitive Guide', pages: 1096},
]);

collection.avg('pages');
// 636
```

**Returns**: `number`
### Collection.collapse() 

Collapse array of collections into flat collection

```js
collect([[1, 2], [3, 4]]).collapse();
// Collection of [1, 2, 3, 4]
```

### Collection.combine(values) 

Combines the keys of the collection with the values of another array or collection

```js
collect(['name', 'age']).combine(['Jon', 16]);
// Collection of { name: 'Jon', age: 16 }
```

**Returns**: `Collection`
### Collection.pluck(valuesName, keyName) 

Retrieves all of the collection values for a given key:

```js
collect([{name: 'Jon'}, {name: 'Arya'}]).pluck('name');
// Collection of ['Jon', 'Arya']
```

You may also specify how you wish the resulting collection to be keyed:

```js
collect([{name: 'Jon', house: 'Stark'}]).pluck('name', 'house');
// Collection of {Stark: 'Jon'}
```

**Returns**: `Collection`
### Collection.except(keys) 

Returns all items in the collection except for those with the specified keys:

```js
const collection = collect({productId: 1, name: 'Desk', price: 100, discount: false});
const filtered = collection.except(['price', 'discount']);
filtered.all();
// Collection of {productId: 1, name: 'Desk'}
```

**Returns**: `Collection`
### Collection.flatMap(callback) 

Iterates through the collection and passes each value to the given callback.
The callback is free to modify the item and return it,
thus forming a new collection of modified items.

Then, the array is flattened by a level:

```js
const people = collect([
   {name: 'Jon', titles: ['King of the North', 'Knower of nothing']},
   {name: 'Arya', titles: ['Little assasin']}
]);

const titles = people.flatMap(person => person.titles);
// Collection of ['King of the North', 'Knower of nothing', 'Little assasin']
```

**Returns**: `Collection`
### Collection.groupBy(key) 

Groups the collection's items by a given key:

```js
const collection = collect([
   { house: 'Stark', name: 'Jon' },
   { house: 'Stark', name: 'Arrya' },
]);

const byHouse = collection.groupBy('house');
// Collection of {
//   Stark: [
//     { house: 'Stark', name: 'Jon' },
//     { house: 'Stark', name: 'Arrya' },
//   ],
// }
```

In addition to passing a string `key`, it's possible to pass a callback.
The callback should return the value you wish to key the group by:

```js
const collection = collect([
   { house: 'Stark', name: 'Jon' },
   { house: 'Stark', name: 'Arrya' },
]);

const byHouse = collection.groupBy(person => person.house.toUpperCase());
// Collection of {
//   STARK: [
//     { house: 'Stark', name: 'Jon' },
//     { house: 'Stark', name: 'Arrya' },
//   ],
// }
```

**Returns**: `Collection`
### Collection.has(key) 

Determines if a given key exists in the collection:

```js
collect({name: 'Jon'}).has('name');
// true
```

### Collection.implode(key, glue) 

Join the items in a collection.

Arguments depend on the type of items in the collection.

If the collection contains array of objects,
you should pass the key of the attributes you wish to join,
and the "glue" string you wish to place between the values:

```js
collect([{name: 'Jon'}, {name: 'Arya'}]).implode('name', ', ');
// Jon, Arya
```

If the collection contains simple strings or numeric values,
simply pass the "glue" as the only argument to the method:

```js
collect(['Jon', 'Arya']).implode(', ');
// Jon, Arya
```

**Returns**: `string`
### Collection.keyBy(key) 

Keys the collection by the given key:

```js
let collection = collect([
   {productId: 'prod-100', name: 'desk'},
   {productId: 'prod-200', name: 'table'},
]);

collection.keyBy('productId');
// Collection of {
//   'prod-100': {productId: 'prod-100', name: 'desk'},
//   'prod-200': {productId: 'prod-200', name: 'table'},
// }
```

If multiple items have the same key, only the last one will appear in the new collection.

You may also pass your own callback, which should return the value to key the collection by:

```js
collection.keyBy(item => item.productId.toUpperCase());
// Collection of {
//   'PROD-100': {productId: 'prod-100', name: 'desk'},
//   'PROD-200': {productId: 'prod-200', name: 'table'},
// }
```

**Returns**: `Collection`
### Collection.prepend(value) 

Add an item to the beginning of the collection

**Returns**: `Collection`
### Collection.reduce(callback, carry) 

Reduce the collection to a single value,
passing the result of each iteration into the subsequent iteration:

```js
collect([1, 2, 3]).reduce((carry, current) => {
   return carry ? carry + current : current;
});
// 6
```

The value for carry on the first iteration is null;
however, its initial value can be specified by passing a second argument to reduce:

```js
collect([1, 2, 3]).reduce((carry, current) => carry + current, 0);
// 6
```

**Returns**: `any`
### Collection.sort(compareFunction) 

Sort collection with given compareFunction.

```js
collect([3, 5, 1]).sort((a, b) => b-a);
// Collection of [5, 3, 1]
```

If compareFunction is omitted, the array is sorted according to each character's
Unicode code point value, according to the string conversion of each element.

```js
collect([3,5,1]).sort();
// Collection of [1, 3, 5]
```

**Returns**: `Collection`
### Collection.sortBy(key) 

Sort the collection by the given key

```js
const collection = collect([
   {name: 'Desk', price: 200},
   {name: 'Chair', price: 100},
   {name: 'Bookcase', price: 150},
]);

const sorted = collection.sortBy('price');
// Collection of [
//    {name: 'Chair', price: 100},
//    {name: 'Bookcase', price: 150},
//    {name: 'Desk', price: 200},
// ]
```

**Returns**: `Collection`
### Collection.sum(key) 

Return the sum of all items in the collection:

```js
collect([1, 2, 3]).sum();
// 6
```

If the collection contains nested objects,
a key to use for determining which values to sum should be passed:

```js
collect([
   {name: 'Desk', price: 200},
   {name: 'Chair', price: 100},
   {name: 'Bookcase', price: 150},
]).sum('price');
// 450
```

**Returns**: `number`
### Collection.reverse() 

Reverse the order of the collection's items:

```js
collect([1, 2, 3]).revese();
// Collection of [3, 2, 1]
```

**Returns**: `Collection`
### Collection.unique(key) 

Return all of the unique items in the collection:

```js
collect([1, 1, 2, 2, 3, 4, 2]).unique();
// Collection of [1, 2, 3, 4]
```

When dealing with nested objects,
it's possible to specify the key used to determine uniqueness:

```js
const collection = collect([
   {name: 'iPhone 6', brand: 'Apple', type: 'phone'},
   {name: 'iPhone 5', brand: 'Apple', type: 'phone'},
   {name: 'Apple Watch', brand: 'Apple', type: 'watch'},
   {name: 'Galaxy S6', brand: 'Samsung', type: 'phone'},
   {name: 'Galaxy Gear', brand: 'Samsung', type: 'watch'},
]);

collection.unique('brand');
// Collection of [
//   {name: 'iPhone 6', brand: 'Apple', type: 'phone'},
//   {name: 'Galaxy S6', brand: 'Samsung', type: 'phone'},
// ]
```

It's also possible to pass own callback to determine item uniqueness:

```js
collection.unique(item => `${item.brand}${item.type}`);
// Collection of [
//   {name: 'iPhone 6', brand: 'Apple', type: 'phone'},
//   {name: 'Apple Watch', brand: 'Apple', type: 'watch'},
//   {name: 'Galaxy S6', brand: 'Samsung', type: 'phone'},
//   {name: 'Galaxy Gear', brand: 'Samsung', type: 'watch'},
// ]
```

**Returns**: `Collection`
### Collection.where(key, value) 

Filters the collection by a given key / value pair:

```js
const collection = collect([
   {product: 'Desk', price: 200},
   {product: 'Chair', price: 100},
   {product: 'Bookcase', price: 150},
   {product: 'Door', price: 100},
]);

collection.where('price', 100);
// Collection of [
//   {product: 'Chair', price: 100},
//   {product: 'Door', price: 100},
// ]
```

Method uses strict comparisons when checking item values.

**Returns**: `Collection`
### Collection.whereIn(key, values) 

Filters the collection by a given key / value contained within the given array:

```js
const collection = collect([
   {product: 'Desk', price: 200},
   {product: 'Chair', price: 100},
   {product: 'Bookcase', price: 150},
   {product: 'Door', price: 100},
]);

collection.whereIn('price', [100, 150]);
// Collection of [
//   {product: 'Chair', price: 100},
//   {product: 'Bookcase', price: 150},
//   {product: 'Door', price: 100},
// ]
```

Method uses strict comparisons when checking item values.

**Returns**: `Collection`
### Collection.zip(items) 

Merges together the values of the given array
with the values of the collection at the corresponding index:

```js
const collection = collect(['Chair', 'Desk']);
const zipped = collection.zip([100, 200]);
// Collection of [['Chair', 100], ['Desk', 200]]
```



