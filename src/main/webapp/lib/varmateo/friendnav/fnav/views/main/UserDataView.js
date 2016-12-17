/**************************************************************************
 *
 * Copyright (c) 2012-2016 Jorge Nunes All Rights Reserved.
 *
 **************************************************************************/

"use strict";

varmateo.namespace("varmateo.friendnav.fnav.views.main");





/**************************************************************************
 *
 * View for showing some user data.
 *
 **************************************************************************/

varmateo.friendnav.fnav.views.main.UserDataView = (function() {

    var SimpleLogger = varmateo.util.logging.SimpleLogger;
    var JQueryUtils  = varmateo.util.jquery.JQueryUtils;





    UserDataView.prototype._logger       = null;
    UserDataView.prototype._panel        = null;
    UserDataView.prototype._name         = null;
    UserDataView.prototype._photo        = null;
    UserDataView.prototype._username     = null;
    UserDataView.prototype._email        = null;




/**************************************************************************
 *
 * 
 *
 **************************************************************************/

    function UserDataView ( panelId ) {

        var logger = SimpleLogger.createFor("UserDataView");

        logger.info("Seting up with panel \"{0}\"...", panelId);

        this._logger   = logger;
        this._panel    = JQueryUtils.getOne(panelId);
        this._name     = JQueryUtils.getOne(panelId + "Name");
        this._photo    = JQueryUtils.getOne(panelId + "Photo");
        this._username = JQueryUtils.getOne(panelId + "Username");
        this._email    = JQueryUtils.getOne(panelId + "Email");
    }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

    UserDataView.prototype.showWithUserData = function ( userData ) {

        var name           = userData.firstName;
        var email          = userData.email;
        var username       = userData.firstName + " " + userData.lastName;
        var photoSize      = this._photo.attr("width");
        var photoSrc       = userData.photoUrl;

        this._photo.attr("src", photoSrc);
        this._name.text(name);
        this._username.text(username);
        this._email.text(email);
        this._panel.show();
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

    UserDataView.prototype.hide = function () {

        this._panel.hide();
    }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

    UserDataView.prototype.getElement = function () {

        var result = this._panel;

        return result;
    }





    return UserDataView;

})();

