/**************************************************************************
 *
 * Copyright (c) 2011-2017 Jorge Nunes All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 *
 */
define(function ( require ) {

    var MessageFormat = require("varmateo/util/text/MessageFormat");


    // Format of logging messages.
    // 0 - Time.
    // 1 - Module name.
    // 2 - Log level,
    // 3 - Message.
    var FORMAT = "{0} {1} {2} {3}";

    // Log levels.
    var LEVEL_INFO = "INFO";


    // Private members.
    Logger.prototype._moduleName = null;


    /**
     * The constructor.
     *
     */
    function Logger(moduleName) {

        this._moduleName = moduleName;
    }


    /**
     * Logs a message.
     */
    Logger.prototype.info = function() {

        this._logMessage({
            logLevel    : LEVEL_INFO,
            messageArgs : arguments,
        });
    }


    /**
     * Logs the fields of an object.
     */
    Logger.prototype.infoObj = function ( object ) {

        this._logObject(LEVEL_INFO, object);
    }


    /**
     * Logs a message.
     */
    Logger.prototype._logMessage = function ( msgData ) {

        var output = window.console;

        if ( output ) {
            var time       = new Date();
            var logLevel   = msgData.logLevel;
            var msgArgs    = msgData.messageArgs;
            var moduleName = this._moduleName;
            var msg        = MessageFormat.format.apply(null, msgArgs);
            var timeStr    = _formatTime(time);
            var logMsg     =
                MessageFormat.format(FORMAT, timeStr, moduleName, logLevel, msg);

            output.log(logMsg);
        }
    }


    /**
     * Logs a message.
     */
    Logger.prototype._logObject = function (
        logLevel,
        object ) {

        Object.keys(object)
            .sort()
            .forEach(function ( fieldName ) {
                var fieldValue = object[fieldName];
                this._logMessage({
                    logLevel    : logLevel,
                    messageArgs : [ "\t{0} : {1}", fieldName, fieldValue ],
                });
            }, this);
    }


    /**
     * 
     */
    function _formatTime(time) {

        var hours = time.getHours();
        var minutes = time.getMinutes();
        var seconds = time.getSeconds();
        var millis = time.getMilliseconds();

        var hoursStr = _padWithZeros(hours, 2);
        var minutesStr = _padWithZeros(minutes, 2);
        var secondsStr = _padWithZeros(seconds, 2);
        var millisStr = _padWithZeros(millis, 3);

        var result =
            hoursStr + ":" + minutesStr + ":" + secondsStr + "." + millisStr;

        return result;
    }


    /**
     *
     */
    var ZEROS = "00000000";

    function _padWithZeros(value, width) {

        var result = value.toString();

        if ( result.length < width ) {
            result = ZEROS.substr(0, width-result.length) + result;
        }

        return result;
    }


    /**
     *
     */
    function createFor(moduleName) {

        var result = new Logger(moduleName);

        return result;
    }


    /**
     * Class static methods.
     */
    Logger.createFor = createFor;


    return Logger;
});
