/**************************************************************************
 *
 * Copyright (c) 2012-2017 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * The controller for the outermost view of the FriendNav application.
 */
define(function ( require ) {

    var Logger = require("varmateo/util/logging/Logger");


    var COOKIE_ACCESS_TOKEN = "FnavAccessToken";

    FnavController.prototype._log = null;
    FnavController.prototype._friendsServiceManager = null;
    FnavController.prototype._viewFnav = null;
    FnavController.prototype._callbackInitialUserNode = null;


    /**
     *
     */
    function FnavController (
        friendsServiceManager,
        viewFnav ) {

        var logger = Logger.createFor("FnavController");

        viewFnav.setOnLogoutSelectedListener(this._onLogoutSelected.bind(this));

        this._log = logger;
        this._friendsServiceManager = friendsServiceManager;
        this._viewFnav = viewFnav;
        this._callbackInitialUserNode = function () { /* Do nothing. */ };
    }


    /**
     * Decides which page view to show depending on the hash on the
     * current URL.
     */
    FnavController.prototype.initialize = function () {

        var currentUrl = window.location.toString();
        window.location.hash = "";

        if ( this._friendsServiceManager.startSession(currentUrl) ) {
            this._friendsServiceManager
                .getFriendsService()
                .retrieveSelfUserNode()
                .then(this._onSetSelfUserNode.bind(this))
                .fail(this._onFailSetSelfUserNode.bind(this));
        } else {
            this._viewFnav.showPreLoginView();
        }
    }


    /**
     *
     */
    FnavController.prototype.setOnInitialUserNodeListener = function (
        callback ) {

        this._callbackInitialUserNode = callback;
    }


    /**
     *
     */
    FnavController.prototype._onLogoutSelected = function () {

        this._friendsServiceManager.endSession();
        this._viewFnav.showPreLoginView();
    }


    /**
     *
     */
    FnavController.prototype._onSetSelfUserNode = function ( userNode ) {

        if ( userNode != null ) {
            this._log.info("Received self user node:");
            this._log.infoObj(userNode);

            this._viewFnav.showPostLoginView(userNode);
            this._callbackInitialUserNode(userNode);
        } else {
            this._log.info("Failed to receive self user node...");
        }
    }


    /**
     *
     */
    FnavController.prototype._onFailSetSelfUserNode = function ( error ) {

        this._log.info("Failed to receive self user node - {0}", error);
        // TBD - Surely we should something more here...
    }


    return FnavController;
});
