/**************************************************************************
 *
 * Copyright (c) 2012 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";

pdmfc.namespace("pdmfc.friendnav.foursquare");





/**************************************************************************
 *
 * A concrete implementation of the SocialNetworkManager that uses
 * Foursquare as provider.
 *
 **************************************************************************/

pdmfc.friendnav.foursquare.Foursquare = (function() {

        var SimpleLogger  = pdmfc.util.logging.SimpleLogger;
        var FsqJsonCaller = pdmfc.friendnav.foursquare.FsqJsonCaller;





        var PARAM_ACCESS_TOKEN = "oauth_token";

        Foursquare.prototype._logger      = null;
        Foursquare.prototype._accessToken = null;
        Foursquare.prototype._jsonCaller  = null;





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        function Foursquare () {

            var logger = SimpleLogger.createFor("Foursquare");

            this._logger     = logger;
            this._jsonCaller = new FsqJsonCaller();
        }





/**************************************************************************
 *
 * Sets the OAuth acess token to be used on all API calls that require
 * authentication.
 *
 **************************************************************************/

        Foursquare.prototype.setAccessToken =
        function ( accessToken ) {

            this._accessToken = accessToken;
        }





/**************************************************************************
 *
 * Retrieves data on the user currently signed-in.
 *
 * @param callback Function called when the user data is retrieved
 * from Foursquare. This function will be called with a single
 * UserNode instance.
 *
 **************************************************************************/

        Foursquare.prototype.retrieveSelfUserNode =
        function ( callback ) {

            var self            = this;
            var endpoint        = "users/self";
            var callParams      = {}
            var requestCallback = function ( response ) {
                var userNode = null;
                
                if ( response != null ) {
                    var fsqUser = response.user;
                    userNode = buildUserNodeFromFsqUser(fsqUser);
                }

                callback(userNode);
            };

            this._doGetAuth(endpoint, callParams, requestCallback);
        }





/**************************************************************************
 *
 * Retrieves the list of friends for the given user.
 *
 * @param userId
 *
 * @param callback Function called when data is retrieved. Will be
 * called a list of UserNode as argument.
 *
 **************************************************************************/

        Foursquare.prototype.retrieveFriendsList =
        function ( userId,
                   callback ) {

            var self            = this;
            var endpoint        = "users/" + userId + "/friends";
            var callParams      = {}
            var requestCallback = function ( response ) {
                var userNodeList = null;
                
                if ( response != null ) {
                    var fsqUserList = response.friends.items;

                    userNodeList =
                        buildUserNodeListFromFsqUserList(fsqUserList);
                }

                callback(userNodeList);
            };

            this._doGetAuth(endpoint, callParams, requestCallback);
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        Foursquare.prototype._doGetAuth =
        function ( endpoint,
                   params,
                   callback ) {

            this._checkAccessToken();

            var callParams = jQuery.extend({}, params);
            callParams[PARAM_ACCESS_TOKEN] = this._accessToken;

            this._jsonCaller.doGet(endpoint, callParams, callback);
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        Foursquare.prototype._checkAccessToken =
        function () {

            if ( this._accessToken == null ) {
                var msg = "Message token has not yet been set";
                throw msg;
            }
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        function buildUserNodeFromFsqUser ( fsqUser ) {

            var name          = buildName(fsqUser);
            var photoUrl      = fsqUser.photo;

            // This is a hack. We should have an official procedure
            // for obtaining the lasr photo for the user...
            var largePhotoUrl =
                photoUrl.replace("/userpix_thumbs/", "/userpix/");

            var result = {
                id            : fsqUser.id,
                firstName     : fsqUser.firstName,
                lastName      : fsqUser.lastName,
                name          : name,
                email         : fsqUser.contact ? fsqUser.contact.email : null,
                photoUrl      : fsqUser.photo,
                largePhotoUrl : largePhotoUrl
            };

            return result;
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

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





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        function buildUserNodeListFromFsqUserList ( fsqUserList ) {

            var userNodeList = [];

            for ( var i=0, size=fsqUserList.length; i<size; ++i ) {
                var fsqUser     = fsqUserList[i];
                var fsqUserType = fsqUser.type;
                
                if ( (fsqUserType===undefined) || (fsqUserType=="user") ) {
                    var userNode = buildUserNodeFromFsqUser(fsqUser);

                    userNodeList.push(userNode);
                } else {
                    // Either a "page" or a "celebrity". We don't care
                    // about those...
                }
            }

            return userNodeList;
        }





        return Foursquare;

    })();





/**************************************************************************
 *
 * 
 *
 **************************************************************************/
