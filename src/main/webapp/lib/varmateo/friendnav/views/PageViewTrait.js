/**************************************************************************
 *
 * Copyright (c) 2016-2017 Jorge Nunes All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * Implements behaviour common to all page views.
 */
define(function ( require ) {

    var Traits = require("varmateo/util/Traits");


    var TRAIT_METHOD_LIST = [
        "getElement",
        "getTitle",
        "onShow",
        "setOnShowListener",
    ];

    PageViewTrait.prototype._log = null;
    PageViewTrait.prototype._title = null;
    PageViewTrait.prototype._panel = null;
    PageViewTrait.prototype._callbackShow = null;


    /**
     *
     */
    function PageViewTrait (
        logger,
        title,
        panel ) {

        this._log = logger;
        this._title = title;
        this._panel = panel;
        this._callbackShow = function () { /* Do nothing. */ };
    }


    /**
     *
     */
    PageViewTrait.prototype.addTo = function ( object ) {

        Traits.extendWith(object, this, TRAIT_METHOD_LIST);
    }


    /**
     *
     */
    PageViewTrait.prototype.getElement = function () {

        var result = this._panel;

        return result;
    }


    /**
     *
     */
    PageViewTrait.prototype.getTitle = function () {

        var result = this._title;

        return result;
    }


    /**
     *
     */
    PageViewTrait.prototype.onShow = function ( isVisible ) {

        this._log.info("View is now {0}", (isVisible ? "shown" : "hidden"));
        this._callbackShow(isVisible);
    }


    /**
     * Defines the callback for the "show" event.
     */
    PageViewTrait.prototype.setOnShowListener = function ( callback ) {

        this._callbackShow = callback;
    }


    return PageViewTrait;
});
