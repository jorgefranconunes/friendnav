/**************************************************************************
 *
 * Copyright (c) 2011-2016 Jorge Nunes All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * Utility functions related with jQuery.
 */
varmateo.defineClass(

"varmateo.util.jquery.JQueryUtils",

function() {

    var MessageFormat = varmateo.util.text.MessageFormat;


    /**
     *
     */
    function JQueryUtils() {
        throw "Private constructor...";
    }


    /**
     * Fetches a single jQuery element object, given a selector.
     *
     * If the selector matches no element or if it matches more than
     * one element then an exception is thrown.
     *
     * @param selector 
     *
     * @param context Optional.
     */
    function getOne(
        selector,
        context) {

        var jQueryElementSet = $(selector, context);
        var setSize          = jQueryElementSet.size();

        if ( setSize != 1 ) {
            var msgFmt = null;

            if ( setSize == 0 ) {
                msgFmt = "Selector \"{0}\" matches no elements";
            } else {
                msgFmt = "Selector \"{0}\" matches {1} elements";
            }

            var msg = MessageFormat.format(msgFmt, selector, setSize);

            throw msg;
        }

        return jQueryElementSet;
    }


    /**
     * Static methods.
     */
    JQueryUtils.getOne = getOne;


    return JQueryUtils;
});
