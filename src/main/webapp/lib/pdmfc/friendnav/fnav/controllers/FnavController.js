/**************************************************************************
 *
 * Copyright (c) 2012 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";

pdmfc.namespace("pdmfc.friendnav.fnav.controllers");





/**************************************************************************
 *
 * The controller for the outermost view of the FriendNav application.
 *
 **************************************************************************/

pdmfc.friendnav.fnav.controllers.FnavController = (function() {

        var SimpleLogger = pdmfc.util.logging.SimpleLogger;





        FnavController.prototype._logger         = null;
        FnavController.prototype._viewFnav       = null;





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        function FnavController ( viewFnav ) {

            var logger = SimpleLogger.createFor("FnavController");

            logger.info("Seting up...");

            this._logger   = logger;
            this._viewFnav = viewFnav;
        }





        return FnavController;


    })();





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

