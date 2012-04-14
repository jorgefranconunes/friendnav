/**************************************************************************
 *
 * Copyright (c) 2011-2012 PDMFC, All Rights Reserved.
 *
 **************************************************************************/

"use strict";

pdmfc.namespace("pdmfc.util.transitions");





/**************************************************************************
 *
 * Factory for transition managers.
 *
 **************************************************************************/

pdmfc.util.transitions.TransitionManagerFactory = (function() {

        var MessageFormat = pdmfc.util.text.MessageFormat;





        // Keys are transition types. Values are Objects implementing
        // the TransitionManager interface.
        var _transitionManagerMap = {};





/**************************************************************************
 *
 * The static constructor.
 *
 **************************************************************************/

        (function () {

            var noneTransitionManager = new
                NoneTransitionManager();
            
            _register("none", noneTransitionManager);

        })();





/**************************************************************************
 *
 * The constructor.
 *
 **************************************************************************/

        function TransitionManagerFactory() {

            throw "TransitionManagerFactory private constructor...";
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        function _register ( transitionType,
                             transitionManager ) {

            var current = _transitionManagerMap[transitionType];

            if ( current !== undefined ) {
                var msgFmt = "Transition type \"{0}\" already registered";
                var msg    = MessageFormat.format(msgFmt, transitionType);
                throw msg;
            }

            _transitionManagerMap[transitionType] = transitionManager;
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        function _get ( transitionType ) {

            var transitionManager = _transitionManagerMap[transitionType];

            if ( transitionManager === undefined ) {
                var msgFmt = "No transition type \"{0}\" registered";
                var msg    = MessageFormat.format(msgFmt, transitionType);
                throw msg;
            }

            return transitionManager;
        }





/**************************************************************************
 *
 * Define the public static methods for the TransactionManagerFactory
 * class.
 *
 **************************************************************************/

        TransitionManagerFactory.get      = _get;
        TransitionManagerFactory.register = _register;





/**************************************************************************
 *
 * A transition manager that uses no transitions.
 *
 **************************************************************************/

        function NoneTransitionManager () {
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        NoneTransitionManager.prototype.transition =
        function ( panelContainer,
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





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        function _maybeCall ( object,
                              methodName ) {

            if ( object != null ) {
                var method =object[methodName];

                if ( method != null ) {
                    method();
                }
            }
        }




        return TransitionManagerFactory;


    })();





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

