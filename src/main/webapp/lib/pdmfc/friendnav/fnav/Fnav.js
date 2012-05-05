/**************************************************************************
 *
 * Copyright (c) 2012 Jorge Nunes, All Rights Reserved.
 *
 *
 * Contest Admin application main entry point.
 *
 **************************************************************************/

"use strict";

pdmfc.namespace("pdmfc.friendnav.fnav");





/**************************************************************************
 *
 * The Fnav application.
 *
 * Its main work is seting up the dependency injections for the
 * components (views, controllers, façades) that make up the
 * application.
 *
 **************************************************************************/

pdmfc.friendnav.fnav.Fnav = (function() {

    var SimpleLogger   = pdmfc.util.logging.SimpleLogger;

    var FnavController              =
        pdmfc.friendnav.fnav.controllers.FnavController;

    var FnavView               =
        pdmfc.friendnav.fnav.views.main.FnavView;
    var HomePageView           =
        pdmfc.friendnav.fnav.views.home.HomePageView;
    var FriendsBrowserPageView =
        pdmfc.friendnav.fnav.views.friends.FriendsBrowserPageView;




    var APP_NAME              = "Fnav";
    var PANEL_TOP_CONTENTS    = "#fnvContents";
    var PANEL_HOME            = "#fnvPanelHome";
    var PANEL_FRIENDS_BROWSER = "#fnvPanelFriendsBrowser";

    var _logger     = SimpleLogger.createFor(APP_NAME);
    var _config     = null;

    var _viewFnav               = null;
    var _viewHomePage           = null;
    var _viewFriendsBrowserPage = null;

    var _controllerFnav = null;





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

    function initialize() {

        _logger.info("Initializing {0}...", APP_NAME);

        var controllerFnav = fetchControllerFnav();

        controllerFnav.initialize();

        _logger.info("Done initializing {0}.", APP_NAME);
    }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

    function fetchViewFnav() {

        if ( _viewFnav == null ) {
            var viewFnavConfig = {
                containerPanelId  : PANEL_TOP_CONTENTS,
                pageViewsMap      : {
                    "Home"           : fetchViewHomePage(),
                    "FriendsBrowser" : fetchViewFriendsBrowserPage(),
                },
                preLoginViewCode  : "Home",
                postLoginViewCode : "FriendsBrowser"
            };

            _viewFnav = new FnavView(viewFnavConfig);
        }

        return _viewFnav;
    }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

    function fetchViewHomePage() {

        if ( _viewHomePage == null ) {
            _viewHomePage = new HomePageView(PANEL_HOME);
        }

        return _viewHomePage;
    }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

    function fetchViewFriendsBrowserPage() {

        if ( _viewFriendsBrowserPage == null ) {
            _viewFriendsBrowserPage =
                new FriendsBrowserPageView(PANEL_FRIENDS_BROWSER);
        }

        return _viewFriendsBrowserPage;
    }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

    function fetchControllerFnav() {

        if ( _controllerFnav == null ) {
            var viewFnav = fetchViewFnav();

            _controllerFnav = new FnavController(viewFnav);
        }

        return _controllerFnav;
    }





/**************************************************************************
 *
 * The main program.
 *
 **************************************************************************/

    function main ( config ) {

        _logger.info("Starting {0}...", APP_NAME);

        _config = config;

        $(document).ready(initialize);
    }





    return {
        main : main
    };
        
})();





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

