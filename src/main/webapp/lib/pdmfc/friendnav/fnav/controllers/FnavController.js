/**************************************************************************
 *
 * Copyright (c) 2012 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";

pdmfc.namespace("pdmfc.friendnav.fnav.controllers");





/**************************************************************************
 *
 * The controller for the outermost view of the FriendNav application.
 *
 **************************************************************************/

pdmfc.friendnav.fnav.controllers.FnavController = (function() {

        var SimpleLogger = pdmfc.util.logging.SimpleLogger;




        var COOKIE_ACCESS_TOKEN = "FnavAccessToken";

        FnavController.prototype._logger         = null;
        FnavController.prototype._viewFnav       = null;

        FnavController.prototype._isLoggedIn  = false;
        FnavController.prototype._accessToken = null;





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        function FnavController ( viewFnav ) {

            var logger = SimpleLogger.createFor("FnavController");

            logger.info("Seting up...");

            this._logger   = logger;
            this._viewFnav = viewFnav;
            this._accessToken = getCookieValue(COOKIE_ACCESS_TOKEN);
            this._isLoggedIn  = (this._accessToken != null );
        }





/**************************************************************************
 *
 * Decides which page view to show depending on the hash on the
 * current URL.
 *
 **************************************************************************/

        FnavController.prototype.initialize =
        function () {

            var hash           = window.location.hash;
            var newAccessToken = parseAccessTokenFromHash(hash);

            if ( newAccessToken != null ) {
                this._logger.info("New access token specified - {0}",
                                  newAccessToken);

                setCookieValue(COOKIE_ACCESS_TOKEN, newAccessToken);
                this._accessToken = newAccessToken;
                this._isLoggedIn  = true;
            } else {
                this._logger.info("No access token specified.");
            }

            if ( this._isLoggedIn ) {
                this._logger.info("User is signed in.");

                this._viewFnav.showPostLoginView();
            } else {
                this._logger.info("User is not yet signed in.");

                this._viewFnav.showPreLoginView();
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

        function setCookieValue ( cookieName,
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





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

