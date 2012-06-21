/**************************************************************************
 *
 * Copyright (c) 2012 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";

pdmfc.namespace("pdmfc.friendnav.foursquare");





/**************************************************************************
 *
 * Manages the REST calls for the Foursquare API.
 *
 **************************************************************************/

pdmfc.friendnav.foursquare.FsqJsonCaller = (function () {

        var SimpleLogger = pdmfc.util.logging.SimpleLogger;




        var URL_PREFIX        = "https://api.foursquare.com/v2/";
        var PARAM_API_VERSION = "v";
        var API_VERSION       = "20120505";

        FsqJsonCaller.prototype._logger    = null;
        FsqJsonCaller.prototype._urlPrefix = null;





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        function FsqJsonCaller () {

            var logger = SimpleLogger.createFor("FsqJsonCaller");

            this._logger    = logger;
            this._urlPrefix = URL_PREFIX;
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        FsqJsonCaller.prototype.doGet =
        function ( endpoint,
                   params,
                   callback ) {

            this._submitRequest('GET', endpoint, params, callback);
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        FsqJsonCaller.prototype.doPost =
        function ( endpoint,
                   params,
                   callback ) {

            this._submitRequest('POST', endpoint, params, callback);
        }





/**************************************************************************
 *
 * @param type One of "GET", "POST".
 *
 **************************************************************************/

        FsqJsonCaller.prototype._submitRequest =
        function ( type,
                   endpoint,
                   params,
                   callback ) {

            var self            = this;
            var url             = this._urlPrefix + endpoint;
            var successCallback = function ( data ) {
                self._handleSuccess(endpoint, data, callback);
            };
            var errorCallback   = function(jqXHR, status, error) {
                self._handleError(endpoint, jqXHR, status, error, callback);
            };
            
            var requestParams = jQuery.extend({}, params);
            requestParams[PARAM_API_VERSION] = API_VERSION;

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





/**************************************************************************
 *
 * Called when the AJAX request is successfull.
 *
 **************************************************************************/

        FsqJsonCaller.prototype._handleSuccess =
        function ( endpoint,
                   data,
                   callback ) {

            var response = null;

            // Check if the response signals success.
            var responseCode = data.meta && data.meta.code;

            if ( responseCode == "200" ) {
                this._logger.info("Response from \"{0}\" signals success",
                                  endpoint);
                response = data.response;
            } else {
                var meta        = data.meta;
                var errorType   = meta && meta.errorType;
                var errorDetail = meta && meta.errorDetail;
                
                this._logger.info("Response from \"{0}\" signals failure:",
                                  endpoint);
                this._logger.info("\tResponse code : {0}", responseCode);
                this._logger.info("\tError type    : {0}", errorType);
                this._logger.info("\tError detail  : {0}", errorDetail);
            }

            callback(response);
        }





/**************************************************************************
 *
 * Called when the AJAX request fails.
 *
 **************************************************************************/

        FsqJsonCaller.prototype._handleError =
        function ( endpoint,
                   jqXHR,
                   status,
                   error,
                   callback ) {

            this._logger.info("Request for \"{0}\" failed with {1} ({2})",
                              endpoint,
                              status,
                              error);

            callback(null);
        }





        return FsqJsonCaller;

    })();





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

