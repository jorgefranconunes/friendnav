/**************************************************************************
 *
 * Copyright (c) 2016-2017 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 *
 */
varmateo.defineClass(

"varmateo.friendnav.fnav.FnavViewFactory",

function() {

    var Memoizer = varmateo.load("varmateo.util.Memoizer");

    var HomePageView =
        varmateo.load("varmateo.friendnav.fnav.views.home.HomePageView");
    var FriendsBrowserPageView =
        varmateo.load("varmateo.friendnav.fnav.views.friends.FriendsBrowserPageView");
    var FnavView =
        varmateo.load("varmateo.friendnav.fnav.views.main.FnavView");
    var FadeOutInTransitionManager =
        varmateo.load("varmateo.util.transitions.FadeOutInTransitionManager");


    var PANEL_FRIENDS_BROWSER = "#fnvFriendsBrowser";
    var PANEL_HOME = "#fnvPanelHome";
    var PANEL_TOP_CONTENTS = "#fnvContents";


    /**
     *
     */
    function FnavViewFactory ( appConf) {

        var self = this;
        var configList = [
            {
                name : "FnavView",
                builder : function () {
                    return self._newFnavView();
                }
            },
            {
                name : "FriendsBrowserPageView",
                builder : function () {
                    return new FriendsBrowserPageView(PANEL_FRIENDS_BROWSER);
                },
            },
            {
                name : "HomePageView",
                builder : function () {
                    return new HomePageView(PANEL_HOME, appConf);
                },
            },
            {
                name : "TransitionManager",
                builder : function () {
                    return new FadeOutInTransitionManager();
                },
            },
        ];
        var memoizer = new Memoizer(configList);

        memoizer.extendTo(this);
    }


    /**
     *
     */
    FnavViewFactory.prototype._newFnavView = function () {

        var transitionManager = this.getTransitionManager();
        var fnavViewConfig = {
            containerPanelId  : PANEL_TOP_CONTENTS,
            pageViewsMap      : {
                "Home"           : this.getHomePageView(),
                "FriendsBrowser" : this.getFriendsBrowserPageView(),
            },
            preLoginViewCode  : "Home",
            postLoginViewCode : "FriendsBrowser"
        };
        var view = new FnavView(fnavViewConfig, transitionManager);

        return view;
    }


    return FnavViewFactory;
});
