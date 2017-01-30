/**************************************************************************
 *
 * Copyright (c) 2012-2017 Jorge Nunes All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * The view for the entry of the application.
 */
define(function ( require ) {

    var Logger = require("varmateo/util/logging/Logger");
    var JQueryUtils  = require("varmateo/util/jquery/JQueryUtils");
    var Links = require("varmateo/friendnav/views/Links");
    var PageViewTrait = require("varmateo/friendnav/views/PageViewTrait");


    var LABEL_TITLE = "Friend Navigator";

    var BUTTON_ID_FOURSQUARE = "#fnvLoginFoursquare";
    var PARAM_URL_FOURSQUARE = "HomePageView.urlFoursquare";


    /**
     *
     */
    function HomePageView (
        panelId,
        appConf ) {

        var logger = Logger.createFor("HomePageView");

        logger.info("Setting up with panel \"{0}\"...", panelId);

        var panel = JQueryUtils.getOne(panelId);
        var trait = new PageViewTrait(logger, LABEL_TITLE, panel);

        trait.addTo(this);

        Links.setOnClickListener(
            JQueryUtils.getOne(BUTTON_ID_FOURSQUARE),
            function () {
                window.location = appConf.get(PARAM_URL_FOURSQUARE);
            });
    }


    return HomePageView;
});
