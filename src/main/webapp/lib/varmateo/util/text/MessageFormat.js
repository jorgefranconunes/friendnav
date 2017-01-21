/**************************************************************************
 *
 * Copyright (c) 2011-2017 Jorge Nunes All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * Provides utility functions for formating messages.
 */
define(function () {


    /**
     *
     */
    function MessageFormat() {
        throw "MessageFormat private constructor...";
    }


    /**
     * First argument is the format string. Remaining arguments are
     * formating arguments.
     */
    function format() {

        var fmt     = arguments[0];
        var fmtArgs = Array.prototype.slice.call(arguments, 1);
        var getter  = function() {
            return fmtArgs[arguments[1]];
        }
        var result  = fmt.replace(/\{(\d+)\}/g, getter);

        return result;
    }


    /**
     * Class static methods.
     */
    MessageFormat.format = format;


    return MessageFormat;
});
