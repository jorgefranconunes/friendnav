/**************************************************************************
 *
 * Copyright (c) 2017 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * Provides functionality common to most classes representing a set of
 * configuration parameters.
 */
varmateo.defineClass(

"varmateo.util.ConfigTrait",

function() {

    var Traits = varmateo.load("varmateo.util.Traits");
    var MessageFormat = varmateo.load("varmateo.util.text.MessageFormat");


    var TRAIT_METHOD_LIST =
        [ "get", ];

    ConfigTrait.prototype._paramsMap = null;


    /**
     *
     */
    function ConfigTrait ( paramsMap ) {

        this._paramsMap = paramsMap;
    }


    /**
     *
     */
    ConfigTrait.prototype.addTo = function ( object ) {

        Traits.extendWith(object, this, TRAIT_METHOD_LIST);
    }


    /**
     *
     */
    ConfigTrait.prototype.get = function ( paramName ) {

        if ( !(paramName in this._paramsMap) ) {
            var msg = MessageFormat.format(
                "Parameter \"{0}\" is not defined", paramName);
            throw msg;
        }

        return this._paramsMap[paramName];
    }


    return ConfigTrait;
});
