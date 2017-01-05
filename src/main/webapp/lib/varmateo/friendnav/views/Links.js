/**************************************************************************
 *
 * Copyright (c) 2016 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";


/**
 * Utility functions for creating and manipulating anchor elements.
 */
varmateo.defineClass(

"varmateo.friendnav.views.Links",

function() {


    /**
     * Creates an element with a link containing text.
     */
    function newTextLink ( data ) {

        var link =
            jQuery("<a>")
            .attr("href", "#")
            .text(data.text);

        if ( data.title != null ) {
            link.attr("title", data.title);
        }

        var callback = data.callback;
        if ( callback != null ) {
            link.click(function ( event ) {
                event.preventDefault();
                link.blur();
                callback();
            });
        }

        return link;
    }


    /**
     *
     */
    function setOnClickListener (
        link,
        callback ) {

        link.click(function ( event ) {
            event.preventDefault();
            callback();
        });
    }


    return {
        newTextLink : newTextLink,
        setOnClickListener : setOnClickListener,
    };
});
