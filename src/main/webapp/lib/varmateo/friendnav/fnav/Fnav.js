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
 */
varmateo.defineClass(

"varmateo.friendnav.fnav.Fnav",

function() {

    var SimpleLogger = varmateo.load("varmateo.util.logging.SimpleLogger");

    var FnavController =
        varmateo.load("varmateo.friendnav.fnav.controllers.FnavController");
    var FriendsBrowserPageController =
        varmateo.load("varmateo.friendnav.fnav.controllers.FriendsBrowserPageController");

    var FnavFacadeFactory =
        varmateo.load("varmateo.friendnav.fnav.FnavFacadeFactory");
    var FnavViewFactory =
        varmateo.load("varmateo.friendnav.fnav.FnavViewFactory");

    var TransitionManagerFactory =
        varmateo.load("varmateo.util.transitions.TransitionManagerFactory");
    var FadeOutInTransitionManager =
        varmateo.load("varmateo.util.transitions.FadeOutInTransitionManager");


    var APP_NAME = "Fnav";

    var _logger = null;
    var _config = null;

    var _facades = null;
    var _views = null;

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

        _facades = new FnavFacadeFactory();
        _views = new FnavViewFactory();

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
    function _fetchControllerFnav() {

        if ( _controllerFnav == null ) {
            var friendsFacade = _facades.getFriendsFacade();
            var viewFnav = _views.getFnavView();

            _controllerFnav = new FnavController(friendsFacade, viewFnav);
        }

        return _controllerFnav;
    }


    /**
     *
     */
    function _fetchControllerFriendsBrowserPage() {

        if ( _controllerFriendsBrowserPage == null ) {
            var friendsFacade = _facades.getFriendsFacade();
            var view = _views.getFriendsBrowserPageView();

            _controllerFriendsBrowserPage =
                new FriendsBrowserPageController(friendsFacade, view);

            var fnavController = _fetchControllerFnav();
            var callback       = function ( userNode ) {
                _controllerFriendsBrowserPage.setInitialUserNode(userNode);
            };

            fnavController.setOnInitialUserNodeListener(callback);
        }

        return _controllerFriendsBrowserPage;
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

