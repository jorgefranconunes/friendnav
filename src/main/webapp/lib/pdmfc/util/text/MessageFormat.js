/**************************************************************************
 *
 * Copyright (c) 2011-2012 PDMFC, All Rights Reserved.
 *
 **************************************************************************/

"use strict";

pdmfc.namespace("pdmfc.util.text");





/**************************************************************************
 *
 * Provides utility functions for formating messages.
 *
 **************************************************************************/

pdmfc.util.text.MessageFormat = (function() {





/**************************************************************************
 *
 * The constructor.
 *
 **************************************************************************/

        function MessageFormat() {

            throw "MessageFormat private constructor...";
        }





/**************************************************************************
 *
 * First argument is format string. Remaining arguments are formating
 * arguments.
 *
 **************************************************************************/

        function _format() {

            var fmt     = arguments[0];
            var fmtArgs = Array.prototype.slice.call(arguments, 1);
            var getter  = function() {
                return fmtArgs[arguments[1]];
            }
            var result  = fmt.replace(/\{(\d+)\}/g, getter);

            return result;
        }





/**************************************************************************
 *
 * Define the public static methods.
 *
 **************************************************************************/

        MessageFormat.format = _format;





        return MessageFormat;


    })();





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

