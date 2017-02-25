/**************************************************************************
 *
 * Copyright (c) 2017 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * Development environment set of configuration parameters for the
 * FNav application.
 */
define(function ( require ) {

    var ConfigTrait = require("varmateo/util/ConfigTrait");


    var _params = {
        "HomePageView.urlFoursquare" : "https://foursquare.com/oauth2/authenticate?client_id=YWDNHROEVRQYDVY0QMFEBANSS43AMHPALDB3Z31HRX3KLAP3&response_type=token&redirect_uri=http%3A%2F%2Flocalhost%2Ffriendnav%2Ffnav%2Findex.html%3FserviceType%3Dfoursquare",
    };


    /**
     *
     */
    function FnavAppConfigDev() {

        var trait = new ConfigTrait(_params);
        trait.addTo(this);
    }


    return FnavAppConfigDev;
});
