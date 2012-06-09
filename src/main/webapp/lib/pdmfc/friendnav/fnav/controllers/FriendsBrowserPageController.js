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

pdmfc.friendnav.fnav.controllers.FriendsBrowserPageController = (function() {

        var SimpleLogger  = pdmfc.util.logging.SimpleLogger;
        var UserNodeCache = pdmfc.friendnav.fnav.controllers.UserNodeCache;





        FriendsBrowserPageController.prototype._logger     = null;
        FriendsBrowserPageController.prototype._fsqManager = null;
        FriendsBrowserPageController.prototype._view       = null;
        FriendsBrowserPageController.prototype._cache      = null;





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        function FriendsBrowserPageController ( fsqManager,
                                                view ) {

            var self   = this;
            var logger = SimpleLogger.createFor("FriendsBrowserPageController");

            logger.info("Seting up...");

            view.onUserNodeSelected(function ( userNode ) {
                    self._pushUserNode(userNode);
                });
            view.onBack(function () {
                    self._popUserNode();
                });

            this._logger     = logger;
            this._fsqManager = fsqManager;
            this._view       = view;
            this._cache      = new UserNodeCache();
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        FriendsBrowserPageController.prototype.setInitialUserNode =
        function ( userNode ) {

            this._pushUserNode(userNode);
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        FriendsBrowserPageController.prototype._pushUserNode =
        function ( userNode ) {

            this._cache.push(userNode);

            this._view.pushAndShow(userNode);
            this._retrieveFriendsList(userNode);
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        FriendsBrowserPageController.prototype._popUserNode =
        function () {

            this._cache.pop();

            var userNode = this._cache.getCurrent();

            this._view.popAndShow(userNode);

            this._retrieveFriendsList(userNode);
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        FriendsBrowserPageController.prototype._retrieveFriendsList =
        function ( userNode ) {

            var self       = this;
            var userNodeId = userNode.id;

            var userNodeList = this._cache.getFriendsList(userNodeId);

            if ( userNodeList != null ) {
                this._view.setFriendsList(userNodeId, userNodeList);
            } else {
                var callback = function ( userNodeList ) {
                    self._setFriendsList(userNodeId, userNodeList);
                };

                this._fsqManager.retrieveFriendsList(userNodeId, callback);
            }
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        FriendsBrowserPageController.prototype._setFriendsList =
        function ( userNodeId,
                   userNodeList ) {

            if ( userNodeList != null ) {
                this._logger.info("Received {0} friends for user {1}",
                                  userNodeList.length,
                                  userNodeId);

                this._cache.setFriendsList(userNodeId, userNodeList);
                this._view.setFriendsList(userNodeId, userNodeList);
            } else {
                this._logger.info("Failed to receive friends list for user {1}",
                                  userNodeId);
            }
        }





        return FriendsBrowserPageController;

    })();





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

