/**************************************************************************
 *
 * Copyright (c) 2012-2016 Jorge Nunes All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * The view for the entry of the application.
 */
varmateo.defineClass(

"varmateo.friendnav.fnav.views.home.HomePageView",

function() {

    var Logger = varmateo.load("varmateo.util.logging.Logger");
    var JQueryUtils  = varmateo.load("varmateo.util.jquery.JQueryUtils");
    var PageViewTrait = varmateo.load("varmateo.friendnav.views.PageViewTrait");


    var LABEL_TITLE = "Friend Navigator";


    /**
     *
     */
    function HomePageView ( panelId ) {

        var logger = Logger.createFor("HomePageView");
        var panel = JQueryUtils.getOne(panelId);
        var trait = new PageViewTrait(logger, LABEL_TITLE, panel);

        trait.addTo(this);

        logger.info("Setting up with panel \"{0}\"...", panelId);
    }


    return HomePageView;
});
