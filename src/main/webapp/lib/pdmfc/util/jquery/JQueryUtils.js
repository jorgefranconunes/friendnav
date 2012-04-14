/**************************************************************************
 *
 * Copyright (c) 2011-2012 PDMFC, All Rights Reserved.
 *
 **************************************************************************/

"use strict";

pdmfc.namespace("pdmfc.util.jquery");





/**************************************************************************
 *
 * Utilitye functions related with jQuery.
 *
 **************************************************************************/

pdmfc.util.jquery.JQueryUtils = (function() {

        var MessageFormat = pdmfc.util.text.MessageFormat;





/**************************************************************************
 *
 * The constructor.
 *
 **************************************************************************/

        function JQueryUtils() {

            throw "Private constructor...";
        }





/**************************************************************************
 *
 * Fetches a single jQuery element object, given a selector.
 *
 * If the selector matches no element or if it matches more than one
 * element then an exception is thrown.
 *
 * @param selector 
 *
 * @param context Optional.
 *
 **************************************************************************/

        function _getOne(selector,
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





/**************************************************************************
 *
 * Define the public static methods.
 *
 **************************************************************************/

        JQueryUtils.getOne = _getOne;





        return JQueryUtils;


    })();





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

