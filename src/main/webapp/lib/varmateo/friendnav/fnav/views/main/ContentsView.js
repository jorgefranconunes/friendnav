/**************************************************************************
 *
 * Copyright (c) 2012-2017 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * A panel for managing transitions between panels on the main
 * contents area.
 *
 * The page objects are expected to respond to the following methods:
 *
 * * getElement() - Returns the jQuery or DOM object to display inside
 *   the container panel.
 *
 * * onShow(isVisible) - Will be called when the view has just been
 *   made visible or invisible. The "isVisible" flag is a boolean.
 */
define(function ( require ) {

    var JQueryUtils = require("varmateo/util/jquery/JQueryUtils");


    ContentsView.prototype._container         = null;
    ContentsView.prototype._transitionManager = null;
    ContentsView.prototype._currentPage       = null;


    /**
     * @param panelId - The ID of the DOM element that will contain
     * the panels to display.
     */
    function ContentsView (
        panelId,
        transitionManager ) {

        this._container = JQueryUtils.getOne(panelId);
        this._transitionManager = transitionManager;
    }


    /**
     *
     */
    ContentsView.prototype.showPage = function ( nextPage ) {

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


    /**
     * Handles the transition between pages.
     */
    ContentsView.prototype._showPage = function (
        container,
        fromPanel,
        fromPage,
        nextPanel,
        nextPage ) {

        var transitionCallbacks = {
            fromEndedTransition : function () {
                if ( fromPage != null ) {
                    fromPage.onShow(false);
                }
            },
            toStartedTransition : function () {
                nextPage.onShow(true);
            }
        };

        this._transitionManager.transition(
            container,
            fromPanel,
            nextPanel,
            transitionCallbacks);

        this._currentPage  = nextPage;
    }


    return ContentsView;
});
