/**************************************************************************
 *
 * Copyright (c) 2012-2017 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * Details of a user node.
 */
define(function ( require ) {

    var JQueryUtils = require("varmateo/util/jquery/JQueryUtils");
    var Logger = require("varmateo/util/logging/Logger");
    var ActivityIndicatorView =
        require("varmateo/friendnav/views/ActivityIndicatorView");
    var Links = require("varmateo/friendnav/views/Links");


    var LABEL_COUNTER_CLEAR = "...";

    UserNodeListView.prototype._log      = null;
    UserNodeListView.prototype._panel       = null;
    UserNodeListView.prototype._spanCounter = null;
    UserNodeListView.prototype._divList     = null;
    UserNodeListView.prototype._buttonBack  = null;
    UserNodeListView.prototype._activityIndicatorView = null;

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

        Links.setOnClickListener(
            buttonBack,
            function () {
                if ( !buttonBack.hasClass("disabled") ) {
                    self._onBack();
                }
            });

        this._log = logger;
        this._panel = JQueryUtils.getOne(panelId);
        this._spanCounter = spanCounter;
        this._divList = divList;
        this._buttonBack = buttonBack;
        this._activityIndicatorView = new ActivityIndicatorView();
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
        this._divList.append(this._activityIndicatorView.getElement());
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

        var self = this;
        var photoElem = this._buildPhotoElem(userNode);
        var name = userNode.name;
        var anchor = Links.newTextLink({
            text : name,
            callback : function () {
                self._onUserNodeSelected(userNode);
            },
        });

        var elem =
            jQuery("<div>")
            .addClass("fnvUserNodeItem")
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

        this._log.info("Selected node {0} ({1})", userNode.id, userNode.name);

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
