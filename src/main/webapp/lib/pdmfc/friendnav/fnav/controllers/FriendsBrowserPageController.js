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

        var SimpleLogger = pdmfc.util.logging.SimpleLogger;





        FriendsBrowserPageController.prototype._logger     = null;
        FriendsBrowserPageController.prototype._fsqManager = null;
        FriendsBrowserPageController.prototype._view       = null;





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

            this._logger     = logger;
            this._fsqManager = fsqManager;
            this._view       = view;
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        FriendsBrowserPageController.prototype.setInitialUserNode =
        function ( userNode ) {

            this._view.setInitialUserNode(userNode);

            var self     = this;
            var userId   = userNode.id;
            var callback = function ( userNodeList ) {
                self._setFriendsList(userId, userNodeList);
            };

            this._fsqManager.retrieveFriendsList(userId, callback);
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        FriendsBrowserPageController.prototype._setFriendsList =
        function ( userId,
                   userNodeList ) {

            if ( userNodeList != null ) {
                this._logger.info("Received {0} friends for user {1}",
                                  userNodeList.length,
                                  userId);

                this._view.setFriendsList(userId, userNodeList);
            } else {
                this._logger.info("Failed to receive friends list for user {1}",
                                  userId);
            }
        }





        return FriendsBrowserPageController;

    })();





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

