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
    var FnavApp = require("varmateo/friendnav/fnav/FnavApp");
    var FnavAppConfig = require("varmateo/friendnav/fnav/FnavAppConfig");


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

        log.info("Initializing application {0}...", APP_NAME);

        var appConfig = _fetchAppConfig();
        (new FnavApp(appConfig)).initialize();

        log.info("Done initializing application {0}.", APP_NAME);
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
