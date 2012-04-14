/**************************************************************************
 *
 * Copyright (c) 2012 PDMFC, All Rights Reserved.
 *
 **************************************************************************/

"use strict";

pdmfc.namespace("pdmfc.friendnav.fnav.views.home");





/**************************************************************************
 *
 * The view for the entry of the application.
 *
 **************************************************************************/

pdmfc.friendnav.fnav.views.home.HomePageView = (function() {

        var SimpleLogger = pdmfc.util.logging.SimpleLogger;
        var JQueryUtils  = pdmfc.util.jquery.JQueryUtils;





        HomePageView.prototype._logger       = null;
        HomePageView.prototype._panel        = null;
        HomePageView.prototype._callbackShow = null;





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        function HomePageView ( panelId ) {

            var logger = SimpleLogger.createFor("HomePageView");

            logger.info("Seting up with panel \"{0}\"...", panelId);

            this._logger      = logger;
            this._panel       = JQueryUtils.getOne(panelId);
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        HomePageView.prototype.getElement =
        function () {

            var result = this._panel;

            return result;
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        HomePageView.prototype.showEvent =
        function ( isVisible ) {

            this._logger.info("View is now {0}",
                              (isVisible ? "shown" : "hidden"));

            var callback = this._callbackShow;

            if ( callback != null ) {
                callback(isVisible);
            }
        }





/**************************************************************************
 *
 * Defines the callback for the "show" event.
 *
 **************************************************************************/

        HomePageView.prototype.onShow =
        function ( callback ) {

            this._callbackShow = callback;
        }





        return HomePageView;
    })();





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

