/**************************************************************************
 *
 * Copyright (c) 2016-2017 Jorge Nunes All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 *
*/
define(function () {


    Memoizer.prototype._fetchersByName = null;


    /**
     * The `configList` argument is a list of objects. Each object
     * must contain the following keys:
     *
     * * `name` - The bean name. A method called `get${name}` will be
     *    added to the memoizer.
     *
     * * `builder` - Function for creating an instance of the bean.
     */
    function Memoizer ( configList ) {

        this._fetchersByName = configList.map(this._buildFetcher, this);

        this._fetchersByName = {};
        configList.forEach(function ( config ) {
            this._fetchersByName[config.name] = this._buildFetcher(config);
        }, this);
    }


    /**
     *
     */
    Memoizer.prototype._buildFetcher = function ( config ) {

        var self = this;
        var fetcher = function () {
            var instance = config.builder();
            self._fetchersByName[config.name] = function () { return instance; };
            return instance;
        };

        return fetcher;
    }


    /**
     * Adds to the given object a collection of methods named
     * `get${name}`, where the names were passed to the constructor of
     * this memoizer.
     *
     * @param object The object to be extended with new methods.
     */
    Memoizer.prototype.extendTo = function ( object ) {

        var self = this;

        Object.keys(this._fetchersByName).forEach(function ( name ) {
            var method = function () {
                return self._fetchersByName[name]();
            };
            var methodName = "get" + name;

            object[methodName] = method;
        });
    }


    return Memoizer;
});
