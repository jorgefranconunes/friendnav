/**************************************************************************
 *
 * Copyright (c) 2016-2017 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * Utility functions for working with traits.
 */
define(function () {

    /**
     * Extends an existing object with additional methods implemented
     * by the trait.
     *
     * If the object already has a method with the same name as a
     * trait method, then that method in the object WILL NOT be
     * overriden by the trait method.
     *
     * @param object The object that will receive additional methods.
     *
     * @param traitObject The object that implements the methods that
     * will be added to "object".
     *
     * @param traitMethodList List of the names of methods (String) of
     * "traitObject" that will be added to "object".
     */
    function extendWith(
        object,
        traitObject,
        traitMethodList) {

        // We WILL NOT override methods on the object that have the
        // same name as methods in the trait object. That means the
        // given object methods always override the trait methods.
        var isMethodOverridable = R.compose(R.not, R.hasIn(R.__, object));

        R.filter(isMethodOverridable, traitMethodList)
            .forEach(function ( methodName ) {
                var traitMethod = traitObject[methodName];
                var proxyMethod =  function () {
                    return traitMethod.apply(traitObject, arguments);
                };
                object[methodName] = proxyMethod;
            });
    }


    /**
     * Extends an existing object with additional methods implemented
     * by the trait. All the methods in the trait object which match
     * the given regular expression are added to the object.
     *
     * @param object The object that will receive additional methods.
     *
     * @param traitObject The object that implements the methods that
     * will be added to "object".
     *
     * @param traitMethodRegex Regular expression for methods names of
     * "traitObject" that will be added to "object".
     */
    function extendWithSome(
        object,
        traitObject,
        traitMethodRegex) {

        var predicate = traitMethodRegex.test.bind(traitMethodRegex);
        var traitMethodList = traitObject.keys().filter(predicate);

        extendWith(object, traitObject, traitMethodList);
    }


    var Traits = {
        extendWith : extendWith,
        extendWithSome : extendWithSome,
    };


    return Traits;
});
