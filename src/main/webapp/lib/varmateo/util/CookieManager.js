/**************************************************************************
 *
 * Copyright (c) 2017 Jorge Nunes All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 *
*/
define(function ( require ) {

    var CookieHandler = require("varmateo/util/CookieHandler");


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
