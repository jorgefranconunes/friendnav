/**************************************************************************
 *
 * Copyright (c) 2012-2016 Jorge Nunes All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * A simple Assynchrouns Module Definition implementation.
 */
var varmateo = (function ( myPackage ) {


    var _isStarted = false;
    var _classUrlPrefix = null;
    var _startFunction = null;
    var _pendingLoads = [];

    // Contains only classes that have been loaded up to now. Keys are
    // the classes fully qualified names.
    var _loadedClassesByName = {};

    // Used as cache for speeding access to class objects. Keys are
    // the classes fully qualified names.
    var _allClassesByName = {};

    // Number of classes still waiting to be loaded.
    var _loadInProgressCount = 0;


    /**
     *
     */
    function defineClass (
        className,
        classBuilderFunction ) {

        var classFunction =
            _defineRealOrWrapperClass(className, classBuilderFunction);

        _loadedClassesByName[className] = classFunction;
        _allClassesByName[className] = classFunction;
    }


    /**
     *
     */
    function _defineRealOrWrapperClass (
        className,
        classBuilderFunction ) {

        var context = window;
        var itemList = className.split(".");
        var itemCount = itemList.length;

        // Create all the intermediate package objects, if they do not
        // yet exist.
        for ( var i=0, count=itemCount-1; i<count; ++i ) {
            var item = itemList[i];
            var thePackage = context[item];

            if ( thePackage === undefined ) {
                thePackage = {}
                context[item] = thePackage;
            }
            context = thePackage;
        }

        var classSimpleName = itemList[itemCount-1];
        var classFunction = classBuilderFunction();

        context[classSimpleName] = classFunction;

        return classFunction;
    }


    /**
     *
     */
    function load ( className ) {

        var klass = _findClassWithName(className);

        if ( klass == null ) {
            klass = _lazyClassLoad(className);
            _defineRealOrWrapperClass(className, function() { return klass; });
        }

        return klass;
    }


    /**
     *
     */
    function _lazyClassLoad ( className ) {

        var wrapperClass = function () {
            var klass = _loadedClassesByName[className];

            if ( klass == null ) {
                var msg = "Class \"" + className + "\" is not loaded yet";
                throw msg;
            }

            return klass.apply(this, arguments);
        };

        if ( _isStarted ) {
            _scheduleClassLoad(className, wrapperClass);
        } else {
            _pendingLoads.push({
                className    : className,
                wrapperClass : wrapperClass
            });
        }

        return wrapperClass;
    }


    /**
     *
     */
    function _scheduleClassLoad (
        className,
        wrapperClass ) {

        var scriptUrl = _buildScriptUrl(className);

        var loadCallback = function () {
            _postLoadCallback(className, wrapperClass, scriptUrl);
        };

        ++_loadInProgressCount;

        _scheduleScriptLoad(scriptUrl, loadCallback);
    }


    /**
     *
     */
    function _postLoadCallback (
        className,
        wrapperClass,
        scriptUrl ) {

        var klass = _findClassWithName(className);

        if ( klass == null ) {
            var msg = ""
                + "Class \"" + className + "\" "
                + "not defined on script \"" + scriptUrl + "\"";
            throw msg;
        }

        _extend(wrapperClass, klass);
        wrapperClass.prototype = klass.prototype;

        --_loadInProgressCount;

        if ( _loadInProgressCount == 0 ) {
            // All asynchronous loads have completed by now.
            _startFunction();
        }
    }


    /**
     * It will return null if the given class has not yet been
     * defined.
     */
    function _findClassWithName ( className ) {

        var klass = _allClassesByName[className];

        if ( klass === undefined ) {
            var itemList  = className.split(".");

            klass = itemList.reduce(function (context, item) {
                return (context!=null) ? context[item] : null;
            }, window);

            if ( klass != null ) {
                _allClassesByName[className] = klass;
            }
        }

        return klass;
    }


    /**
     *
     */
    function _buildScriptUrl ( className ) {

        var classPath = className.replace(/\./g, "/");
        var scriptUrl = _classUrlPrefix + classPath + ".js";

        return scriptUrl;
    }


    /**
     *
     */
    function _scheduleScriptLoad (
        scriptUrl,
        loadCallback ) {

        var tag = document.createElement('script');
        var isDone = false;

        tag.src    = scriptUrl;
        tag.type   = "text/javascript";
        tag.async  = "true";
        tag.onload =  function() {
            var readyState = this.readyState;
            var isLoaded =
                readyState && (readyState!="complete") && (readyState!="loaded");
            if ( !isLoaded && !isDone ) {
                loadCallback();
                isDone = true;
            }
        };
        tag.onreadystatechange = tag.onload;

        var scriptNode = document.getElementsByTagName('script')[0];

        scriptNode.parentNode.insertBefore(tag, scriptNode);
    }


    /**
     *
     */
    function _extend (
        target,
        object ) {

        for ( var fieldName in object ) {
            target[fieldName] = object[fieldName];
        }
    }


    /**
     *
     */
    function start ( config ) {

        _isStarted      = true;
        _classUrlPrefix = config.classUrlPrefix;
        _startFunction  = config.startFunction;

        _pendingLoads.forEach(function ( item ) {
            _scheduleClassLoad(item.className, item.wrapperClass);
        });
        _pendingLoads = [];

        if ( _loadInProgressCount == 0 ) {
            // All asynchronous loads have completed by now.
            _startFunction();
        }
    }


    /**
     * To be removed soon.
     */
    function namespace ( packageName ) {

        var object   = null;
        var context  = window;
        var itemList = packageName.split(".");

        for ( var i=0, size=itemList.length; i<size; ++i ) {
            var item       = itemList[i];
            var thePackage = context[item];

            if ( thePackage === undefined ) {
                thePackage    = {}
                context[item] = thePackage;
            }

            context = thePackage;
        }
    }


    /**
     *
     */
    var thePackage = myPackage || {};
    var methodMap  = {
        defineClass : defineClass,
        load        : load,
        start       : start,
        namespace   : namespace, // To be removed soon.
    };

    _extend(thePackage, methodMap);

    return thePackage;

})(window.varmateo);

