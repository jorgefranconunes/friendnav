/**************************************************************************
 *
 * Copyright (c) 2012-2017 Jorge Nunes, All Rights Reserved.
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

    var Logger = varmateo.load("varmateo.util.logging.Logger");

    var FnavAppConfig =
        varmateo.load("varmateo.friendnav.fnav.FnavAppConfig");
    var FnavControllerFactory =
        varmateo.load("varmateo.friendnav.fnav.FnavControllerFactory");
    var FnavFacadeFactory =
        varmateo.load("varmateo.friendnav.fnav.FnavFacadeFactory");
    var FnavViewFactory =
        varmateo.load("varmateo.friendnav.fnav.FnavViewFactory");


    var APP_NAME = "Fnav";

    var _log = null;
    var _config = null;


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

        _log = Logger.createFor(APP_NAME);

        _log.info("Initializing {0}...", APP_NAME);
        _log.info("    Scripts URL prefix : {0}", _config.classUrlPrefix);

        var appConfig = _fetchAppConfig();
        var facades = new FnavFacadeFactory();
        var views = new FnavViewFactory(appConfig);
        var controllers = new FnavControllerFactory(facades, views);

        controllers.getFnavController().initialize();

        _log.info("Done initializing {0}.", APP_NAME);
    }


    /**
     *
     */
    function _fetchAppConfig () {

        var configSetName = window.location.hostname;
        var config = FnavAppConfig.getConfig(configSetName);

        return config;
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
