/**************************************************************************
 *
 * Copyright (c) 2012-2017 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * A concrete implementation of the SocialNetworkManager that uses
 * FoursquareFriendsFacade as provider.
 */
define(function ( require ) {

    var Logger =
        require("varmateo/util/logging/Logger");
    var FoursquareJsonCaller =
        require("varmateo/friendnav/foursquare/FoursquareJsonCaller");


    FoursquareFriendsFacade.prototype._logger = null;
    FoursquareFriendsFacade.prototype._accessToken = null;
    FoursquareFriendsFacade.prototype._jsonCaller = null;


    /**
     *
     */
    function FoursquareFriendsFacade () {

        var logger = Logger.createFor("FoursquareFriendsFacade");

        this._logger = logger;
        this._jsonCaller = new FoursquareJsonCaller();
    }


    /**
     * Sets the OAuth acess token to be used on all API calls that
     * require authentication.
     */
    FoursquareFriendsFacade.prototype.setAccessToken = function ( accessToken ) {

        this._accessToken = accessToken;
    }


    /**
     * Retrieves data on the user currently signed-in.
     *
     * The returned promise will be resolved when the user data is
     * retrieved from FoursquareFriendsFacade. This promise will be resolved with a
     * single UserNode instance.
     *
     * @return Promise
     */
    FoursquareFriendsFacade.prototype.retrieveSelfUserNode = function () {

        var self = this;
        var endpoint = "users/self";
        var requestParams = {};

        var promise =
            this._doGetWithAuth(endpoint, requestParams)
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
     * retrieved from FoursquareFriendsFacade. This promise will be resolved with a
     * list of UserNode instances.
     *
     * @param userId
     *
     * @return Promise
     */
    FoursquareFriendsFacade.prototype.retrieveFriendsList = function ( userId ) {

        var self = this;
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
    FoursquareFriendsFacade.prototype._doGetWithAuth = function (
        endpoint,
        params ) {

        this._checkAccessToken();

        var requestParams =
            R.merge(params, {
                "oauth_token" : this._accessToken
            });

        return this._jsonCaller.doGet(endpoint, requestParams);
    }


    /**
     *
     */
    FoursquareFriendsFacade.prototype._checkAccessToken = function () {

        if ( this._accessToken == null ) {
            var msg = "Message token has not yet been set";
            throw msg;
        }
    }


    /**
     *
     */
    function _buildUserNodeFromFsqUser ( fsqUser ) {

        var name = buildName(fsqUser);
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
    function buildName ( fsqUser ) {

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
    function _buildUserNodeListFromFsqUserList ( fsqUserList ) {

        var userNodeList = [];

        for ( var i=0, size=fsqUserList.length; i<size; ++i ) {
            var fsqUser     = fsqUserList[i];
            var fsqUserType = fsqUser.type;

            if ( (fsqUserType===undefined) || (fsqUserType=="user") ) {
                var userNode = _buildUserNodeFromFsqUser(fsqUser);

                userNodeList.push(userNode);
            } else {
                // Either a "page" or a "celebrity". We don't care
                // about those...
            }
        }

        userNodeList.sort(function ( a, b ) {
            var s1 = a.name.toLocaleLowerCase();
            var s2 = b.name.toLocaleLowerCase();
            return s1.localeCompare(s2);
        });

        return userNodeList;
    }


    return FoursquareFriendsFacade;
});
