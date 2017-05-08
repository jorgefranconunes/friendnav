/**************************************************************************
 *
 * Copyright (c) 2012-2017 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * A concrete implementation of the SocialNetworkManager that uses
 * FoursquareFriendsService as provider.
 */
define(function ( require ) {

    var Logger =
        require("varmateo/util/logging/Logger");
    var FoursquareJsonCaller =
        require("varmateo/friendnav/foursquare/FoursquareJsonCaller");


    /**
     * @param (String) The OAuth access token to be used on all API
     * calls that require authentication.
     */
    function FoursquareFriendsService ( accessToken ) {

        var instance = {};

        var logger = Logger.createFor("FoursquareFriendsService");

        var _logger = logger;
        var _accessToken = accessToken;
        var _jsonCaller = new FoursquareJsonCaller();


        /**
         * Retrieves data on the user currently signed-in.
         *
         * The returned promise will be resolved when the user data is
         * retrieved from FoursquareFriendsService. This promise will
         * be resolved with one UserNode instance.
         *
         * @return Promise UserNode
         */
        instance.retrieveSelfUserNode = function () {

            var endpoint = "users/self";
            var requestParams = {};

            var promise =
                _doGetWithAuth(endpoint, requestParams)
                .then(function ( response ) {
                    return response.user;
                })
                .then(_buildUserNodeFromFsqUser);

            return promise;
        }


        /**
         * Retrieves the list of friends for the given user.
         *
         * The returned promise will be resolved when the user data is
         * retrieved from FoursquareFriendsService. This promise will
         * be resolved with a list of UserNode instances.
         *
         * @param userId
         *
         * @return Promise [UserNode]
         */
        instance.retrieveFriendsList = function ( userId ) {

            var endpoint = "users/" + userId + "/friends";
            var requestParams = {};

            var promise =
                this._doGetWithAuth(endpoint, requestParams)
                .then(function ( response ) {
                    return response.friends.items;
                })
                .then(_buildUserNodeListFromFsqUserList);

            return promise;
        }


        /**
         *
         */
        function _doGetWithAuth (
            endpoint,
            params ) {

            _checkAccessToken();

            var requestParams =
                R.merge(params, {
                    "oauth_token" : _accessToken
                });

            return _jsonCaller.doGet(endpoint, requestParams);
        }


        /**
         *
         */
        function _checkAccessToken () {

            if ( _accessToken == null ) {
                var msg = "Message token has not yet been set";
                throw msg;
            }
        }


        /**
         *
         */
        function _buildUserNodeFromFsqUser ( fsqUser ) {

            var name = _buildName(fsqUser);
            var photo = fsqUser.photo;
            var photoUrl = photo.prefix + "100x100" + photo.suffix;
            var largePhotoUrl = photo.prefix + "300x300" + photo.suffix;

            var result = {
                id            : fsqUser.id,
                firstName     : fsqUser.firstName,
                lastName      : fsqUser.lastName,
                name          : name,
                email         : fsqUser.contact ? fsqUser.contact.email : null,
                photoUrl      : photoUrl,
                largePhotoUrl : largePhotoUrl
            };

            return result;
        }


        /**
         *
         */
        function _buildName ( fsqUser ) {

            var firstName = fsqUser.firstName;
            var lastName  = fsqUser.lastName;
            var name      = null;

            if ( firstName != null ) {
                if ( lastName != null ) {
                    name = firstName + " " + lastName;
                } else {
                    name = firstName;
                }
            } else {
                if ( lastName != null ) {
                    name = lastName;
                } else {
                    name = "";
                }
            }

            return name;
        }


        /**
         *
         */

        // We will be interested only in Foursquare users of type
        // "user". Everything eles is either a "page" or "celebrity",
        // which we do not care about.
        var isFoursquareUser =
            R.pipe(R.propOr("user", "type"), R.equals("user"));

        var compareUserNodesByName = function ( a, b ) {
            var s1 = a.name.toLocaleLowerCase();
            var s2 = b.name.toLocaleLowerCase();
            return s1.localeCompare(s2);
        };

        var _buildUserNodeListFromFsqUserList = R.pipe(
            R.filter(isFoursquareUser),
            R.map(_buildUserNodeFromFsqUser),
            R.sort(compareUserNodesByName));

        return instance;
    }


    return FoursquareFriendsService;
});
