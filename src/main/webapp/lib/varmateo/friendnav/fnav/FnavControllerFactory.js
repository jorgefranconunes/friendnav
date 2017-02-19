/**************************************************************************
 *
 * Copyright (c) 2016-2017 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 *
 */
define(function ( require ) {

    var Memoizer = require("varmateo/util/Memoizer");

    var FnavController =
        require("varmateo/friendnav/fnav/controllers/FnavController");
    var FriendsBrowserPageController =
        require("varmateo/friendnav/fnav/controllers/FriendsBrowserPageController");


    FnavControllerFactory.prototype._facades = null;
    FnavControllerFactory.prototype._views = null;


    /**
     *
     */
    function FnavControllerFactory (
        facades,
        views ) {

        var self = this;
        var configList = [{
            name : "FriendsBrowserPageController",
            builder : function () {
                return self._newFriendsBrowserPageController();
            },
        }, {
            name : "FnavController",
            builder : function () {
                return self._newFnavController();
            }
        },];
        var memoizer = new Memoizer(configList);

        memoizer.extendTo(this);

        this._facades = facades;
        this._views = views;
    }


    /**
     *
     */
    FnavControllerFactory.prototype._newFriendsBrowserPageController = function () {
        var self = this;
        var serviceFetcher = function () {
            return self._facades.getFriendsServiceManager().getFriendsService();
        };
        var view = this._views.getFriendsBrowserPageView();
        var controller = new FriendsBrowserPageController(serviceFetcher, view);

        return controller;
    }


    /**
     *
     */
    FnavControllerFactory.prototype._newFnavController = function () {

        var self = this;
        var service = this._facades.getFriendsServiceManager()
        var view = this._views.getFnavView();
        var controller = new FnavController(service, view);

        var callback = function ( userNode ) {
            self.getFriendsBrowserPageController().setInitialUserNode(userNode);
        }

        controller.setOnInitialUserNodeListener(callback);

        return controller;
    }


    return FnavControllerFactory;
});
