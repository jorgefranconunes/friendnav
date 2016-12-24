/**************************************************************************
 *
 * Copyright (c) 2016 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 *
 */
varmateo.defineClass(

"varmateo.friendnav.fnav.FnavControllerFactory",

function() {

    var Memoizer = varmateo.load("varmateo.util.Memoizer");

    var FnavController =
        varmateo.load("varmateo.friendnav.fnav.controllers.FnavController");
    var FriendsBrowserPageController =
        varmateo.load("varmateo.friendnav.fnav.controllers.FriendsBrowserPageController");


    FnavControllerFactory.prototype._facades = null;
    FnavControllerFactory.prototype._views = null;


    /**
     *
     */
    function FnavControllerFactory (
        facades,
        views ) {

        var self = this;
        var configList = [
            {
                name : "FriendsBrowserPageController",
                builder : function () {
                    return self._newFriendsBrowserPageController();
                },
            },
            {
                name : "FnavController",
                builder : function () {
                    return self._newFnavController();
                }
            },
        ];
        var memoizer = new Memoizer(configList);

        memoizer.extendTo(this);

        this._facades = facades;
        this._views = views;
    }


    /**
     *
     */
    FnavControllerFactory.prototype._newFriendsBrowserPageController = function () {
        var facade = this._facades.getFriendsFacade();
        var view = this._views.getFriendsBrowserPageView();
        var controller = new FriendsBrowserPageController(facade, view);

        return controller;
    }


    /**
     *
     */
    FnavControllerFactory.prototype._newFnavController = function () {

        var self = this;
        var facade = this._facades.getFriendsFacade()
        var view = this._views.getFnavView();
        var controller = new FnavController(facade, view);

        var callback = function ( userNode ) {
            self.getFriendsBrowserPageController().setInitialUserNode(userNode);
        }

        controller.setOnInitialUserNodeListener(callback);

        return controller;
    }


    return FnavControllerFactory;
});
