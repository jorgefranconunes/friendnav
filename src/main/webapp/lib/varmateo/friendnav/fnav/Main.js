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
define(function ( require ) {

    var Logger = require("varmateo/util/logging/Logger");

    var FnavAppConfig =
        require("varmateo/friendnav/fnav/FnavAppConfig");
    var FnavControllerFactory =
        require("varmateo/friendnav/fnav/FnavControllerFactory");
    var FnavFacadeFactory =
        require("varmateo/friendnav/fnav/FnavFacadeFactory");
    var FnavViewFactory =
        require("varmateo/friendnav/fnav/FnavViewFactory");


    var APP_NAME = "Fnav";


    /**
     *
     */
    function Main() {
        throw "Private constructor...";
    }


    /**
     *
     */
    function _initialize() {

        var log = Logger.createFor("Main");

        log.info("Initializing {0}...", APP_NAME);

        var appConfig = _fetchAppConfig();
        var facades = new FnavFacadeFactory();
        var views = new FnavViewFactory(appConfig);
        var controllers = new FnavControllerFactory(facades, views);

        controllers.getFnavController().initialize();

        log.info("Done initializing {0}.", APP_NAME);
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
    function main () {

        jQuery(document).ready(_initialize);
    }


    /**
     * Class static methods.
     */
    Main.main = main;


    return Main;
});
