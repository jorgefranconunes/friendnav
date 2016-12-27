/**************************************************************************
 *
 * Copyright (c) 2016 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 *
 */
varmateo.defineClass(

"varmateo.friendnav.fnav.FnavFacadeFactory",

function() {

    var Memoizer = varmateo.load("varmateo.util.Memoizer");

    var FoursquareFriendsFacade =
        varmateo.load("varmateo.friendnav.foursquare.FoursquareFriendsFacade");


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
