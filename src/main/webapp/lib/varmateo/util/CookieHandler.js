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

"varmateo.util.CookieHandler",

function() {


    CookieHandler.prototype._cookieName = null;


    /**
     * Manages one single cookie.
     */
    function CookieHandler (cookieName) {

        this._cookieName = cookieName;
    }


    /**
     *
     */
    CookieHandler.prototype.get = function () {

        return jaaulde.utils.cookies.get(this._cookieName);
    }


    /**
     *
     */
    CookieHandler.prototype.set = function ( cookieValue ) {

        var now = new Date();
        var expiration =
            new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var cookieOptions = {
            expiration : expiration,
        };

        jaaulde.utils.cookies.set(this._cookieName, cookieValue, cookieOptions);
    }


    /**
     * 
     */
    CookieHandler.prototype.remove = function () {

        jaaulde.utils.cookies.del(this._cookieName);
    }


    return CookieHandler;
});
