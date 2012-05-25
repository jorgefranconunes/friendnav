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

        var UserNodeDetailView =
            pdmfc.friendnav.fnav.views.friends.UserNodeDetailView;
        var UserNodeListView =
            pdmfc.friendnav.fnav.views.friends.UserNodeListView;





        FriendsBrowserPageView.prototype._logger             = null;
        FriendsBrowserPageView.prototype._panel              = null;
        FriendsBrowserPageView.prototype._callbackShow       = null;
        FriendsBrowserPageView.prototype._viewUserNodeDetail = null;
        FriendsBrowserPageView.prototype._viewUserNodeList   = null;

        // The ID of the user node currently being displayed.
        FriendsBrowserPageView.prototype._currentUserNodeId = null;





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        function FriendsBrowserPageView ( panelId ) {

            var logger = SimpleLogger.createFor("FriendsBrowserPageView");

            logger.info("Seting up with panel \"{0}\"...", panelId);

            var viewUserNodeDetail = new UserNodeDetailView(panelId + "Detail");
            var viewUserNodeList   = new UserNodeListView(panelId + "List");

            this._logger             = logger;
            this._panel              = JQueryUtils.getOne(panelId);
            this._viewUserNodeDetail = viewUserNodeDetail;
            this._viewUserNodeList   = viewUserNodeList;
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

        FriendsBrowserPageView.prototype.setInitialUserNode =
        function ( userNode ) {

            this._logger.info("Showing initial node for {0} {1} ({2})",
                              userNode.firstName,
                              userNode.lastName,
                              userNode.id);

            this._currentUserNodeId = userNode.id;

            this._viewUserNodeDetail.setUserNode(userNode);
            this._viewUserNodeList.clear();
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        FriendsBrowserPageView.prototype.setFriendsList =
        function ( userId,
                   userNodeList ) {

            var currentUserNodeId = this._currentUserNodeId;

            if ( currentUserNodeId == userId ) {
                this._viewUserNodeList.setUserNodeList(userNodeList);
            } else {
                this._logger.info("Friends list for user {0} ignored...",
                                  userId);
            }
        }





        return FriendsBrowserPageView;

    })();





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

