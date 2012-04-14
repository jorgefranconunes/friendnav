/**************************************************************************
 *
 * Copyright (c) 2011-2012 PDMFC, All Rights Reserved.
 *
 **************************************************************************/

"use strict";

pdmfc.namespace("pdmfc.util.logging");





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

pdmfc.util.logging.SimpleLogger = (function() {





        // Format of logging messages.
        // 0 - Time.
        // 1 - Module name.
        // 2 - Log level,
        // 3 - Message.
        var FORMAT = "{0} {1} {2} {3}";

        // Log levels.
        var LEVEL_INFO = "INFO";





        // Private members.

        SimpleLogger.prototype._moduleName = null;





/**************************************************************************
 *
 * The constructor.
 *
 **************************************************************************/

        function SimpleLogger(moduleName) {

            this._moduleName = moduleName;
        }





/**************************************************************************
 *
 * Logs a message.
 *
 **************************************************************************/

        SimpleLogger.prototype.info =
        function() {

            this._logMessage({
                    logLevel    : LEVEL_INFO,
                    messageArgs : arguments,
                });
        }





/**************************************************************************
 *
 * Logs the fields of an object.
 *
 **************************************************************************/

        SimpleLogger.prototype.infoObj =
        function ( object ) {

            this._logObject(LEVEL_INFO, object);
        }





/**************************************************************************
 *
 * Logs a message.
 *
 **************************************************************************/

        SimpleLogger.prototype._logMessage =
        function ( msgData ) {

            var output = window.console;

            if ( output ) {
                var time       = new Date();
                var logLevel   = msgData.logLevel;
                var msgArgs    = msgData.messageArgs;
                var moduleName = this._moduleName;
                var msg        = _format.apply(null, msgArgs);
                var timeStr    = _formatTime(time);
                var logMsg     =
                    _format(FORMAT, timeStr, moduleName, logLevel, msg);

                output.log(logMsg);
            }
        }





/**************************************************************************
 *
 * Logs a message.
 *
 **************************************************************************/

        SimpleLogger.prototype._logObject =
        function ( logLevel,
                   object ) {

            var fieldNameList = [];

            for ( var fieldName in object ) {
                fieldNameList.push(fieldName);
            }

            fieldNameList.sort();

            for ( var i=0, size=fieldNameList.length; i<size; ++i ) {
            var fieldName  = fieldNameList[i];
            var fieldValue = object[fieldName];

            this._logMessage({
                    logLevel    : logLevel,
                    messageArgs : [ "\t{0} : {1}", fieldName, fieldValue ],
                });
            }
        }





/**************************************************************************
 *
 * First argument is format string. Remaining arguments are formating
 * arguments.
 *
 **************************************************************************/

        function _format() {

            var fmt     = arguments[0];
            var fmtArgs = Array.prototype.slice.call(arguments, 1);
            var getter  = function() {
                return fmtArgs[arguments[1]];
            }
            var result  = fmt.replace(/\{(\d+)\}/g, getter);

            return result;
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        function _formatTime(time) {

            var hours   = time.getHours();
            var minutes = time.getMinutes();
            var seconds = time.getSeconds();
            var millis  = time.getMilliseconds();

            var hoursStr = _padWithZeros(hours, 2);
            var minutesStr = _padWithZeros(minutes, 2);
            var secondsStr = _padWithZeros(seconds, 2);
            var millisStr  = _padWithZeros(millis, 3);

            var result =
            hoursStr + ":" + minutesStr + ":" + secondsStr + "." + millisStr;

            return result;
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        var ZEROS = "00000000";

        function _padWithZeros(value, width) {

            var result = value.toString();

            if ( result.length < width ) {
                result = ZEROS.substr(0, width-result.length) + result;
            }

            return result;
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        function _createFor(moduleName) {

            var result = new SimpleLogger(moduleName);

            return result;
        }





/**************************************************************************
 *
 * Define the public static methods.
 *
 **************************************************************************/

        SimpleLogger.createFor = _createFor;





        return SimpleLogger;


    })();





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

