/**************************************************************************
 *
 * Copyright (c) 2016-2017 Jorge Nunes All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * Widget displaying a spinning icon, It is intended to convey to the
 * user the application is waiting some background processing to
 * complete (e.g. loading data from the server side).
 */
define(function ( require ) {

    ActivityIndicatorView.prototype._panel = null;


    /**
     *
     */
    function ActivityIndicatorView () {

        var loaderIcon =
            jQuery("<img>")
            .attr("src","resources/img/content-loader.gif");
        var panel =
            jQuery("<div>")
            .css("text-align", "center")
            .append(loaderIcon);

        this._panel = panel;
    }


    /**
     *
     */
    ActivityIndicatorView.prototype.getElement = function () {

        return this._panel;
    }


    return ActivityIndicatorView;
});
