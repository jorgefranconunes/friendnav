/**************************************************************************
 *
 * Copyright (c) 2016 Jorge Nunes All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * A page view that displays static content downloaded from on
 * specific URL.
 *
 * The contents of the URL must be such that they can be added to a
 * DIV element.
 */
varmateo.defineClass(

"varmateo.friendnav.views.StaticPageView",

function() {

    var Logger =
        varmateo.load("varmateo.util.logging.Logger");
    var PageViewTrait =
        varmateo.load("varmateo.friendnav.views.PageViewTrait");
    var ActivityIndicatorView =
        varmateo.load("varmateo.friendnav.views.ActivityIndicatorView");


    StaticPageView.prototype._log = null;
    StaticPageView.prototype._contentsUrl = null;
    StaticPageView.prototype._panel = null;
    StaticPageView.prototype._pageViewTrait = null;
    StaticPageView.prototype._isFirstTime = true;


    /**
     *
     */
    function StaticPageView ( contentsUrl ) {

        var log = Logger.createFor("StaticPageView");
        var panel = _buildContentsPanel();
        var title = "Default Title"; // HACK
        var trait = new PageViewTrait(log, title, panel);

        trait.addTo(this);

        log.info("Setting up static page for \"{0}\"...", contentsUrl);

        this._log = log;
        this._contentsUrl = contentsUrl;
        this._panel = panel;
        this._pageViewTrait = trait;
    }


    /**
     * Creates the panel for this page, and fills it with the
     * "loading..."  icon.
     */
    function _buildContentsPanel() {

        var panel = jQuery("<div>");
        var loaderView = new ActivityIndicatorView();

        panel.append(loaderView.getElement());

        return panel;
    }


    /**
     *
     */
    StaticPageView.prototype.onShow = function ( isVisible ) {

        this._pageViewTrait.onShow(isVisible);

        if ( isVisible && this._isFirstTime ) {
            this._isFirstTime = false;
            this._loadContents();
        }
    }


    /**
     *
     */
    StaticPageView.prototype._loadContents = function () {

        this._log.info("Loading \"{0}\"...", this._contentsUrl);

        var self = this;

        jQuery.get(this._contentsUrl)
            .done( function( data ) {
                self._onLoadSuccess(data);
            } )
            .fail( function(jqXHR, textStatus) {
                self._onLoadFailure(textStatus);
            } );
    }


    /**
     *
     */
    StaticPageView.prototype._onLoadSuccess = function ( data ) {

        this._log.info("Successfully loaded \"{0}\"", this._contentsUrl);

        this._panel.empty();
        this._panel.html(data);
    }


    /**
     *
     */
    StaticPageView.prototype._onLoadFailure = function ( status) {

        this._log.info("Failed to load \"{0}\" with status \"{1}\"",
                       this._contentsUrl,
                       status);

        // TODO: We should make this abnormal scenario visible to the
        // user somehow.
    }


    return StaticPageView;
});
