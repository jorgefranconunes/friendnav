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

"varmateo.friendnav.fnav.FnavViewFactory",

function() {

    var Memoizer = varmateo.load("varmateo.util.Memoizer");

    var HomePageView =
        varmateo.load("varmateo.friendnav.fnav.views.home.HomePageView");
    var FriendsBrowserPageView =
        varmateo.load("varmateo.friendnav.fnav.views.friends.FriendsBrowserPageView");
    var FnavView =
        varmateo.load("varmateo.friendnav.fnav.views.main.FnavView");


    var PANEL_FRIENDS_BROWSER = "#fnvFriendsBrowser";
    var PANEL_HOME            = "#fnvPanelHome";
    var PANEL_TOP_CONTENTS = "#fnvContents";


    /**
     *
     */
    function FnavViewFactory () {

        var self = this;
        var configList = [
            {
                name : "FriendsBrowserPageView",
                builder : function () {
                    return new FriendsBrowserPageView(PANEL_FRIENDS_BROWSER);
                },
            },
            {
                name : "FnavView",
                builder : function () {
                    return self._newFnavView();
                }
            },
            {
                name : "HomePageView",
                builder : function () {
                    return new HomePageView(PANEL_HOME);
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

        var fnavViewConfig = {
            containerPanelId  : PANEL_TOP_CONTENTS,
            pageViewsMap      : {
                "Home"           : this.getHomePageView(),
                "FriendsBrowser" : this.getFriendsBrowserPageView(),
            },
            preLoginViewCode  : "Home",
            postLoginViewCode : "FriendsBrowser"
        };
        var view = new FnavView(fnavViewConfig);

        return view;
    }


    return FnavViewFactory;
});
