/**************************************************************************
 *
 * Copyright (c) 2012-2016 Jorge Nunes All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * The view for the page displaying the friend navigator widget and
 * the map with the social network connections.
*/

varmateo.defineClass(

"varmateo.friendnav.fnav.views.friends.FriendsBrowserPageView",

function() {

    var SimpleLogger = varmateo.load("varmateo.util.logging.SimpleLogger");
    var JQueryUtils  = varmateo.load("varmateo.util.jquery.JQueryUtils");

    var UserNodeNavigatorView   =
        varmateo.load("varmateo.friendnav.fnav.views.friends.UserNodeNavigatorView");
    var UserNodeForceLayoutView =
        varmateo.load("varmateo.friendnav.fnav.views.friends.UserNodeForceLayoutView");


    FriendsBrowserPageView.prototype._logger        = null;
    FriendsBrowserPageView.prototype._panel         = null;
    FriendsBrowserPageView.prototype._callbackShow  = null;
    FriendsBrowserPageView.prototype._viewNavigator = null;
    FriendsBrowserPageView.prototype._viewGraph     = null;
    FriendsBrowserPageView.prototype._depth         = -1;


    /**
     *
     */
    function FriendsBrowserPageView ( panelId ) {

        var logger = SimpleLogger.createFor("FriendsBrowserPageView");

        logger.info("Seting up with panel \"{0}\"...", panelId);

        var viewNavigator = new UserNodeNavigatorView(panelId);
        var viewGraph     = new UserNodeForceLayoutView(panelId+"Graph");

        this._logger        = logger;
        this._panel         = JQueryUtils.getOne(panelId);
        this._viewNavigator = viewNavigator;
        this._viewGraph     = viewGraph;
    }


    /**
     *
     */
    FriendsBrowserPageView.prototype.getElement = function () {

        var result = this._panel;

        return result;
    }


    /**
     *
     */
    FriendsBrowserPageView.prototype.showEvent = function ( isVisible ) {

        this._logger.info("View is now {0}",
                          (isVisible ? "shown" : "hidden"));

        var callback = this._callbackShow;

        callback && calback(isVisible);
    }


    /**
     * Defines the callback for the "show" event.
     */
    FriendsBrowserPageView.prototype.onShow = function ( callback ) {

        this._callbackShow = callback;
    }


    /**
     *
     */
    FriendsBrowserPageView.prototype.setOnUserNodeSelectedListener = function (
        callback ) {

        this._viewNavigator.onUserNodeSelected(callback);
    }


    /**
     *
     */
    FriendsBrowserPageView.prototype.setOnBackListener = function ( callback ) {

        this._viewNavigator.onBack(callback);
    }


    /**
     *
     */
    FriendsBrowserPageView.prototype.setInitialUserNode = function (
        userNode ) {

        this._viewNavigator.setInitialUserNode(userNode);
        this._viewGraph.pushUserNode(userNode);
    }


    /**
     *
     */
    FriendsBrowserPageView.prototype.pushAndShow = function ( userNode ) {

        var depth = this._depth + 1;

        this._depth = depth;

        if ( depth == 0 ) {
            this._viewNavigator.setInitialUserNode(userNode);
        } else {
            this._viewNavigator.setUserNode(userNode);
        }

        this._viewGraph.pushUserNode(userNode);
    }


    /**
     *
     */
    FriendsBrowserPageView.prototype.popAndShow = function ( userNode ) {

        var depth = this._depth - 1;

        this._depth = depth;

        if ( depth == 0 ) {
            this._viewNavigator.setInitialUserNode(userNode);
        } else {
            this._viewNavigator.setUserNode(userNode);
        }

        this._viewGraph.popUserNode();
    }


    /**
     *
     */
    FriendsBrowserPageView.prototype.setFriendsList = function (
        userId,
        userNodeList ) {

        this._viewNavigator.setFriendsList(userId, userNodeList);
    }


    return FriendsBrowserPageView;
});
