/**************************************************************************
 *
 * Copyright (c) 2012 Jorge Nunes, All Rights Reserved.
 *
 **************************************************************************/

"use strict";

pdmfc.namespace("pdmfc.friendnav.fnav.views.friends");





/**************************************************************************
 *
 * Displays connected graph of user nodes.
 *
 **************************************************************************/

pdmfc.friendnav.fnav.views.friends.UserNodeForceLayoutView = (function() {

        var SimpleLogger = pdmfc.util.logging.SimpleLogger;
        var JQueryUtils  = pdmfc.util.jquery.JQueryUtils;





        var IMAGE_WIDTH = 32;
        var IMAGE_HEIGHT = 32;

        UserNodeForceLayoutView.prototype._logger      = null;
        UserNodeForceLayoutView.prototype._panel       = null;
        UserNodeForceLayoutView.prototype._isFirstTime = true;

        UserNodeForceLayoutView.prototype._d3NodesById   = {};
        UserNodeForceLayoutView.prototype._d3Nodes       = null;
        UserNodeForceLayoutView.prototype._d3Links       = null;
        UserNodeForceLayoutView.prototype._d3Canvas      = null;
        UserNodeForceLayoutView.prototype._d3ForceLayout = null;





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        function UserNodeForceLayoutView ( panelId ) {

            var logger = SimpleLogger.createFor("UserNodeForceLayoutView");

            logger.info("Seting up with panel \"{0}\"...", panelId);

            this._logger   = logger;
            this._panel    = JQueryUtils.getOne(panelId);
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        UserNodeForceLayoutView.prototype.getElement =
        function () {

            var result = this._panel;

            return result;
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        UserNodeForceLayoutView.prototype.pushUserNode =
        function ( userNode ) {

            this._logger.info("Pushing user node {0} ({1})",
                              userNode.id,
                              userNode.name);

            if ( this._isFirstTime ) {
                this._isFirstTime = false;
                this._firstTimeSetup();
            }

            var nodeId = userNode.id;
            var d3Node = this._d3NodesById[nodeId];

            if ( d3Node === undefined ) {
                d3Node = {
                    userNode : userNode,
                    refCount : 1,
                };
                this._d3NodesById[nodeId] = d3Node;
                this._d3Nodes.push(d3Node);

                this._logger.info("User node {0} added to canvas",
                                  userNode.id);
            } else {
                d3Node.refCount = d3Node.refCount + 1;

                this._logger.info("User node {0} already on canvas ({1} times)",
                                  userNode.id,
                                  d3Node.refCount);
            }

            this._update();
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        UserNodeForceLayoutView.prototype.popUserNode =
        function ( userNode ) {

            this._logger.info("Poping user node...");

            var d3Node = this._d3Nodes[this._d3Nodes.length-1];

            d3Node.refCount = d3Node.refCount - 1;

            if ( d3Node.refCount == 0 ) {
                this._d3Nodes.pop();
                delete this._d3NodesById[d3Node.userNode.id];

                this._logger.info("User node {0} removed from canvas",
                                  d3Node.userNode.id);
            } else {
                this._logger.info("User node {0} kept on canvas ({1} times)",
                                  d3Node.userNode.id,
                                  d3Node.refCount);
            }

            this._update();
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        UserNodeForceLayoutView.prototype._firstTimeSetup =
        function () {

            var self   = this;
            var panel  = this._panel;
            var width  = panel.width();
            var height = panel.height();

            this._logger.info("Setting drawing area {0}x{1}", width, height);

            var d3Nodes       = [];
            var d3Links       = [];
            var d3Canvas      =
                d3.select(panel.get(0))
                .append("svg:svg")
                .attr("width", width)
                .attr("height", height);
            var d3ForceLayout =
                d3.layout.force()
                .nodes(d3Nodes)
                .links(d3Links)
                .size([width, height]);

            d3ForceLayout.on("tick", function () {
                    self._tick();
                });

            this._d3Nodes       = d3Nodes;
            this._d3Links       = d3Links;
            this._d3Canvas      = d3Canvas;
            this._d3ForceLayout = d3ForceLayout;
        }





/**************************************************************************
 *
 * Called by D3 during animation of force layout.
 *
 **************************************************************************/

        UserNodeForceLayoutView.prototype._tick =
        function () {

            this._d3Canvas
            .selectAll("g.fnvNode")
            .attr("transform", svgTranslate);

            // TBD - Update the links positions.
        }


        function svgTranslate ( d ) {
            return "translate(" + d.x + "," + d.y + ")";
        }





/**************************************************************************
 *
 * Updates the nodes in the canvas by creating or removing the
 * appropriate SVG elements.
 *
 **************************************************************************/

        UserNodeForceLayoutView.prototype._update =
        function () {

            var nodeList =
                this._d3Canvas
                .selectAll("g.fnvNode")
                .data(this._d3Nodes);

            var svgNewNodeList =
                nodeList.enter()
                .append("svg:g")
                .attr("class", "fnvNode")
                .call(this._d3ForceLayout.drag);

            svgNewNodeList.append("svg:image")
            .attr("xlink:href", getD3NodeImage)
            .attr("x", (-IMAGE_WIDTH/2) + "px")
            .attr("y", (-IMAGE_HEIGHT/2) + "px")
            .attr("width", IMAGE_WIDTH + "px")
            .attr("height", IMAGE_HEIGHT + "px");

            // And remove SVG nodes no longer used.
            nodeList.exit().remove();

            // TBD - Also take care of the links.

            this._d3ForceLayout.start();
        }


        function getD3NodeImage ( d ) {
            return d.userNode.photoUrl;
        }





        return UserNodeForceLayoutView;

    })();





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

