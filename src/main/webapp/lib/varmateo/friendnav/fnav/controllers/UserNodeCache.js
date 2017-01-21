/**************************************************************************
 *
 * Copyright (c) 2012-2017 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * A cache of UserNode providing functionalities usefull for
 * navigating the connections graph.
 */
varmateo.defineClass(

"varmateo.friendnav.fnav.controllers.UserNodeCache",

function() {

    var Logger = varmateo.load("varmateo.util.logging.Logger");


    UserNodeCache.prototype._logger           = null;
    UserNodeCache.prototype._userNodeDataById = null;
    UserNodeCache.prototype._userNodeIdList   = null;


    /**
     *
     */
    function UserNodeCache () {

        var logger = Logger.createFor("UserNodeCache");

        this._logger = logger;
        this._userNodeDataById = {};
        this._userNodeIdList = [];
    }


    /**
     *
     */
    UserNodeCache.prototype.get = function ( userNodeId ) {

        var userNode     = null;
        var userNodeData = this._userNodeDataById[userNodeId];

        if ( userNodeData != null ) {
            userNode = userNodeData.userNode;
        } else {
            this._logger.info("No user node with ID {0}", userNodeId);
        }

        return userNode;
    }


    /**
     *
     */
    UserNodeCache.prototype.push = function ( userNode ) {

        var userNodeId   = userNode.id;
        var userNodeData = this._userNodeDataById[userNodeId];
        var newCounter   = null;

        if ( userNodeData == null ) {
            newCounter   = 1;
            userNodeData = {
                userNode    : userNode,
                friendsList : null,
                counter     : 1
            };
            this._userNodeDataById[userNodeId] = userNodeData;
        } else {
            newCounter = 1+userNodeData.counter;
            userNodeData.counter = newCounter;
        }

        this._userNodeIdList.unshift(userNodeId);

        this._logger.info(
            "Pushed user node {0} ({1} total)",
            userNodeId,
            newCounter);
    }


    /**
     *
     */
    UserNodeCache.prototype.pop = function () {

        if ( this._userNodeIdList.length === 0 ) {
            var msg = "Attempted pop on empty user node cache.";
            throw msg;
        }

        var userNodeId   = this._userNodeIdList.shift();
        var userNodeData = this._userNodeDataById[userNodeId];
        var newCounter   = userNodeData.counter - 1;

        if ( newCounter == 0 ) {
            delete this._userNodeDataById[userNodeId];
        } else {
            userNodeData.counter = newCounter;
        }

        this._logger.info("Poped user node {0} ({1} total)",
                          userNodeId,
                          newCounter);
    }


    /**
     *
     */
    UserNodeCache.prototype.getCurrent = function () {

        var userNode = null;

        if ( this._userNodeIdList.length > 0 ) {
            var userNodeId   = this._userNodeIdList[0];
            var userNodeData = userNode = this._userNodeDataById[userNodeId];

            userNode = userNodeData.userNode;
        } else {
            var msg = "Attempted getCurrent on empty user node cache.";
            throw msg;
        }

        return userNode;
    }


    /**
     *
     */
    UserNodeCache.prototype.setFriendsList = function (
        userNodeId,
        userNodeList) {

        var userNodeData = this._userNodeDataById[userNodeId];

        if( userNodeData != null ) {
            userNodeData.friendsList = userNodeList;
        } else {
            this._logger.info("No user node {0} on cache, ignored friends.",
                              userNodeId);
        }
    }


    /**
     *
     */
    UserNodeCache.prototype.getFriendsList = function ( userNodeId ) {

        var userNodeList = null;
        var userNodeData = this._userNodeDataById[userNodeId];

        if( userNodeData != null ) {
            userNodeList = userNodeData.friendsList;

            if ( userNodeList != null ) {
                this._logger.info("User node {0} in cache with {1} friends",
                                  userNodeId,
                                  userNodeList.length);
            } else {
                this._logger.info("User node {0} friends list not in cache",
                                  userNodeId);
            }
        } else {
            this._logger.info("No user node {0} on cache.", userNodeId);
        }

        return userNodeList;
    }


    return UserNodeCache;
});
