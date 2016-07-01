"use strict";
function collect(items) {
    return new Collection(items);
}
exports.collect = collect;
var Collection = (function () {
    function Collection(items) {
        if (items instanceof Collection) {
            items = items.getAll();
        }
        if (!Array.isArray(items)) {
            throw new Error('Passed items are not valid array');
        }
        this._items = Array.from(items);
    }
    Collection.prototype.getAll = function () {
        return this._items.slice();
    };
    Object.defineProperty(Collection.prototype, "items", {
        get: function () {
            return this.getAll();
        },
        enumerable: true,
        configurable: true
    });
    Collection.prototype.merge = function (items) {
        if (items instanceof Collection) {
            items = items.getAll();
        }
        return new Collection(this._items.concat(items));
    };
    Collection.prototype.forEach = function (callback) {
        Array.prototype.forEach.call(this._items.slice(), callback);
    };
    Collection.prototype.push = function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i - 0] = arguments[_i];
        }
        return new Collection(this._items.concat(values));
    };
    Collection.prototype.map = function (callback) {
        var newItems = Array.prototype.map.call(this._items.slice(), callback);
        return new Collection(newItems);
    };
    Collection.prototype.filter = function (callback) {
        var newItems = Array.prototype.filter.call(this._items.slice(), callback);
        return new Collection(newItems);
    };
    Collection.prototype.reject = function (callback) {
        return this.filter(function (currentValue, index, array) { return !callback(currentValue, index, array); });
    };
    Collection.prototype.ifEmpty = function (callback) {
        if (this._items.length) {
            return this;
        }
        var result = callback();
        try {
            return new Collection(result);
        }
        catch (e) {
            return null;
        }
    };
    return Collection;
}());
exports.Collection = Collection;
//# sourceMappingURL=index.js.map