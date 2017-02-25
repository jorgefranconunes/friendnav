/**************************************************************************
 *
 * Copyright (c) 2017 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * 
 */
define(function ( require ) {

    var Logger = require("varmateo/util/logging/Logger");


    var COOKIE_SESSION_INFO = "FnavSessionInfo";

    FriendsServiceManager.prototype._log = null;
    FriendsServiceManager.prototype._cookie = null;
    FriendsServiceManager.prototype._serviceFactories = null;
    FriendsServiceManager.prototype._friendsService = null;


    /**
     *
     */
    function FriendsServiceManager (
        cookieManager,
        serviceFactories ) {

        var log = Logger.createFor("FriendsServiceManager");

        this._log = log;
        this._cookie = cookieManager.getCookie(COOKIE_SESSION_INFO);
        this._serviceFactories = serviceFactories;
        this._friendsService = null;
    }


    /**
     * Attempts to initiate a session.
     *
     * @return True if the session was initiated. False otherwise.
     */
    FriendsServiceManager.prototype.startSession = function ( url ) {

        var isSessionStarted = false;
        var sessionInfo = this._loadSessionInfoFromUrl(url);

        if ( sessionInfo == null ) {
            sessionInfo = this._loadSessionInfoFromCookie(this._cookie);
        }

        if ( sessionInfo != null ) {
            this._log.info("User is signed in:");
            this._log.info("    Session type  : {0}", sessionInfo.type);
            this._log.info("    Session token : {0}", sessionInfo.token);
            this._saveSessionInfoToCookie(this._cookie, sessionInfo);
            this._friendsService =
                sessionInfo.serviceFactory.newInstance(sessionInfo.token)
        } else {
            this._log.info("User is not yet signed in.");
            this._friendsService = null;
        }

        return this._friendsService != null;
    }


    /**
     *
     */
    FriendsServiceManager.prototype._loadSessionInfoFromUrl = function ( url ) {

        var sessionInfo = null;
        var type = this._loadServiceTypeFromUrl(url);

        if ( type != null ) {
            var serviceFactory = this._serviceFactories[type];

            if ( serviceFactory != null ) {
                var token = serviceFactory.parseTokenFromUrl(url);

                if ( token != null ) {
                    this._log.info("Session info is contained in URL");
                    sessionInfo = {
                        "type" : type,
                        "token" : token,
                        "serviceFactory" : serviceFactory,
                    };
                } else {
                    this._log.info("Session info is not contained in URL");
                    sessionInfo = null;
                }
            } else {
                this._log.info("Unknown service type \"{0}\"", type);
            }
        }

        return sessionInfo;
    }


    /**
     *
     */
    FriendsServiceManager.prototype._loadServiceTypeFromUrl = function ( url ) {

        var serviceType = null;

        // This is an awful way to parse an URL...
        var prefix = "?serviceType="
        var paramIndex = url.indexOf(prefix);

        if ( paramIndex >= 0 ) {
            var hashIndex = url.indexOf("#");
            if ( hashIndex >= 0 ) {
                serviceType =
                    url.substring(paramIndex + prefix.length, hashIndex);
            } else {
                serviceType =
                    url.substring(paramIndex + prefix.length);
            }
            this._log.info("Service type is contained in URL ({0})",serviceType);
        } else {
            serviceType = "foursquare";
            this._log.info(
                "Service type is not contained in URL, defaulting to \"{0}\"",
                serviceType);
        }

        return serviceType;
    }


    /**
     *
     */
    FriendsServiceManager.prototype._loadSessionInfoFromCookie = function (
        cookie
    ) {
        var cookieValue = cookie.get();
        var sessionInfo = null;

        if ( cookieValue != null ) {
            var colonIndex = cookieValue.indexOf(":");
            if ( colonIndex >= 0 ) {
                var type = cookieValue.substring(0, colonIndex);
                var token = cookieValue.substring(colonIndex+1);
                if ( R.has(type, this._serviceFactories) ) {
                    this._log.info("Session info is contained in cookie");
                    sessionInfo = {
                        "type" : type,
                        "token" : token,
                        "serviceFactory" : this._serviceFactories[type],
                    };
                } else {
                    this._log.info(
                        "Unknown service type \"{0}\" in cookie", type);
                }
            } else {
                this._log.info(
                    "Unexpected value (\"{0}\") in cookie", cookieValue);
            }
        } else {
            this._log.info("Session info is not contained in cookie");
        }

        return sessionInfo;
    }


    /**
     *
     */
    FriendsServiceManager.prototype._saveSessionInfoToCookie = function (
        cookie,
        sessionInfo ) {

        var cookieValue = sessionInfo.type + ":" + sessionInfo.token;

        cookie.set(cookieValue);
    }


    /**
     *
     */
    FriendsServiceManager.prototype.endSession = function () {

        this._friendsService = null;
        this._cookie.remove();
    }


    /**
     *
     */
    FriendsServiceManager.prototype.getFriendsService = function () {

        if ( this._friendsService == null ) {
            var msg = "Session has not been initiated";
            throw msg;
        }

        return this._friendsService;
    }


    return FriendsServiceManager;
});
