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

        UserNodeListView.prototype._callbackUserNodeSelected = null;





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

        UserNodeListView.prototype.onUserNodeSelected =
        function ( callback ) {

            this._callbackUserNodeSelected = callback;
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

            var self      = this;
            var photoElem = this._buildPhotoElem(userNode);
            var name      = userNode.name;

            var anchor =
                jQuery("<a>")
                .attr("href", "#")
                .text(name);

            anchor.click(function ( event ) {
                    event.preventDefault();
                    self._triggerUserNodeSelected(userNode);
                });

            var elem = jQuery("<div>").addClass("fnvUserNodeItem");

            elem
            .append(photoElem)
            .append(anchor);

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





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        UserNodeListView.prototype._triggerUserNodeSelected =
        function ( userNode ) {

            this._logger.info("Selected node {0} ({1})",
                              userNode.id,
                              userNode.name);

            var callback = this._callbackUserNodeSelected;

            callback && callback(userNode);
        }





        return UserNodeListView;

    })();





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

