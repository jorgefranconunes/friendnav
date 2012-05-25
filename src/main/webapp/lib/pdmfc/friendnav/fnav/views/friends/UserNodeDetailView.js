/**************************************************************************
 *
 * Copyright (c) 2012 PDMFC, All Rights Reserved.
 *
 **************************************************************************/

"use strict";

pdmfc.namespace("pdmfc.friendnav.fnav.views.friends");





/**************************************************************************
 *
 * Details of a user node.
 *
 **************************************************************************/

pdmfc.friendnav.fnav.views.friends.UserNodeDetailView = (function() {

        var SimpleLogger = pdmfc.util.logging.SimpleLogger;
        var JQueryUtils  = pdmfc.util.jquery.JQueryUtils;





        UserNodeDetailView.prototype._logger   = null;
        UserNodeDetailView.prototype._panel    = null;
        UserNodeDetailView.prototype._divName  = null;
        UserNodeDetailView.prototype._divPhoto = null;





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        function UserNodeDetailView ( panelId ) {

            var logger = SimpleLogger.createFor("UserNodeDetailView");

            logger.info("Seting up with panel \"{0}\"...", panelId);

            var divName  = JQueryUtils.getOne(panelId + "Name");
            var divPhoto = JQueryUtils.getOne(panelId + "Photo");

            this._logger   = logger;
            this._panel    = JQueryUtils.getOne(panelId);
            this._divName  = divName;
            this._divPhoto = divPhoto;
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        UserNodeDetailView.prototype.getElement =
        function () {

            var result = this._panel;

            return result;
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        UserNodeDetailView.prototype.setUserNode =
        function ( userNode ) {

            var name     = userNode.firstName + " " + userNode.lastName;
            var photoUrl = userNode.largePhotoUrl;

            this._divName.text(name);
            this._divPhoto.css("background-image",
                               "url(" + photoUrl + ")");
        }





        return UserNodeDetailView;

    })();





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

