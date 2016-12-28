/**************************************************************************
 *
 * Copyright (c) 2012-2016 Jorge Nunes All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * Details of a user node.
 */
varmateo.defineClass(

"varmateo.friendnav.fnav.views.friends.UserNodeDetailView",

function() {

    var Logger = varmateo.util.logging.Logger;
    var JQueryUtils  = varmateo.util.jquery.JQueryUtils;


    UserNodeDetailView.prototype._log = null;
    UserNodeDetailView.prototype._panel = null;
    UserNodeDetailView.prototype._divName = null;
    UserNodeDetailView.prototype._divPhoto = null;


    /**
     *
     */
    function UserNodeDetailView ( panelId ) {

        var log = Logger.createFor("UserNodeDetailView");

        log.info("Seting up with panel \"{0}\"...", panelId);

        var divName  = JQueryUtils.getOne(panelId + "Name");
        var divPhoto = JQueryUtils.getOne(panelId + "Photo");

        this._log = log;
        this._panel = JQueryUtils.getOne(panelId);
        this._divName = divName;
        this._divPhoto = divPhoto;
    }


    /**
     *
     */
    UserNodeDetailView.prototype.getElement = function () {

        var result = this._panel;

        return result;
    }


    /**
     *
     */
    UserNodeDetailView.prototype.setUserNode = function ( userNode ) {

        var name     = userNode.name;
        var photoUrl = userNode.largePhotoUrl;

        this._divName.text(name);
        this._divPhoto.css("background-image", "url(" + photoUrl + ")");
    }


    return UserNodeDetailView;
});
