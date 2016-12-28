/**************************************************************************
 *
 * Copyright (c) 2011-2016 Jorge Nunes All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * Manages panel transitions where the outgoing panel fades out just
 * before the incoming panel fades in.
 */
varmateo.defineClass(

"varmateo.util.transitions.FadeOutInTransitionManager",

function() {

    var Logger             =
        varmateo.load("varmateo.util.logging.Logger");


    FadeOutInTransitionManager.prototype._logger = null;


    /**
     * The constructor.
     */
    function FadeOutInTransitionManager() {

        this._logger = Logger.createFor("FadeOutInTransitionManager");
    }


    /**
     *
     */
    FadeOutInTransitionManager.prototype.transition = function (
        panelContainer,
        panelFrom,
        panelTo,
        callbacks ) {

        if ( panelFrom != null ) {
            this._startFadeOut(panelContainer, panelFrom, panelTo, callbacks);
        } else {
            this._startFadeIn(panelContainer, panelFrom, panelTo, callbacks);
        }
    }


    /**
     *
     */
    FadeOutInTransitionManager.prototype._startFadeOut = function (
        panelContainer,
        panelFrom,
        panelTo,
        callbacks ) {

        var self = this;

        if ( panelFrom != null ) {
            this._logger.info("Starting fade out...");
            _maybeCall(callbacks, "fromStartedTransition");

            var callbackEndFadeOut = function () {
                self._onEndFadeOut(panelContainer, panelFrom, panelTo,callbacks);
            };
            panelFrom.fadeOut(callbackEndFadeOut);
        }
    }


    /**
     *
     */
    FadeOutInTransitionManager.prototype._onEndFadeOut = function (
        panelContainer,
        panelFrom,
        panelTo,
        callbacks ) {

        this._logger.info("Ended fadeout.");
        panelFrom.detach();
        _maybeCall(callbacks, "fromEndedTransition");
        this._startFadeIn(panelContainer, panelFrom, panelTo, callbacks);
    }


    /**
     *
     */
    FadeOutInTransitionManager.prototype._startFadeIn = function (
        panelContainer,
        panelFrom,
        panelTo,
        callbacks ) {

        var self = this;

        this._logger.info("Starting fade in...");
        panelTo.appendTo(panelContainer);

        _maybeCall(callbacks, "toStartedTransition");

        var callbackEndFadeIn = function () {
            self._onEndFadeIn(callbacks);
        };

        panelTo.fadeIn(callbackEndFadeIn);
    }


    /**
     *
     */
    FadeOutInTransitionManager.prototype._onEndFadeIn = function ( callbacks ) {

        this._logger.info("Ended fade in.");
        _maybeCall(callbacks, "toEndedTransition");
    }


    /**
     *
     */
    function _maybeCall (
        object,
        methodName ) {

        if ( object != null ) {
            var method = object[methodName];

            if ( method != null ) {
                method();
            }
        }
    }

    return FadeOutInTransitionManager;
});
