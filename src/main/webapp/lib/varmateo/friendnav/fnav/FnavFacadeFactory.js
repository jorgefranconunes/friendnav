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

    var CookieManager = require("varmateo/util/CookieManager");
    var Memoizer = require("varmateo/util/Memoizer");
    var FriendsServiceManager =
        require("varmateo/friendnav/FriendsServiceManager");
    var FoursquareFriendsServiceFactory =
        require("varmateo/friendnav/foursquare/FoursquareFriendsServiceFactory");


    /**
     *
     */
    function FnavFacadeFactory () {

        var self = this;
        var configList = [{
            name : "CookieManager",
            builder : function () {
                return new CookieManager();
            },
        }, {
            name : "FoursquareFriendsServiceFactory",
            builder : function () {
                return new FoursquareFriendsServiceFactory();
            },
        }, {
            name : "FriendsServiceManager",
            builder : function () {
                return self._newFriendsServiceManager();
            },
        },];
        var memoizer = new Memoizer(configList);

        memoizer.extendTo(this);
    }


    /**
     *
     */
    FnavFacadeFactory.prototype._newFriendsServiceManager = function () {

        return new FriendsServiceManager(
            this.getCookieManager(),
            this.getFoursquareFriendsServiceFactory());
    }


    return FnavFacadeFactory;
});
