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

    var Foursquare =
        varmateo.load("varmateo.friendnav.foursquare.Foursquare");


    /**
     *
     */
    function FnavFacadeFactory () {

        var configList = [
            {
                name : "FriendsFacade",
                builder : function () {
                    return new Foursquare();
                },
            },
        ];
        var memoizer = new Memoizer(configList);

        memoizer.extendTo(this);
    }


    return FnavFacadeFactory;
});
