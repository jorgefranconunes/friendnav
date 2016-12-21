/**************************************************************************
 *
 * Copyright (c) 2011-2016 Jorge Nunes All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * Provides utility functions for formating messages.
 */
varmateo.defineClass(

"varmateo.util.text.MessageFormat",

function() {


    /**
     *
     */
    function MessageFormat() {
        throw "MessageFormat private constructor...";
    }


    /**
     * First argument is format string. Remaining arguments are
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
     * Static methods.
     */
    MessageFormat.format = format;


    return MessageFormat;
});
