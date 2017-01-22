/**************************************************************************
 *
 * Copyright (c) 2017 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 *
 */
define(function ( require ) {

    var FnavControllerFactory =
        require("varmateo/friendnav/fnav/FnavControllerFactory");
    var FnavFacadeFactory =
        require("varmateo/friendnav/fnav/FnavFacadeFactory");
    var FnavViewFactory =
        require("varmateo/friendnav/fnav/FnavViewFactory");


    FnavControllerFactory.prototype._appConfig = null;


    /**
     *
     */
    function FnavApp ( appConfig ) {

        this._appConfig = appConfig;
    }


    /**
     *
     */
    FnavApp.prototype.initialize = function () {

        var facades = new FnavFacadeFactory();
        var views = new FnavViewFactory(this._appConfig);
        var controllers = new FnavControllerFactory(facades, views);

        controllers.getFnavController().initialize();
    }


    return FnavApp;
});
