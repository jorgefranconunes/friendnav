/**************************************************************************
 *
 * Copyright (c) 2017 Jorge Nunes All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 *
*/
varmateo.defineClass(

"varmateo.util.CookieManager",

function() {

    var CookieHandler = varmateo.load("varmateo.util.CookieHandler");


    /**
     * 
     */
    function CookieManager () {
        // Nothing to do...
    }


    /**
     *
     */
    CookieManager.prototype.getCookie = function ( cookieName ) {

        return new CookieHandler(cookieName);
    }


    return CookieManager;
});
