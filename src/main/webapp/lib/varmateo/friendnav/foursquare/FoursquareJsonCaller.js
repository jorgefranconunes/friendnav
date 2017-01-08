/**************************************************************************
 *
 * Copyright (c) 2012-2016 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * Manages the REST calls for the Foursquare API.
 */
varmateo.defineClass(

"varmateo.friendnav.foursquare.FoursquareJsonCaller",

function () {

    var Logger = varmateo.load("varmateo.util.logging.Logger");


    var URL_PREFIX = "https://api.foursquare.com/v2/";
    var API_VERSION = "20120610";
    var API_MODE = "foursquare";

    FoursquareJsonCaller.prototype._logger    = null;
    FoursquareJsonCaller.prototype._urlPrefix = null;


    /**
     *
     */
    function FoursquareJsonCaller () {

        var logger = Logger.createFor("FoursquareJsonCaller");

        this._logger    = logger;
        this._urlPrefix = URL_PREFIX;
    }


    /**
     * @return Promise
     */
    FoursquareJsonCaller.prototype.doGet = function (
        endpoint,
        params ) {

        var promise = this._submitRequest('GET', endpoint, params);

        return promise;
    }


    /**
     * @return Promise
     */
    FoursquareJsonCaller.prototype.doPost = function (
        endpoint,
        params ) {

        var promise = this._submitRequest('POST', endpoint, params);

        return promise;
    }


    /**
     * @param type One of "GET", "POST".
     *
     * @return Promise
     */
    FoursquareJsonCaller.prototype._submitRequest = function (
        type,
        endpoint,
        params ) {

        var self = this;
        var promise =
            Q.Promise(function ( resolve, reject ) {
                self._doSubmitRequest(type, endpoint, params, resolve, reject);
            });

        return promise;
    }


    /**
     * @param type One of "GET", "POST".
     */
    FoursquareJsonCaller.prototype._doSubmitRequest = function (
        type,
        endpoint,
        params,
        promiseResolve,
        promiseReject) {

        var self = this;
        var url = this._urlPrefix + endpoint;
        var successCallback = function ( data ) {
            self._onSuccess(endpoint, data, promiseResolve, promiseReject);
        };
        var errorCallback   = function(jqXHR, status, error) {
            self._onError(endpoint, status, error, promiseReject);
        };

        var requestParams =
            R.merge(params, {
                "v" : API_VERSION,
                "m" : API_MODE
            });

        var ajaxData = {
            url      : url,
            type     : type,
            dataType : "jsonp",
            data     : requestParams,
            success  : successCallback,
            error    : errorCallback
        };

        this._logger.info("Submiting {0} request for \"{1}\"", type, url);
        this._logger.infoObj(requestParams);

        jQuery.ajax(ajaxData);
    }


    /**
     * Called when the AJAX request is successfull.
     */
    FoursquareJsonCaller.prototype._onSuccess = function (
        endpoint,
        data,
        promiseResolve,
        promiseReject) {

        var responseCode = data.meta && data.meta.code;

        if ( responseCode == "200" ) {
            this._logger.info(
                "Response from \"{0}\" signals success",
                endpoint);

            promiseResolve(data.response);
        } else {
            var meta = data.meta;
            var errorType = meta && meta.errorType;
            var errorDetail = meta && meta.errorDetail;

            this._logger.info("Request for \"{0}\" failed:", endpoint);
            this._logger.info("\tResponse code : {0}", responseCode);
            this._logger.info("\tError type    : {0}", errorType);
            this._logger.info("\tError detail  : {0}", errorDetail);

            promiseReject(errorDetail);
        }
    }


    /**
     * Called when the AJAX request fails.
     */
    FoursquareJsonCaller.prototype._onError = function (
        endpoint,
        status,
        error,
        promiseReject ) {

        this._logger.info(
            "Request for \"{0}\" failed with {1} ({2})",
            endpoint,
            status,
            error);

        promiseReject(error);
    }


    return FoursquareJsonCaller;
});
