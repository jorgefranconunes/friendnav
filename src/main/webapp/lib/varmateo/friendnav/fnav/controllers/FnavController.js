/**************************************************************************
 *
 * Copyright (c) 2012-2016 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";

varmateo.namespace("varmateo.friendnav.fnav.controllers");





/**************************************************************************
 *
 * The controller for the outermost view of the FriendNav application.
 *
 **************************************************************************/

varmateo.friendnav.fnav.controllers.FnavController = (function() {

    var SimpleLogger = varmateo.util.logging.SimpleLogger;




    var COOKIE_ACCESS_TOKEN = "FnavAccessToken";

    FnavController.prototype._logger     = null;
    FnavController.prototype._fsqManager = null;
    FnavController.prototype._viewFnav   = null;

    FnavController.prototype._isLoggedIn              = false;
    FnavController.prototype._accessToken             = null;
    FnavController.prototype._callbackInitialUserNode = null;





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

    function FnavController (
        fsqManager,
        viewFnav ) {

        var self   = this;
        var logger = SimpleLogger.createFor("FnavController");

        logger.info("Seting up...");

        viewFnav.onLogoutSelected(function () {
            self._logoutSelectedEvent();
        });

        this._logger      = logger;
        this._fsqManager  = fsqManager;
        this._viewFnav    = viewFnav;
        this._accessToken = getCookieValue(COOKIE_ACCESS_TOKEN);
        this._isLoggedIn  = (this._accessToken != null );
    }





/**************************************************************************
 *
 * Decides which page view to show depending on the hash on the
 * current URL.
 *
 **************************************************************************/

    FnavController.prototype.initialize = function () {

        var hash           = window.location.hash;
        var newAccessToken = parseAccessTokenFromHash(hash);

        if ( newAccessToken != null ) {
            this._logger.info("New access token specified - {0}",
                              newAccessToken);

            setCookieValue(COOKIE_ACCESS_TOKEN, newAccessToken);
            this._accessToken = newAccessToken;
            this._isLoggedIn  = true;

            // Remove the hash with the access token from the URL
            // the browser is displaying.
            window.location.hash = "";
        } else {
            this._logger.info("No access token specified.");
        }

        if ( this._isLoggedIn ) {
            this._logger.info("User is signed in.");

            var self = this;

            this._fsqManager.setAccessToken(this._accessToken);
            this._fsqManager.retrieveSelfUserNode(function ( node ) {
                self._setSelfUserNode(node);
            });
        } else {
            this._logger.info("User is not yet signed in.");

            this._viewFnav.showPreLoginView();
        }
    }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

    FnavController.prototype.onInitialUserNode = function ( callback ) {

        this._callbackInitialUserNode = callback;
    }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

    FnavController.prototype._logoutSelectedEvent = function () {

        deleteCookie(COOKIE_ACCESS_TOKEN);

        this._accessToken = null;
        this._isLoggedIn  = false;

        this._viewFnav.showPreLoginView();
    }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

    FnavController.prototype._setSelfUserNode = function ( userNode ) {

        if ( userNode != null ) {
            this._logger.info("Received self user node:");
            this._logger.infoObj(userNode);

            this._viewFnav.showPostLoginView(userNode);

            var callback = this._callbackInitialUserNode;

            callback && callback(userNode);
        } else {
            this._logger.info("Failed to receive self user node...");
        }
    }





/**************************************************************************
 *
 * Retrieves the value of a cookie.
 *
 **************************************************************************/

    function getCookieValue ( cookieName ) {

        var cookieValue = jaaulde.utils.cookies.get(cookieName);

        return cookieValue;
    }





/**************************************************************************
 *
 * Retrieves the value of a cookie.
 *
 **************************************************************************/

    function setCookieValue (
        cookieName,
        cookieValue) {

        var now           = new Date();
        var expiration    =
            new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var cookieOptions = {
            expiration : expiration,
        };

        jaaulde.utils.cookies.set(cookieName, cookieValue, cookieOptions);
    }





/**************************************************************************
 *
 * Retrieves the value of a cookie.
 *
 **************************************************************************/

    function deleteCookie ( cookieName ) {

        jaaulde.utils.cookies.del(cookieName);
    }





/**************************************************************************
 *
 * Retrieves the value of the access token from the given hash, if it
 * is present.
 *
 **************************************************************************/

    function parseAccessTokenFromHash ( hash ) {

        var result = null;

        if ( hash != null ) {
            var prefix = "#access_token=";

            if ( hash.indexOf(prefix) == 0 ) {
                result = hash.substring(prefix.length);
            } else {
                // Hash does not contain the access token.
            }
        }

        return result;
    }





        return FnavController;

})();

