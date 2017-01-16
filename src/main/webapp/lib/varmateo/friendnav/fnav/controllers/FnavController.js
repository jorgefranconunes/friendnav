/**************************************************************************
 *
 * Copyright (c) 2012-2017 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * The controller for the outermost view of the FriendNav application.
 */
varmateo.defineClass(

"varmateo.friendnav.fnav.controllers.FnavController",

function() {

    var Logger = varmateo.load("varmateo.util.logging.Logger");


    var COOKIE_ACCESS_TOKEN = "FnavAccessToken";

    FnavController.prototype._log = null;
    FnavController.prototype._friendsFacade = null;
    FnavController.prototype._viewFnav = null;
    FnavController.prototype._cookie = null;

    FnavController.prototype._isLoggedIn = false;
    FnavController.prototype._accessToken = null;
    FnavController.prototype._callbackInitialUserNode = null;


    /**
     *
     */
    function FnavController (
        friendsFacade,
        viewFnav,
        cookieManager ) {

        var logger = Logger.createFor("FnavController");

        logger.info("Seting up...");

        viewFnav.setOnLogoutSelectedListener(this._onLogoutSelected.bind(this));

        this._log = logger;
        this._friendsFacade = friendsFacade;
        this._viewFnav = viewFnav;
        this._cookie = cookieManager.getCookie(COOKIE_ACCESS_TOKEN);
        this._accessToken = null;
        this._isLoggedIn  = null;
    }


    /**
     * Decides which page view to show depending on the hash on the
     * current URL.
     */
    FnavController.prototype.initialize = function () {

        this._accessToken = this._cookie.get();
        this._isLoggedIn  = (this._accessToken != null );

        var hash           = window.location.hash;
        var newAccessToken = parseAccessTokenFromHash(hash);

        if ( newAccessToken != null ) {
            this._log.info(
                "New access token specified - {0}",
                newAccessToken);

            this._cookie.set(newAccessToken);
            this._accessToken = newAccessToken;
            this._isLoggedIn  = true;

            // Remove the hash with the access token from the URL
            // the browser is displaying.
            window.location.hash = "";
        } else {
            this._log.info("No access token specified.");
        }

        if ( this._isLoggedIn ) {
            this._log.info("User is signed in.");

            this._friendsFacade.setAccessToken(this._accessToken);
            this._friendsFacade.retrieveSelfUserNode()
                .then(this._onSetSelfUserNode.bind(this))
                .fail(this._onFailSetSelfUserNode.bind(this));
        } else {
            this._log.info("User is not yet signed in.");

            this._viewFnav.showPreLoginView();
        }
    }


    /**
     *
     */
    FnavController.prototype.setOnInitialUserNodeListener = function (
        callback ) {

        this._callbackInitialUserNode = callback;
    }


    /**
     *
     */
    FnavController.prototype._onLogoutSelected = function () {

        this._cookie.remove();

        this._accessToken = null;
        this._isLoggedIn  = false;

        this._viewFnav.showPreLoginView();
    }


    /**
     *
     */
    FnavController.prototype._onSetSelfUserNode = function ( userNode ) {

        if ( userNode != null ) {
            this._log.info("Received self user node:");
            this._log.infoObj(userNode);

            this._viewFnav.showPostLoginView(userNode);

            var callback = this._callbackInitialUserNode;

            callback && callback(userNode);
        } else {
            this._log.info("Failed to receive self user node...");
        }
    }


    /**
     *
     */
    FnavController.prototype._onFailSetSelfUserNode = function ( error ) {

        this._log.info("Failed to receive self user node - {0}", error);
    }


    /**
     * Retrieves the value of the access token from the given hash, if
     * it is present.
     */
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
});
