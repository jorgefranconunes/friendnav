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
    var PageViewTrait = varmateo.load("varmateo.friendnav.views.PageViewTrait");


    var LABEL_TITLE = "Friends Browser";

    FriendsBrowserPageView.prototype._viewNavigator = null;
    FriendsBrowserPageView.prototype._viewGraph     = null;
    FriendsBrowserPageView.prototype._depth         = -1;


    /**
     *
     */
    function FriendsBrowserPageView ( panelId ) {

        var logger = SimpleLogger.createFor("FriendsBrowserPageView");
        var panel = JQueryUtils.getOne(panelId);
        var trait = new PageViewTrait(logger, LABEL_TITLE, panel);

        trait.addTo(this);

        var viewNavigator = new UserNodeNavigatorView(panelId);
        var viewGraph     = new UserNodeForceLayoutView(panelId+"Graph");

        logger.info("Setting up with panel \"{0}\"...", panelId);

        this._viewNavigator = viewNavigator;
        this._viewGraph = viewGraph;
    }


    /**
     *
     */
    FriendsBrowserPageView.prototype.setOnUserNodeSelectedListener = function (
        callback ) {

        this._viewNavigator.setOnUserNodeSelectedListener(callback);
    }


    /**
     *
     */
    FriendsBrowserPageView.prototype.setOnBackListener = function ( callback ) {

        this._viewNavigator.setOnBackListener(callback);
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
