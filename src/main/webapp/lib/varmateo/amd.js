/**************************************************************************
 *
 * Copyright (c) 2012-2017 Jorge Nunes All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * A simple Assynchrouns Module Definition implementation. Intended
 * only for use in browsers.
 */
var varmateo = (function ( topContext ) {

    var _myPackage = topContext.varmateo || {};

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

    // Populated by the "define(...)" function.
    var _lastDefineClassBuilder = null;


    /**
     *
     */
    function define ( classBuilder ) {

        if ( _lastDefineClassBuilder != null ) {
            var msg = "Called twice inside the same module.";
            throw msg
        }

        _lastDefineClassBuilder = classBuilder;
    }


    /**
     *
     */
    function defineClass (
        className,
        classBuilder ) {

        var classFunction =
            _defineRealOrWrapperClass(className, classBuilder);

        _loadedClassesByName[className] = classFunction;
        _allClassesByName[className] = classFunction;
    }


    /**
     *
     */
    function _defineRealOrWrapperClass (
        className,
        classBuilder ) {

        var classFunction = classBuilder();

        _createPackageObjects(className, classFunction);

        return classFunction;
    }


    /**
     * TBD - Soon to be removed...
     */
    function _createPackageObjects(
        className,
        classFunction ) {

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
        context[classSimpleName] = classFunction;
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

        _processIfDefineWasCalled(className);

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
     *
     */
    function _processIfDefineWasCalled ( className ) {

        if ( _lastDefineClassBuilder != null ) {
            _defineComplete(className, _lastDefineClassBuilder);
            _lastDefineClassBuilder = null;
        }
    }


    /**
     *
     */
    function _defineComplete(
        className,
        defineClassBuilder ) {

        var classBuilder = function () {
            return defineClassBuilder(_require);
        };

        defineClass(className, classBuilder);
    }


    /**
     *
     */
    function _require ( classPath ) {

        var className = classPath.replace("/", ".");

        return load(className);
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
     *
     */
    var thePackage = _myPackage || {};
    var methodMap  = {
        defineClass : defineClass,
        load        : load,
        start       : start,
    };
    _extend(thePackage, methodMap);

    var topContextMethodMap = {
        define : define,
    }
    _extend(topContext, topContextMethodMap);

    return thePackage;

})(window);

