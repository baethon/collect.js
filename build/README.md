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

