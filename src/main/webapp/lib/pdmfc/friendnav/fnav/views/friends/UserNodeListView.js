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

pdmfc.friendnav.fnav.views.friends.UserNodeListView = (function() {

        var SimpleLogger = pdmfc.util.logging.SimpleLogger;
        var JQueryUtils  = pdmfc.util.jquery.JQueryUtils;





        var LABEL_COUNTER_CLEAR = "...";

        UserNodeListView.prototype._logger      = null;
        UserNodeListView.prototype._panel       = null;
        UserNodeListView.prototype._spanCounter = null;
        UserNodeListView.prototype._divList     = null;





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        function UserNodeListView ( panelId ) {

            var logger = SimpleLogger.createFor("UserNodeListView");

            logger.info("Seting up with panel \"{0}\"...", panelId);

            var spanCounter = JQueryUtils.getOne(panelId + "Count");
            var divList     = JQueryUtils.getOne(panelId + "Listing");

            this._logger      = logger;
            this._panel       = JQueryUtils.getOne(panelId);
            this._spanCounter = spanCounter;
            this._divList     = divList;
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        UserNodeListView.prototype.getElement =
        function () {

            var result = this._panel;

            return result;
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        UserNodeListView.prototype.clear =
        function () {

            this._spanCounter.text(LABEL_COUNTER_CLEAR);
            this._divList.empty();
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        UserNodeListView.prototype.setUserNodeList =
        function ( userNodeList ) {

            var divList          = this._divList;
            var userNodeListSize = userNodeList.length;

            this._spanCounter.text(userNodeListSize);
            divList.empty();

            for ( var i=0; i<userNodeListSize; ++i ) {
                var userNode     = userNodeList[i];
                var userNodeElem = this._buildUserNodeElem(userNode);

                divList.append(userNodeElem);
            }
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        UserNodeListView.prototype._buildUserNodeElem =
        function ( userNode ) {

            var photoElem = this._buildPhotoElem(userNode);
            var name      = userNode.firstName + " " + userNode.lastName;

            var elem = jQuery("<div>").addClass("fnvUserNodeItem");

            elem
            .append(photoElem)
            .append(name);

            return elem;
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        UserNodeListView.prototype._buildPhotoElem =
        function ( userNode ) {

            var photoUrl = userNode.photoUrl;
            var elem     =
                jQuery("<div>")
                .addClass("fnvUserNodeItemPhoto pull-left")
                .css("background-image", "url(" + photoUrl + ")");

            return elem;
        }





        return UserNodeListView;

    })();





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

