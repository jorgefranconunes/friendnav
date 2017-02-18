/**************************************************************************
 *
 * Copyright (c) 2016-2017 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 *
 */
define(function ( require ) {

    var Memoizer =
        require("varmateo/util/Memoizer");
    var FoursquareFriendsFacade =
        require("varmateo/friendnav/foursquare/FoursquareFriendsFacade");


    /**
     *
     */
    function FnavFacadeFactory () {

        var configList = [
            {
                name : "FriendsFacade",
                builder : function () {
                    return new FoursquareFriendsFacade();
                },
            },
        ];
        var memoizer = new Memoizer(configList);

        memoizer.extendTo(this);
    }


    return FnavFacadeFactory;
});
