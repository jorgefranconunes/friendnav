/**************************************************************************
 *
 * Copyright (c) 2012-2016 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * Details of a user node.
 */
varmateo.defineClass(

"varmateo.friendnav.fnav.views.friends.UserNodeListView",

function() {

    var Logger = varmateo.load("varmateo.util.logging.Logger");
    var JQueryUtils  = varmateo.load("varmateo.util.jquery.JQueryUtils");


    var LABEL_COUNTER_CLEAR = "...";

    UserNodeListView.prototype._logger      = null;
    UserNodeListView.prototype._panel       = null;
    UserNodeListView.prototype._spanCounter = null;
    UserNodeListView.prototype._divList     = null;
    UserNodeListView.prototype._buttonBack  = null;

    UserNodeListView.prototype._callbackUserNodeSelected = null;
    UserNodeListView.prototype._callbackBack             = null;


    /**
     *
     */
    function UserNodeListView ( panelId ) {

        var self   = this;
        var logger = Logger.createFor("UserNodeListView");

        logger.info("Seting up with panel \"{0}\"...", panelId);

        var spanCounter = JQueryUtils.getOne(panelId + "Count");
        var divList     = JQueryUtils.getOne(panelId + "Listing");
        var buttonBack  = JQueryUtils.getOne(panelId + "Back");

        buttonBack.click(function ( event ) {
            event.preventDefault();
            if ( !buttonBack.hasClass("disabled") ) {
                self._onBack();
            }
        });

        this._logger      = logger;
        this._panel       = JQueryUtils.getOne(panelId);
        this._spanCounter = spanCounter;
        this._divList     = divList;
        this._buttonBack  = buttonBack;
    }


    /**
     *
     */
    UserNodeListView.prototype.getElement = function () {

        var result = this._panel;

        return result;
    }


    /**
     *
     */
    UserNodeListView.prototype.setOnUserNodeSelectedListener = function (
        callback ) {

        this._callbackUserNodeSelected = callback;
    }


    /**
     *
     */
    UserNodeListView.prototype.setOnBackListener = function ( callback ) {

        this._callbackBack = callback;
    }


    /**
     *
     */
    UserNodeListView.prototype.enableBackButton = function ( isEnabled )  {

        if ( isEnabled ) {
            this._buttonBack.removeClass("disabled");
        } else {
            this._buttonBack.addClass("disabled");
        }
    }


    /**
     *
     */
    UserNodeListView.prototype.clear = function () {

        this._spanCounter.text(LABEL_COUNTER_CLEAR);
        this._divList.empty();
    }


    /**
     *
     */
    UserNodeListView.prototype.setUserNodeList = function ( userNodeList ) {

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


    /**
     *
     */
    UserNodeListView.prototype._buildUserNodeElem = function ( userNode ) {

        var self      = this;
        var photoElem = this._buildPhotoElem(userNode);
        var name      = userNode.name;

        var anchor =
            jQuery("<a>")
            .attr("href", "#")
            .text(name);

        anchor.click(function ( event ) {
            event.preventDefault();
            self._onUserNodeSelected(userNode);
        });

        var elem = jQuery("<div>").addClass("fnvUserNodeItem");

        elem
            .append(photoElem)
            .append(anchor);

        return elem;
    }


    /**
     *
     */
    UserNodeListView.prototype._buildPhotoElem = function ( userNode ) {

        var photoUrl = userNode.photoUrl;
        var elem     =
            jQuery("<div>")
            .addClass("fnvUserNodeItemPhoto pull-left")
            .css("background-image", "url(" + photoUrl + ")");

        return elem;
    }


    /**
     * Called when a node in the friends list is selected.
     */
    UserNodeListView.prototype._onUserNodeSelected = function (
        userNode ) {

        this._logger.info("Selected node {0} ({1})",
                          userNode.id,
                          userNode.name);

        var callback = this._callbackUserNodeSelected;

        callback && callback(userNode);
    }


    /**
     * Called when the "back" button is clicked.
     */
    UserNodeListView.prototype._onBack = function () {

        var callback = this._callbackBack;

        callback && callback();
    }


    return UserNodeListView;
});
