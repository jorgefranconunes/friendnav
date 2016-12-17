/**************************************************************************
 *
 * Copyright (c) 2012-2016 Jorge Nunes All Rights Reserved.
 *
 **************************************************************************/

"use strict";

varmateo.namespace("varmateo.friendnav.fnav.views.friends");





/**************************************************************************
 *
 * The view for the page displaying the friend navigator widget and
 * the map with the social network connections.
 *
 **************************************************************************/

varmateo.friendnav.fnav.views.friends.UserNodeNavigatorView = (function() {

    var SimpleLogger = varmateo.util.logging.SimpleLogger;
    var JQueryUtils  = varmateo.util.jquery.JQueryUtils;

    var UserNodeDetailView =
        varmateo.friendnav.fnav.views.friends.UserNodeDetailView;
    var UserNodeListView =
        varmateo.friendnav.fnav.views.friends.UserNodeListView;





    UserNodeNavigatorView.prototype._logger             = null;
    UserNodeNavigatorView.prototype._panel              = null;
    UserNodeNavigatorView.prototype._callbackShow       = null;
    UserNodeNavigatorView.prototype._viewUserNodeDetail = null;
    UserNodeNavigatorView.prototype._viewUserNodeList   = null;

    // The ID of the user node currently being displayed.
    UserNodeNavigatorView.prototype._currentUserNodeId = null;





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

    function UserNodeNavigatorView ( panelId ) {

        var logger = SimpleLogger.createFor("UserNodeNavigatorView");

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

    UserNodeNavigatorView.prototype.getElement = function () {

        var result = this._panel;

        return result;
    }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

    UserNodeNavigatorView.prototype.showEvent = function ( isVisible ) {

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

    UserNodeNavigatorView.prototype.onShow = function ( callback ) {

        this._callbackShow = callback;
    }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

    UserNodeNavigatorView.prototype.onUserNodeSelected = function ( callback ) {

        this._viewUserNodeList.onUserNodeSelected(callback);
    }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

    UserNodeNavigatorView.prototype.onBack = function ( callback ) {

        this._viewUserNodeList.onBack(callback);
    }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

    UserNodeNavigatorView.prototype.setInitialUserNode = function ( userNode ) {

        var isFirstUserNode = true;

        this._doSetUserNode(userNode, isFirstUserNode);
    }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

    UserNodeNavigatorView.prototype.setUserNode = function ( userNode ) {

        var isFirstUserNode = false;

        this._doSetUserNode(userNode, isFirstUserNode);
    }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

    UserNodeNavigatorView.prototype._doSetUserNode = function (
        userNode,
        isFirstUserNode ) {

        this._logger.info("Showing node {0} ({1})",
                          userNode.id,
                          userNode.name);

        this._currentUserNodeId = userNode.id;

        this._viewUserNodeDetail.setUserNode(userNode);
        this._viewUserNodeList.clear();
        this._viewUserNodeList.enableBackButton(!isFirstUserNode);
    }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

    UserNodeNavigatorView.prototype.setFriendsList = function (
        userId,
        userNodeList ) {

        var currentUserNodeId = this._currentUserNodeId;

        if ( currentUserNodeId == userId ) {
            this._viewUserNodeList.setUserNodeList(userNodeList);
        } else {
            this._logger.info("Friends list for old node {0} ignored...",
                              userId);
        }
    }





    return UserNodeNavigatorView;

})();

