/**************************************************************************
 *
 * Copyright (c) 2012-2016 Jorge Nunes All Rights Reserved.
 *
 **************************************************************************/

"use strict";

var varmateo = window.varmateo || {};





/**************************************************************************
 *
 * Function for defining a namespace. If the namespace already exists
 * then it has no effect.
 *
 * @param packageName The fully qualified name for the namespace to be
 * created.
 *
 **************************************************************************/

varmateo.namespace = (function() {





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

    function _createNamespace ( packageName ) {

        var object   = null;
        var context  = window;
        var itemList = packageName.split(".");

        for ( var i=0, size=itemList.length; i<size; ++i ) {
            var item       = itemList[i];
            var thePackage = context[item];

            if ( thePackage === undefined ) {
                thePackage    = {}
                context[item] = thePackage;
            }

            context = thePackage;
        }
    }





    return _createNamespace;

})();

