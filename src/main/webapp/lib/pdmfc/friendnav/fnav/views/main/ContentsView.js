/**************************************************************************
 *
 * Copyright (c) 2012 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";

pdmfc.namespace("pdmfc.friendnav.fnav.views.main");





/**************************************************************************
 *
 * A panel for managing transitions between panels on the main
 * contents area.
 *
 * The page objects are expected to respond to the following methods:
 *
 * * getElement() - Returns the jQuery or DOM object to display inside
 *   the container panel.
 *
 * * showEvent(isVisible) - Will be called when the view has just been
 *   made visible or invisible. The "isVisible" flag is a boolean.
 *
 **************************************************************************/

pdmfc.friendnav.fnav.views.main.ContentsView = (function() {

        var JQueryUtils               =
            pdmfc.util.jquery.JQueryUtils;
        var TransitionManagerFactory  =
            pdmfc.util.transitions.TransitionManagerFactory;





        var DEFAULT_TRANSITION_TYPE = "fadeoutin";

        ContentsView.prototype._transitionManager = null;
        ContentsView.prototype._container         = null;
        ContentsView.prototype._currentPage       = null;





/**************************************************************************
 *
 * @param panelId - The ID of the DOM element that will contain the
 * panels to display.
 *
 **************************************************************************/

        function ContentsView ( panelId ) {

            this._transitionManager =
                TransitionManagerFactory.get(DEFAULT_TRANSITION_TYPE);

            this._container = JQueryUtils.getOne(panelId);
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        ContentsView.prototype.showPage =
        function ( nextPage ) {

            if ( nextPage !== this._currentPage ) {
                var container = this._container;
                var fromPage  = this._currentPage;
                var fromPanel = (fromPage!=null) ? fromPage.getElement() : null;
                var nextPanel = nextPage.getElement();

                this._showPage(container,
                               fromPanel,
                               fromPage,
                               nextPanel,
                               nextPage);
            } else {
                // We are already displaying the given page. Nothing
                // to do...
            }
        }





/**************************************************************************
 *
 * Handles the transition between pages.
 *
 **************************************************************************/

        ContentsView.prototype._showPage =
        function ( container,
                   fromPanel,
                   fromPage,
                   nextPanel,
                   nextPage ) {

            var transitionCallbacks = {
                fromEndedTransition : function () {
                    if ( fromPage != null ) {
                        fromPage.showEvent(false);
                    }
                },
                toStartedTransition : function () {
                    nextPage.showEvent(true);
                }
            };

            this._transitionManager.transition(container,
                                               fromPanel,
                                               nextPanel,
                                               transitionCallbacks);

            this._currentPage  = nextPage;
        }





        return ContentsView;

    }) ();





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

