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

            var result = {
                id        : fsqUser.id,
                firstName : fsqUser.firstName,
                lastName  : fsqUser.lastName,
                email     : fsqUser.contact ? fsqUser.contact.email : null,
                photoUrl  : fsqUser.photo,
            };

            return result;
        }





        return Foursquare;

    })();





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

