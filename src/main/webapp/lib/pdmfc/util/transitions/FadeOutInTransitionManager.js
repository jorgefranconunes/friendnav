/**************************************************************************
 *
 * Copyright (c) 2011-2012 PDMFC, All Rights Reserved.
 *
 **************************************************************************/

"use strict";

pdmfc.namespace("pdmfc.util.transitions");





/**************************************************************************
 *
 * Manages panel transitions where the outgoing panel fades out just
 * before the incoming panel fades in.
 *
 **************************************************************************/

pdmfc.util.transitions.FadeOutInTransitionManager = (function() {

        var SimpleLogger             =
            pdmfc.util.logging.SimpleLogger;
        var TransitionManagerFactory =
            pdmfc.util.transitions.TransitionManagerFactory;





        var _logger = SimpleLogger.createFor("FadeOutInTransitionManager");





/**************************************************************************
 *
 * The static constructor.
 *
 **************************************************************************/

        (function () {

            var transitionManager = new FadeOutInTransitionManager();

            TransitionManagerFactory.register("fadeoutin", transitionManager);

        })();





/**************************************************************************
 *
 * The constructor.
 *
 **************************************************************************/

        function FadeOutInTransitionManager() {

            // Nothing to do...
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        FadeOutInTransitionManager.prototype.transition =
        function ( panelContainer,
                   panelFrom,
                   panelTo,
                   callbacks ) {

            if ( panelFrom != null ) {
                _startFadeOut(panelContainer, panelFrom, panelTo, callbacks);
            } else {
                _startFadeIn(panelContainer, panelFrom, panelTo, callbacks);
            }
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        function _startFadeOut( panelContainer,
                                panelFrom,
                                panelTo,
                                callbacks ) {

            if ( panelFrom != null ) {
                _logger.info("Starting fade out...");
                _maybeCall(callbacks, "fromStartedTransition");

                var callbackEndFadeOut = function () {
                    _logger.info("Ended fadeout.");
                    panelFrom.detach();
                    _maybeCall(callbacks, "fromEndedTransition");
                    _startFadeIn(panelContainer, panelFrom, panelTo, callbacks);
                };

                panelFrom.fadeOut(callbackEndFadeOut);
            }
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        function _startFadeIn( panelContainer,
                               panelFrom,
                               panelTo,
                               callbacks ) {
            
            _logger.info("Starting fade in...");
            panelTo.appendTo(panelContainer);

            _maybeCall(callbacks, "toStartedTransition");

            var callbackEndFadeIn = function () {
                _logger.info("Ended fade in.");
                _maybeCall(callbacks, "toEndedTransition");
            };

            panelTo.fadeIn(callbackEndFadeIn);
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




        return FadeOutInTransitionManager;


    })();





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

