/**************************************************************************
 *
 * Copyright (c) 2016 Jorge Nunes All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * Utility functions for working with traits.
 */
varmateo.defineClass(

"varmateo.util.Traits",

function() {


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

        for ( var i=0, count=traitMethodList.length; i<count; ++i ) {
            var methodName  = traitMethodList[i];

            if ( methodName in object ) {
                // The given object already has a method with that
                // name. We WILL NOT override that object method with
                // the corresponding trait method.
            } else {
                var traitMethod = traitObject[methodName];

                var proxyMethod =  (function ( traitMethod ) {
                    return function () {
                        var result = traitMethod.apply(traitObject, arguments);
                        return result;
                    }
                })(traitMethod);

                object[methodName] = proxyMethod;
            }
        }
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
