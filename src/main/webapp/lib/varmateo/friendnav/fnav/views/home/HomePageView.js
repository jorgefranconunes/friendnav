/**************************************************************************
 *
 * Copyright (c) 2012-2016 Jorge Nunes All Rights Reserved.
 *
 **************************************************************************/

"use strict";

varmateo.namespace("varmateo.friendnav.fnav.views.home");





/**************************************************************************
 *
 * The view for the entry of the application.
 *
 **************************************************************************/

varmateo.friendnav.fnav.views.home.HomePageView = (function() {

    var SimpleLogger = varmateo.util.logging.SimpleLogger;
    var JQueryUtils  = varmateo.util.jquery.JQueryUtils;





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

    HomePageView.prototype.getElement = function () {

        var result = this._panel;

        return result;
    }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

    HomePageView.prototype.showEvent = function ( isVisible ) {

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

    HomePageView.prototype.onShow = function ( callback ) {

            this._callbackShow = callback;
        }





    return HomePageView;

})();

