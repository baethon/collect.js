# @baethon/collect

This package is supposed to be immutable, eventually consistent (let's say heavily inspired) clone of Laravel's support class for [collections](https://laravel.com/docs/master/collections).

## Installation

```
npm install --save @baethon/collect
```

## Requirements

Package is compiled to ES5 so it can be used almost in every environment.  
It may be required to install [es5-shim](https://github.com/es-shims/es5-shim).

## Development

TSLint and Mocha unit tests:

```
npm test
```

Library compilation (compiled sources are not commited to repo):

```
npm run lib
```

Generate API docs:

```
npm run docs
```
