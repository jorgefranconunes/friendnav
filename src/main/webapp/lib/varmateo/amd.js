/**************************************************************************
 *
 * Copyright (c) 2012-2017 Jorge Nunes All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * A simple Assynchronous Module Definition implementation. Intended
 * only for use in browsers.
 */
(function ( topContext ) {

    var _isStarted = false;
    var _classUrlPrefix = null;
    var _startFunction = null;
    var _pendingLoads = [];

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

    // Emulate a RequireJS environment.
    define.amd = true;


    /**
     *
     */
    function defineClass (
        className,
        classBuilder ) {

        var klass = _defineRealOrWrapperClass(className, classBuilder);

        _allClassesByName[className] = klass;
    }


    /**
     *
     */
    function _defineRealOrWrapperClass (
        className,
        classBuilder ) {

        var klass = classBuilder();

//        _createPackageObjects(className, klass);

        return klass;
    }


    /**
     * TBD - Soon to be removed...
     */
    function _createPackageObjects(
        className,
        klass ) {

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
        context[classSimpleName] = klass;
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
            var klass = _allClassesByName[className];

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

        var loadCompletedCallback = function () {
            _onLoadCompleted(className, wrapperClass, scriptUrl);
        };

        ++_loadInProgressCount;

        _scheduleScriptLoad(scriptUrl, loadCompletedCallback);
    }


    /**
     *
     */
    function _onLoadCompleted (
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
            _onDefineCompleted(className, _lastDefineClassBuilder);
            _lastDefineClassBuilder = null;
        }
    }


    /**
     *
     */
    function _onDefineCompleted(
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

        var className = classPath.split("/").join(".");

        return load(className);
    }


    /**
     * It will return null if the given class has not yet been
     * defined.
     */
    function _findClassWithName ( className ) {

        return _allClassesByName[className];
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
        loadCompletedCallback ) {

        var tag = document.createElement('script');
        var isDone = false;

        tag.src    = scriptUrl;
        tag.type   = "text/javascript";
        tag.async  = "true";
        tag.onload =  function() {
            var readyState = this.readyState;
            var isLoaded = true
                && readyState
                && (readyState!="complete")
                && (readyState!="loaded");
            if ( !isLoaded && !isDone ) {
                loadCompletedCallback();
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

        _amdConfig({ baseUrl : config.classUrlPrefix });
        _bootstrap(config.startFunction);
    }


    /**
     *
     */
    function _amdConfig ( config ) {

        _classUrlPrefix = config.baseUrl;
    }


    /**
     *
     */
    function _bootstrap ( loadCompletedCallback ) {

        _startFunction = loadCompletedCallback;
        _isStarted = true;

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
    function amd (
        classPathList,
        mainFunction ) {

        var classList = classPathList.map(_require);
        var onLoadCompleted = function () {
            mainFunction.apply(null, classList);
        };

        _bootstrap(onLoadCompleted);
    }
    amd.config = _amdConfig;


    /**
     *
     */
    var methodMap  = {
        amd         : amd,
        defineClass : defineClass,
        load        : load,
        start       : start,
    };
    topContext.varmateo = topContext.varmateo ? topContext.varmateo : {};
    _extend(topContext.varmateo, methodMap);

    var topContextMethodMap = {
        define : define,
    }
    _extend(topContext, topContextMethodMap);

})(window);

