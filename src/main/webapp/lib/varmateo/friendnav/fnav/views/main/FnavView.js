/**************************************************************************
 *
 * Copyright (c) 2012-2016 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * The outermost view of the application. Manages the decorations that
 * are always visible.
 */
varmateo.defineClass(

"varmateo.friendnav.fnav.views.main.FnavView",

function() {

    var JQueryUtils =
        varmateo.load("varmateo.util.jquery.JQueryUtils");
    var SimpleLogger =
        varmateo.load("varmateo.util.logging.SimpleLogger");
    var MessageFormat =
        varmateo.load("varmateo.util.text.MessageFormat");
    var ContentsView =
        varmateo.load("varmateo.friendnav.fnav.views.main.ContentsView");
    var UserDataView =
        varmateo.load("varmateo.friendnav.fnav.views.main.UserDataView");
    var PageViewTrait =
        varmateo.load("varmateo.friendnav.views.PageViewTrait");


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
     *
     **************************************************************************/

    function FnavView (
        config,
        transitionManager ) {

        var logger            = SimpleLogger.createFor("FnavView");
        var containerPanelId  = config.containerPanelId;
        var preLoginViewCode  = config.preLoginViewCode;
        var postLoginViewCode = config.postLoginViewCode;
        var pageViewsMap      = config.pageViewsMap;

        logger.info("Seting up view for \"{0}\"", containerPanelId);

        this._logger            = logger;
        this._viewsMap          = jQuery.extend({}, pageViewsMap);

        this._preLoginView  = this._getViewWithCode(preLoginViewCode);
        this._postLoginView = this._getViewWithCode(postLoginViewCode);

        this._viewContents =
            new ContentsView(containerPanelId, transitionManager);
        this._viewUserData =
            new UserDataView("#fnvUserData");

        this._setupPageViewLinks(containerPanelId);
        this._setupLocalLinks();
        this._setupLogoutLinks();
        this._setupHomeLinks();

        logger.info("Done seting up view for \"{0}\"", containerPanelId);
    }


    /**
     *
     */
    FnavView.prototype._setupPageViewLinks = function ( containerPanelId ) {

        var self = this;

        var viewLinks = $(".fnvPageViewLink");

        viewLinks.each(function(index, element) {
            self._setupOnePageViewLink($(element));
        });
    }


    /**
     *
     */
    FnavView.prototype._setupOnePageViewLink = function ( linkElem ) {

        var self     = this;
        var viewHref = linkElem.attr("href");
        var viewCode = viewHref.substring(1);
        var pageView = this._getViewWithCode(viewCode);

        this._logger.info("Setting up page view link \"{0}\"", viewCode);

        linkElem.click(function(event) {
            event.preventDefault();
            self._onViewSelected(viewCode, pageView);
        });
    }


    /**
     *
     */
    FnavView.prototype._onViewSelected = function (
        viewCode,
        view ) {

        this._logger.info("View \"{0}\" selected", viewCode);

        this.showPage(view);
    }


    /**
     *
     */
    FnavView.prototype._setupLocalLinks = function () {

        var self         = this;
        var localLinks   = $(".fnvLocalLink");
        var localPageMap = {};

        this._logger.info("Seting up {0} local links...", localLinks.length);

        localLinks.each(function ( index, element ) {
            var anchor    = $(element);
            var panelId   = anchor.attr("href");
            var localPage = localPageMap[panelId];

            if ( localPage === undefined ) {
                localPage = new LocalPageView(panelId);
                localPageMap[panelId] = localPage;
            }
        });

        localLinks.each(function(index, element) {
            self._setupOneLocalLink($(element), localPageMap);
        });
    }


    /**
     *
     */
    FnavView.prototype._setupOneLocalLink = function (
        anchor,
        localPageMap ) {

        var self      = this;
        var panelId   = anchor.attr("href");
        var localPage = localPageMap[panelId];

        this._logger.info("Seting up local link for target \"{0}\"", panelId);

        anchor.click(function ( event ) {
            event.preventDefault();
            self.showPage(localPage);
        });
    }


    /**
     *
     */
    FnavView.prototype._setupLogoutLinks = function () {

        var self        = this;
        var logoutLinks = $(".fnvLogoutLink");

        this._logger.info("Seting up {0} logout links", logoutLinks.length);

        logoutLinks.each(function(index, element) {
            $(element).click(function ( e ) {
                e.preventDefault();
                self._onLogoutSelected();
            });
        });
    }


    /**
     *
     */
    FnavView.prototype._setupHomeLinks = function () {

        var self        = this;
        var homeLinks = $(".fnvHomeLink");

        this._logger.info("Seting up {0} home links", homeLinks.length);

        homeLinks.each(function(index, element) {
            $(element).click(function ( e ) {
                e.preventDefault();
                self._showHomeView();
            });
        });
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


    /**
     * Class LocalPageView. Represents a page view where the contents
     * correspond to an existing element in the DOM tree.


    /**
     *
     */
    function LocalPageView ( panelId ) {

        var logger = SimpleLogger.createFor("LocalPageView");
        var panel = JQueryUtils.getOne(panelId);
        var pageTitle = panelId; // HACK
        var trait = new PageViewTrait(logger, pageTitle, panel);

        trait.addTo(this);

        logger.info("Setting up with panel \"{0}\"...", panelId);
    }


    return FnavView;
});
