/**************************************************************************
 *
 * Copyright (c) 2012-2017 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * The outermost view of the application. Manages the decorations that
 * are always visible.
 */
define(function ( require ) {

    var JQueryUtils = require("varmateo/util/jquery/JQueryUtils");
    var Logger = require("varmateo/util/logging/Logger");
    var MessageFormat = require("varmateo/util/text/MessageFormat");
    var ContentsView = require("varmateo/friendnav/fnav/views/main/ContentsView");
    var UserDataView = require("varmateo/friendnav/fnav/views/main/UserDataView");
    var Links = require("varmateo/friendnav/views/Links");
    var PageViewTrait = require("varmateo/friendnav/views/PageViewTrait");
    var StaticPageView = require("varmateo/friendnav/views/StaticPageView");


    FnavView.prototype._logger        = null;
    FnavView.prototype._preLoginView  = null;
    FnavView.prototype._postloginView = null;
    FnavView.prototype._viewContents  = null;
    FnavView.prototype._viewUserData  = null;

    FnavView.prototype._isLoggedIn = false;

    // Keys are view codes. Values are the corresponding views
    // received in the constructor.
    FnavView.prototype._viewsMap = null;


    /**
     * The config object is expected to contain the following fields:
     *
     * * containerPanelId - The ID of the DOM element that will
     *   contain the panels to display.
     *
     * * pageViewsMap - The views selected by ".fnvPageLink"
     *   links. Keys are view codes. Values are corresponding view
     *   objects.
     *
     * * preLoginViewCode - The code for the view that is made visible
     *   when the user is not logged in. This is also the view shown
     *   at the start. This code has to be one of the keys in
     *   "viewsMap".
     *
     * * postLoginViewCode - The code for the view that is to be
     *   displayed when the "showPostLoginView" method is
     *   invoked. This code has to be one of the keys in "viewsMap".
     *
     * The view objects are expected to respond to two methods:
     *
     * * getElement() - Returns the jQuery or DOM object to display
     *   inside the container panel.
     *
     * * showEvent(isVisible) - Will be called when the view has just
     *   been made visible or invisible. The "isVisible" flag is a
     *   boolean.
     */
    function FnavView (
        config,
        transitionManager ) {

        var logger            = Logger.createFor("FnavView");
        var containerPanelId  = config.containerPanelId;
        var preLoginViewCode  = config.preLoginViewCode;
        var postLoginViewCode = config.postLoginViewCode;
        var pageViewsMap      = config.pageViewsMap;

        logger.info("Setting up view for \"{0}\"", containerPanelId);

        this._logger = logger;
        this._viewsMap = pageViewsMap;

        this._preLoginView  = this._getViewWithCode(preLoginViewCode);
        this._postLoginView = this._getViewWithCode(postLoginViewCode);

        this._viewContents =
            new ContentsView(containerPanelId, transitionManager);
        this._viewUserData =
            new UserDataView("#fnvUserData");

        this._setupStaticPageLinks();
        this._setupLogoutLinks();
        this._setupHomeLinks();

        logger.info("Done seting up view for \"{0}\"", containerPanelId);
    }


    /**
     *
     */
    FnavView.prototype._setupStaticPageLinks = function () {

        var self = this;
        var staticPageLinks = jQuery(".fnvStaticPageLink");

        this._logger.info(
            "Setting up {0} static page links...",
            staticPageLinks.length);

        staticPageLinks.each(function ( index, element ) {
            var anchor = jQuery(element);
            var url = anchor.attr("href");
            var staticPageView = new StaticPageView(url);

            Links.setOnClickListener(
                anchor,
                function () {
                    self.showPage(staticPageView);
                });
        });
    }


    /**
     *
     */
    FnavView.prototype._setupLogoutLinks = function () {

        var self        = this;
        var logoutLinks = jQuery(".fnvLogoutLink");

        this._logger.info("Setting up {0} logout links", logoutLinks.length);

        Links.setOnClickListener(
            logoutLinks,
            function () {
                self._onLogoutSelected();
            });
    }


    /**
     *
     */
    FnavView.prototype._setupHomeLinks = function () {

        var self        = this;
        var homeLinks = jQuery(".fnvHomeLink");

        this._logger.info("Setting up {0} home links", homeLinks.length);

        Links.setOnClickListener(
            homeLinks,
            function () {
                self._showHomeView();
            })
    }


    /**
     * @param viewCode - One the the keys in _viewsMap.
     */
    FnavView.prototype._getViewWithCode = function ( viewCode ) {

        var view  = this._viewsMap[viewCode];

        if ( view === undefined ) {
            var msgFmt = "No view with code \"{0}\"";
            var msg    = MessageFormat.format(msgFmt, viewCode);

            throw msg;
        }

        return view;
    }


    /**
     *
     */
    FnavView.prototype._showHomeView = function () {

        var homeView = null;

        if ( this._isLoggedIn ) {
            homeView   = this._postLoginView;
        } else {
            homeView = this._preLoginView;
        }

        this.showPage(homeView);
    }


    /**
     *
     */
    FnavView.prototype._onLogoutSelected = function () {

        this._logger.info("Logout was selected");

        if ( this._callbackLogoutSelected != null ) {
            this._callbackLogoutSelected();
        }
    }


    /**
     *
     */
    FnavView.prototype.setOnLogoutSelectedListener = function ( callback ) {

        this._callbackLogoutSelected = callback;
    }


    /**
     *
     */
    FnavView.prototype.showPostLoginView = function ( userProfile ) {

        this._isLoggedIn = true;

        this._viewUserData.showWithUserData(userProfile);
        this.showPage(this._postLoginView);
    }


    /**
     *
     */
    FnavView.prototype.showPreLoginView = function () {

        this._isLoggedIn = false;

        this._viewUserData.hide();
        this.showPage(this._preLoginView);
    }


    /**
     * @param nextView - A page view.
     */
    FnavView.prototype.showPage = function ( nextView ) {

        this._viewContents.showPage(nextView);
    }


    return FnavView;
});
