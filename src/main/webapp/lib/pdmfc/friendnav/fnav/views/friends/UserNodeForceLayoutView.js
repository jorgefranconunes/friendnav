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





        var IMAGE_WIDTH  = 48;
        var IMAGE_HEIGHT = 48;

        var D3_LINK_DISTANCE =
            2*Math.sqrt(IMAGE_WIDTH*IMAGE_WIDTH + IMAGE_HEIGHT*IMAGE_HEIGHT);

        var D3_CHARGE = -D3_LINK_DISTANCE;

        UserNodeForceLayoutView.prototype._logger      = null;
        UserNodeForceLayoutView.prototype._panel       = null;
        UserNodeForceLayoutView.prototype._isFirstTime = true;

        UserNodeForceLayoutView.prototype._nodeIdList = [];

        // Keys are UserNode.id, values are corresponding D3Node
        // instances. This is used to ensure there are no duplicate
        // UserNode to display.
        UserNodeForceLayoutView.prototype._d3NodesById   = {};

        // Array of D3Node to be updated by the D3 force layout
        // process.
        UserNodeForceLayoutView.prototype._d3Nodes       = null;

        UserNodeForceLayoutView.prototype._d3Links       = null;

        // The <svg:svg> element where DOM elements for the nodes are
        // created.
        UserNodeForceLayoutView.prototype._d3Canvas      = null;

        // Manages the D3 force layout process.
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

            this._nodeIdList.push(nodeId);

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

            var nodeId = this._nodeIdList.pop();
            var d3Node = this._d3NodesById[nodeId];

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
            var d3Canvas      = this._createSvgCanvas(panel.get(0));
            var d3ForceLayout =
                d3.layout.force()
                .linkDistance(D3_LINK_DISTANCE)
                .charge(D3_CHARGE)
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
 * 
 *
 **************************************************************************/

        UserNodeForceLayoutView.prototype._createSvgCanvas =
        function ( element,
                   width,
                   height ) {

            var d3Canvas =
                d3.select(element)
                .append("svg:svg")
                .attr("width", width)
                .attr("height", height);

            // And now we define a clipping area to be used on the
            // node photos. That clipping area is used to get rounded
            // corners.

            var boxX      = -IMAGE_WIDTH/2;
            var boxY      = -IMAGE_HEIGHT/2;
            var boxWidth  = IMAGE_WIDTH;
            var boxHeight = IMAGE_HEIGHT;
            var borderRadius = "4px";

            var svgDefs = d3Canvas.append("svg:defs");

            // The rectangle to be used for clipping area.
            svgDefs.append("svg:rect")
            .attr("id", "fnvGraphPhotoClipRect")
            .attr("x", boxX + "px")
            .attr("y", boxY + "px")
            .attr("width", boxWidth + "px")
            .attr("height", boxHeight + "px")
            .attr("rx", borderRadius);

            // The actual clipping area, based on the above rectangle.
            svgDefs.append("svg:clipPath")
            .attr("id", "fnvGraphPhotoClipPath")
            .append("svg:use")
            .attr("xlink:href", "#fnvGraphPhotoClipRect");

            return d3Canvas;
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

            this._createNodeElements(svgNewNodeList);

            // And remove SVG nodes no longer used.
            nodeList.exit().remove();

            // TBD - Also take care of the links.

            this._d3ForceLayout.start();
        }


        function getD3NodeImage ( d ) {
            return d.userNode.photoUrl;
        }





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

        UserNodeForceLayoutView.prototype._createNodeElements =
        function ( svgNodeList ) {

            var boxX      = -IMAGE_WIDTH/2;
            var boxY      = -IMAGE_HEIGHT/2;
            var boxWidth  = IMAGE_WIDTH;
            var boxHeight = IMAGE_HEIGHT;

            svgNodeList
            .append("svg:image")
            .attr("xlink:href", getD3NodeImage)
            .attr("x", boxX + "px")
            .attr("y", boxY + "px")
            .attr("width", boxWidth + "px")
            .attr("height", boxHeight + "px")
            .attr("clip-path", "url(#fnvGraphPhotoClipPath)");

            svgNodeList
            .append("svg:rect")
            .attr("class", "fnvGraphPhotoBox")
            .attr("x", boxX + "px")
            .attr("y", boxY + "px")
            .attr("width", boxWidth + "px")
            .attr("height", boxHeight + "px")
            .attr("rx", "4px")
            .attr("ry", "4px");
        }





        return UserNodeForceLayoutView;

    })();





/**************************************************************************
 *
 * 
 *
 **************************************************************************/

