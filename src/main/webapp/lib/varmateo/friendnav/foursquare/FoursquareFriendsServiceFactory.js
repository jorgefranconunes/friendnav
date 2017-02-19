/**************************************************************************
 *
 * Copyright (c) 2017 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * A concrete implementation of the SocialNetworkManager that uses
 * FoursquareFriendsService as provider.
 */
define(function ( require ) {

    var FoursquareFriendsService =
        require("varmateo/friendnav/foursquare/FoursquareFriendsService");


    /**
     * 
     */
    function FoursquareFriendsServiceFactory () {
        // Nothing to do. Really.
    }


    /**
     * @param (String) url - The callback URL invoked after successful
     * authentication through OAuth2. Or not.
     *
     * @return (String) The OAuth2 access token if it was present in
     * the given URL. Null otherwise.
     */
    FoursquareFriendsServiceFactory.prototype.parseTokenFromUrl = function (
        url ) {

        var token = null;

        var urlHashIndex = url.indexOf("#");
        if ( urlHashIndex >= 0 ) {
            var urlHash = url.substring(urlHashIndex+1);
            var expectedPrefix = "access_token=";
            if ( urlHash.indexOf(expectedPrefix) == 0 ) {
                token = urlHash.substring(expectedPrefix.length);
            } else {
                // No access token in the hash part of the
                // URL. Slightly enerving...
            }
        } else {
            // URL has no hash sign. So URL does not contain access
            // token.
        }

        return token;
    }


    /**
     *
     */
    FoursquareFriendsServiceFactory.prototype.newInstance = function ( token ) {

        return new FoursquareFriendsService(token);
    }


    return FoursquareFriendsServiceFactory;
});
