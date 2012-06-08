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

        var UserNodeNavigatorView =
            pdmfc.friendnav.fnav.views.friends.UserNodeNavigatorView;





        FriendsBrowserPageView.prototype._logger        = null;
        FriendsBrowserPageView.prototype._panel         = null;
        FriendsBrowserPageView.prototype._callbackShow  = null;
        FriendsBrowserPageView.prototype._viewNavigator = null;





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        function FriendsBrowserPageView ( panelId ) {

            var logger = SimpleLogger.createFor("FriendsBrowserPageView");

            logger.info("Seting up with panel \"{0}\"...", panelId);

            var viewNavigator = new UserNodeNavigatorView(panelId);

            this._logger        = logger;
            this._panel         = JQueryUtils.getOne(panelId);
            this._viewNavigator = viewNavigator;
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





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        FriendsBrowserPageView.prototype.onUserNodeSelected =
        function ( callback ) {

            this._viewNavigator.onUserNodeSelected(callback);
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        FriendsBrowserPageView.prototype.onBack =
        function ( callback ) {

            this._viewNavigator.onBack(callback);
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        FriendsBrowserPageView.prototype.setInitialUserNode =
        function ( userNode ) {

            this._viewNavigator.setInitialUserNode(userNode);
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        FriendsBrowserPageView.prototype.setUserNode =
        function ( userNode ) {

            this._viewNavigator.setUserNode(userNode);
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        FriendsBrowserPageView.prototype.setFriendsList =
        function ( userId,
                   userNodeList ) {

            this._viewNavigator.setFriendsList(userId, userNodeList);
        }





        return FriendsBrowserPageView;

    })();





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

