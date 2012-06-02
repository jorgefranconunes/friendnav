/**************************************************************************
 *
 * Copyright (c) 2012 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";

pdmfc.namespace("pdmfc.friendnav.fnav.controllers");





/**************************************************************************
 *
 * A cache of UserNode providing functionalities usefull for
 * navigating the connections graph.
 *
 **************************************************************************/

pdmfc.friendnav.fnav.controllers.UserNodeCache = (function() {

        var SimpleLogger = pdmfc.util.logging.SimpleLogger;





        UserNodeCache.prototype._logger           = null;
        UserNodeCache.prototype._userNodeDataById = {};
        UserNodeCache.prototype._userNodeIdList   = [];





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        function UserNodeCache () {

            var logger = SimpleLogger.createFor("UserNodeCache");

            this._logger     = logger;
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        UserNodeCache.prototype.get =
        function ( userNodeId ) {

            var userNode     = null;
            var userNodeData = this._userNodeDataById[userNodeId];

            if ( userNodeData != null ) {
                userNode = userNodeData.userNode;
            } else {
                this._logger.info("No user node with ID {0}", userNodeId);
            }

            return userNode;
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        UserNodeCache.prototype.push =
        function ( userNode ) {

            var userNodeId   = userNode.id;
            var userNodeData = this._userNodeDataById[userNodeId];

            if ( userNodeData == null ) {
                userNodeData = {
                    userNode    : userNode,
                    friendsList : null,
                    counter     : 1
                };
                this._userNodeDataById[userNodeId] = userNodeData;

                this._logger.info("User node {0} added to cache", userNodeId);
            } else {
                this._logger.info("User node {0} already in cache ({1} times)",
                                  userNodeId,
                                  userNodeData.counter);

                userNodeData.counter = 1+userNodeData.counter;
            }

            this._userNodeIdList.unshift(userNodeId);
        }





/**************************************************************************
 *
 * Removes the topmost user node from the cache.
 *
 **************************************************************************/

        UserNodeCache.prototype.pop =
        function () {

            if ( this._userNodeIdList.length === 0 ) {
                var msg = "Attempted pop on empty user node cache.";
                throw msg;
            }

            var userNodeId   = this._userNodeIdList.shift();
            var userNodeData = this._userNodeDataById[userNodeId];
            var newCounter   = userNodeData.counter - 1;

            if ( newCounter == 0 ) {
                delete this._userNodeDataById[userNodeId];

                this._logger.info("User node {0} removed from cache",
                                  userNodeId);
            } else {
                userNodeData.counter = newCounter;

                this._logger.info("User node {0} kept in cache ({1} times)",
                                  userNodeId,
                                  newCounter);
            }
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        UserNodeCache.prototype.getCurrent =
        function () {

            var userNode = null;

            if ( this._userNodeIdList.length > 0 ) {
                var userNodeId   = this._userNodeIdList[0];
                var userNodeData =
                    userNode = this._userNodeDataById[userNodeId];

                userNode = userNodeData.userNode;
            } else {
                var msg = "Attempted getCurrent on empty user node cache.";
                throw msg;
            }

            return userNode;
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        UserNodeCache.prototype.setFriendsList =
        function ( userNodeId,
                   userNodeList) {

            var userNodeData = this._userNodeDataById[userNodeId];

            if( userNodeData != null ) {
                userNodeData.friendsList = userNodeList;
            } else {
                this._logger.info("No user node {0} on cache, ignored friends.",
                                  userNodeId);
            }
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        UserNodeCache.prototype.getFriendsList =
        function ( userNodeId ) {

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

    })();





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

