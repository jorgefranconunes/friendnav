/**************************************************************************
 *
 * Copyright (c) 2011-2016 Jorge Nunes All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * Factory for transition managers.
 */
varmateo.defineClass(

"varmateo.util.transitions.TransitionManagerFactory",

function() {

    var MessageFormat = varmateo.load("varmateo.util.text.MessageFormat");


    // Keys are transition types. Values are Objects implementing the
    // TransitionManager interface.
    var _transitionManagerMap = {};


    /**
     * The static constructor.
     */
    (function () {
        var noneTransitionManager = new NoneTransitionManager();
        register("none", noneTransitionManager);
    })();


    /**
     *
     */
    function TransitionManagerFactory() {

        throw "TransitionManagerFactory private constructor...";
    }


    /**
     *
     */
    function register (
        transitionType,
        transitionManager ) {

        var current = _transitionManagerMap[transitionType];

        if ( current !== undefined ) {
            var msgFmt = "Transition type \"{0}\" already registered";
            var msg    = MessageFormat.format(msgFmt, transitionType);
            throw msg;
        }

        _transitionManagerMap[transitionType] = transitionManager;
    }


    /**
     *
     */
    function get ( transitionType ) {

        var transitionManager = _transitionManagerMap[transitionType];

        if ( transitionManager === undefined ) {
            var msgFmt = "No transition type \"{0}\" registered";
            var msg    = MessageFormat.format(msgFmt, transitionType);
            throw msg;
        }

        return transitionManager;
    }


    /**
     * Static methods.
     */
    TransitionManagerFactory.get = get;
    TransitionManagerFactory.register = register;


    /**
     * A transition manager that uses no transitions.
     */
    function NoneTransitionManager () {
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


    return TransitionManagerFactory;
});
