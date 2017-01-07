/**************************************************************************
 *
 * Copyright (c) 2017 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * Set of configuration parameters for the FNav application.
 */
varmateo.defineClass(

"varmateo.friendnav.fnav.FnavAppConfig",

function() {

    var MessageFormat =
        varmateo.load("varmateo.util.text.MessageFormat");
    var FnavAppConfigDev =
        varmateo.load("varmateo.friendnav.fnav.FnavAppConfigDev");


    var _configBuilders = {
            "localhost" : function () {
                return new FnavAppConfigDev();
            },
        };
    var _configs = {}


    /**
     *
     */
    function FnavAppConfig() {
        throw "Private constructor";
    }


    /**
     *
     */
    function getConfig ( configSetName ) {

        var config = _configs[configSetName];

        if ( config === undefined ) {
            if ( !(configSetName in _configBuilders) ) {
                var msg = MessageFormat.format(
                    "Configuration set \"{0}\" is not defined", configSetName);
                throw msg;
            }
            config = _configBuilders[configSetName]();
            _configs[configSetName] = config;
        }

        return config;
    }


    /**
     * Class static methods.
     */
    FnavAppConfig.getConfig = getConfig;


    return FnavAppConfig;
});
