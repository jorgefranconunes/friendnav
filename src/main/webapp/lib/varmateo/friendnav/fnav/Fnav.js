/**************************************************************************
 *
 * Copyright (c) 2012-2016 Jorge Nunes, All Rights Reserved.
 *
 *
 * FriendNav application main entry point.
 *
 **************************************************************************/

"use strict";


/**
 * The Fnav application.
 *
 * Its main work is seting up the dependency injections for the
 * components (views, controllers, façades) that make up the
 * application.
 */
varmateo.defineClass(

"varmateo.friendnav.fnav.Fnav",

function() {

    var SimpleLogger   = varmateo.load("varmateo.util.logging.SimpleLogger");

    var FnavController =
        varmateo.load("varmateo.friendnav.fnav.controllers.FnavController");
    var FriendsBrowserPageController =
        varmateo.load("varmateo.friendnav.fnav.controllers.FriendsBrowserPageController");

    var FnavView =
        varmateo.load("varmateo.friendnav.fnav.views.main.FnavView");
    var HomePageView =
        varmateo.load("varmateo.friendnav.fnav.views.home.HomePageView");
    var FriendsBrowserPageView =
        varmateo.load("varmateo.friendnav.fnav.views.friends.FriendsBrowserPageView");
    var Foursquare =
        varmateo.load("varmateo.friendnav.foursquare.Foursquare");

    var TransitionManagerFactory =
        varmateo.load("varmateo.util.transitions.TransitionManagerFactory");
    var FadeOutInTransitionManager =
        varmateo.load("varmateo.util.transitions.FadeOutInTransitionManager");


    var APP_NAME              = "Fnav";
    var PANEL_TOP_CONTENTS    = "#fnvContents";
    var PANEL_HOME            = "#fnvPanelHome";
    var PANEL_FRIENDS_BROWSER = "#fnvFriendsBrowser";

    var _logger = null;
    var _config = null;

    var _viewFnav               = null;
    var _viewHomePage           = null;
    var _viewFriendsBrowserPage = null;

    var _controllerFnav               = null;
    var _controllerFriendsBrowserPage = null;

    var _foursquareManager = null;


    /**
     *
     */
    function Fnav() {
        throw "Private constructor...";
    }


    /**
     *
     */
    function _initialize() {

        _logger = SimpleLogger.createFor(APP_NAME);

        _logger.info("Initializing {0}...", APP_NAME);
        _logger.info("    Scripts URL prefix : {0}", _config.classUrlPrefix);

        _initializeTransitions();

        // Hack to force instantation...
        _fetchControllerFriendsBrowserPage();

        var controllerFnav = _fetchControllerFnav();
        controllerFnav.initialize();

        _logger.info("Done initializing {0}.", APP_NAME);
    }


    /**
     *
     */
    function _initializeTransitions () {

        var fadeOutIn = new FadeOutInTransitionManager();

        TransitionManagerFactory.register("fadeoutin", fadeOutIn);
    }


    /**
     *
     */
    function _fetchViewFnav() {

        if ( _viewFnav == null ) {
            var viewFnavConfig = {
                containerPanelId  : PANEL_TOP_CONTENTS,
                pageViewsMap      : {
                    "Home"           : _fetchViewHomePage(),
                    "FriendsBrowser" : _fetchViewFriendsBrowserPage(),
                },
                preLoginViewCode  : "Home",
                postLoginViewCode : "FriendsBrowser"
            };

            _viewFnav = new FnavView(viewFnavConfig);
        }

        return _viewFnav;
    }


    /**
     *
     */
    function _fetchViewHomePage() {

        if ( _viewHomePage == null ) {
            _viewHomePage = new HomePageView(PANEL_HOME);
        }

        return _viewHomePage;
    }


    /**
     *
     */
    function _fetchViewFriendsBrowserPage() {

        if ( _viewFriendsBrowserPage == null ) {
            _viewFriendsBrowserPage =
                new FriendsBrowserPageView(PANEL_FRIENDS_BROWSER);
        }

        return _viewFriendsBrowserPage;
    }


    /**
     *
     */
    function _fetchControllerFnav() {

        if ( _controllerFnav == null ) {
            var fsqManager = _fetchFoursquareManager();
            var viewFnav   = _fetchViewFnav();

            _controllerFnav = new FnavController(fsqManager, viewFnav);
        }

        return _controllerFnav;
    }


    /**
     *
     */
    function _fetchControllerFriendsBrowserPage() {

        if ( _controllerFriendsBrowserPage == null ) {
            var fsqManager = _fetchFoursquareManager();
            var view       = _fetchViewFriendsBrowserPage();

            _controllerFriendsBrowserPage =
                new FriendsBrowserPageController(fsqManager, view);

            var fnavController = _fetchControllerFnav();
            var callback       = function ( userNode ) {
                _controllerFriendsBrowserPage.setInitialUserNode(userNode);
            };

            fnavController.setOnInitialUserNodeListener(callback);
        }

        return _controllerFriendsBrowserPage;
    }


    /**
     *
     */
    function _fetchFoursquareManager() {

        if ( _foursquareManager == null ) {
            _foursquareManager = new Foursquare();
        }

        return _foursquareManager;
    }


    /**
     * The main program.
     */
    function main ( config ) {

        _config = config;

        var startFunction = function () {
            jQuery(document).ready(_initialize);
        };

        varmateo.start({
            startFunction : startFunction,
            classUrlPrefix : config.classUrlPrefix,
        });
    }


    /**
     * Class static methods.
     */
    Fnav.main = main;


    return Fnav;
});

