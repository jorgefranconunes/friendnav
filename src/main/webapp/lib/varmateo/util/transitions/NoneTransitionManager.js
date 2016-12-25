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

"varmateo.util.transitions.NoneTransitionManager",

function() {


    /**
     * The constructor.
     */
    function NoneTransitionManager() {
        // Nothing to do.
    }


    /**
     *
     */
    NoneTransitionManager.prototype.transition = function (
        panelContainer,
        panelFrom,
        panelTo,
        callbacks ) {

        if ( panelFrom != null ) {
            _maybeCall(callbacks, "fromStartedTransition");
            panelFrom.detach();
            _maybeCall(callbacks, "fromEndedTransition");
        }

        panelTo.appendTo(panelContainer);
        _maybeCall(callbacks, "toStartedTransition");
        panelTo.show();
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

    return NoneTransitionManager;
});
