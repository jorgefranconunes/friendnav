/**************************************************************************
 *
 * Copyright (c) 2012 PDMFC, All Rights Reserved.
 *
 **************************************************************************/

"use strict";

pdmfc.namespace("pdmfc.friendnav.fnav.views.friends");





/**************************************************************************
 *
 * The view for the page displaying the friend navigator widget and
 * the map with the social network connections.
 *
 **************************************************************************/

pdmfc.friendnav.fnav.views.friends.FriendsBrowserPageView = (function() {

        var SimpleLogger = pdmfc.util.logging.SimpleLogger;
        var JQueryUtils  = pdmfc.util.jquery.JQueryUtils;





        FriendsBrowserPageView.prototype._logger       = null;
        FriendsBrowserPageView.prototype._panel        = null;
        FriendsBrowserPageView.prototype._callbackShow = null;





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        function FriendsBrowserPageView ( panelId ) {

            var logger = SimpleLogger.createFor("FriendsBrowserPageView");

            logger.info("Seting up with panel \"{0}\"...", panelId);

            this._logger      = logger;
            this._panel       = JQueryUtils.getOne(panelId);
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        FriendsBrowserPageView.prototype.getElement =
        function () {

            var result = this._panel;

            return result;
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        FriendsBrowserPageView.prototype.showEvent =
        function ( isVisible ) {

            this._logger.info("View is now {0}",
                              (isVisible ? "shown" : "hidden"));

            var callback = this._callbackShow;

            callback && calback(isVisible);
        }





/**************************************************************************
 *
 * Defines the callback for the "show" event.
 *
 **************************************************************************/

        FriendsBrowserPageView.prototype.onShow =
        function ( callback ) {

            this._callbackShow = callback;
        }





        return FriendsBrowserPageView;

    })();





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

