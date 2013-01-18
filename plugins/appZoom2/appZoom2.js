/*
 * jArcherTarget plugin "appZoom2" - version 0.2 [2012-01-14]
 * This plugin shows a zoomed target if an arrow is moving. Created for use in smartphone applications.
 *
 * Copyright 2012, Andre Meyering
 * Licensed under the MIT license.
 */
(function ($) {

    $.fn.archerTarget('addPlugin', 'appZoom2', {

        /*
         * Initializing function
         */
        initialize: function (target, options) {

            var self = this,
                mainWidth,
                mainHeight;

            self.movingArrow = false;

            /*
             * Normal target
             */
            self.mainTarget = target;
            self.mainTarget.defaultZoom = self.mainTarget.zoom;
            /*
             * Extend the given functions with the defaults
             */
            self.options = $.extend(true, {}, self.defaults, options);
           

            mainWidth = self.mainTarget.width;
            mainHeight = self.mainTarget.height;

            /*
             * Set the default and scaled transX and transY of the main target. We need the default to
             * "reset" the target after a arrow was moved and the scaled if an arrow is moving.
             */
            self.mainTarget.defaultTransX = mainWidth / 2 / self.mainTarget.defaultZoom - mainWidth / 2;
            self.mainTarget.defaultTransY = mainHeight / 2 / self.mainTarget.defaultZoom - mainHeight / 2;
            self.mainTarget.scaledTransX = mainWidth / 2 / self.options.tapZoom - mainWidth / 2;
            self.mainTarget.scaledTransY = mainHeight / 2 / self.options.tapZoom - mainHeight / 2;

            self.mainTarget.setTransform(self.mainTarget.defaultTransX, self.mainTarget.defaultTransY);

            /*
             * We set the height and width of the scaled target.
             */
            self.scaledTarget = {};
            self.scaledTarget.width = mainWidth * self.options.scaledZoom;
            self.scaledTarget.height = mainHeight * self.options.scaledZoom;
            self.scaledTarget.wrapperWidth = mainWidth / 100 * self.options.width;
            self.scaledTarget.wrapperHeight = !self.options.useHeightPx ? mainHeight / 100 * self.options.height : self.options.height;
            /*
             * Set the default transX and transY of the scaled target target. If we use these variables, it will center the target.
             */
            self.scaledTarget.defaultTransX = -(self.scaledTarget.width / 2 - self.scaledTarget.wrapperWidth / (2 * self.mainTarget.defaultZoom));
            self.scaledTarget.defaultTransY = -(self.scaledTarget.height / 2 - self.scaledTarget.wrapperHeight / (2 * self.mainTarget.defaultZoom));
            

            self.resetCrossPosition();

            /*
             * Create the (hidden) scaled target.
             */
            self.createScaledTarget();

        },

        /**
         * Default parameters
         * @type {Object}
         */
        defaults: {
            /**
             * Background color of the scaled target
             * @type {String}
             */
            backgroundColor: '#ccc',
            /**
             * Zoom of the scaled target when an arrow is moved.
             * @type {Number}
             */
            scaledZoom: 2.5,
            /**
             * Zoom of the target when an arrow is moved/clicked.
             * @type {Number}
             */
            tapZoom: 1.5,
            /**
             * Width of the scaled target in percent
             * @type {Number}
             */
            width: 100,
            /**
             * Height of the scaled target in percent
             * @type {Number}
             */
            height: 30,
            /**
             * Line width of the cross
             * @type {Number}
             */
            crossWidth: 2,
            /**
             * Color of the cross
             * @type {String}
             */
            crossColor: '#000',
            margin: {}
        },

        /**
         * Creates the scaled target
         */
        createScaledTarget: function () {

            var self = this,
                /**
                 * Options for the scaled target
                 * @type {Object}
                 */
                targetOptions = {
                    target: self.mainTarget.target,
                    zoomable: false,
                    draggable: false,
                    zoom: self.mainTarget.zoom,
                    backgroundColor: self.options.backgroundColor,
                    transX: self.scaledTarget.defaultTransX,
                    transY: self.scaledTarget.defaultTransY
                };

            /*
             * Add event listeners
             */
            self.mainTarget.container
                .on('arrowSelect.jArcherTarget', function (e, arrowSetID, arrowID, arrows) {
                    self.onArrowSelect(arrowSetID, arrowID, arrows)
                })
                .on('arrowDeselect.jArcherTarget', function (e, arrowSetID, arrowID, arrows) {
                    self.onArrowDeselect(arrowSetID, arrowID, arrows)
                })
                .on('arrowMove.jArcherTarget', function (e, arrowSetID, arrowID, arrows) {
                    self.onArrowMove(arrowSetID, arrowID, arrows)
                });


            if (!self.options.margin.bottom && self.options.margin.bottom !== 0) {

                self.options.margin.bottom = self.scaledTarget.wrapperHeight;

            }

            /*
             * Create the cross.
             */
            self.createCross();

            /*
             * Create the scaled target with the target options...
             */
            self.scaledTarget.container = $('<div/>').attr('id', self.mainTarget.container[0].id + 'ScaledTarget').css({

                    width: self.scaledTarget.width,
                    height: self.scaledTarget.height,
                    'z-index': 980
                    
                }).archerTarget(targetOptions);

            self.scaledTarget.wrapper = $('<div/>').attr('id', self.mainTarget.container[0].id + 'ScaledTargetWrapper').css({

                    width: self.scaledTarget.wrapperWidth,
                    height: self.scaledTarget.wrapperHeight,
                    overflow: 'hidden',
                    'margin-bottom': self.options.margin.bottom * (-1) + 'px'

                }).append(self.cross).append(self.scaledTarget.container).hide();


            /*
             * ... and add the target before the container.
             */
            self.mainTarget.container.before(self.scaledTarget.wrapper);

        },

        /**
         * Creates the cross for the scaled target
         */
        createCross: function () {

            var self = this;

            self.crossXEl = $('<div class="crossX"></div>').css({

                'border-bottom': self.options.crossWidth + 'px solid ' + self.options.crossColor,
                width: self.scaledTarget.wrapperWidth,
                height: self.crossY,
                position: 'absolute'

            });

            self.crossYEl = $('<div class="crossY"></div>').css({

                'border-right': self.options.crossWidth + 'px solid ' + self.options.crossColor,
                width: self.crossY,
                height: self.scaledTarget.wrapperHeight,
                position: 'absolute'

            });

            self.cross = $('<div/>').attr('id', self.mainTarget.container[0].id + 'Cross')
                .append(self.crossYEl)
                .append(self.crossXEl)
                .css({
                    'z-index': 990,
                    position: 'relative',
                    top: 0,
                    left: 0
                });
        },

        /**
         * Called if an arrow is selected. Will show the sclaed target, etc.
         * @param  {Object}  e          jQuery event
         * @param  {Integer} arrowSetID Id of the arrowset the arrow is in
         * @param  {Integer} arrowID    Id of the arrow in the arrowset
         * @param  {Object}  arrows     Object containing all arrowset objects
         */
        onArrowSelect: function (arrowSetID, arrowID, arrows) {

            if (arrows[arrowSetID].draggable == 0) {
                return false;
            }

            this.arrows = arrows;

            var self = this,
                /**
                 * Position of the arrow in pixel
                 * @type {Object}
                 */
                arrow = self.getArrowPosition(arrowSetID, arrowID),
                /**
                 * Distance of the arrow to the center in pixel
                 * @type {Object}
                 */
                fromCenter = {
                    x: self.mainTarget.width / 2 - arrow.x,
                    y: self.mainTarget.height / 2 - arrow.y
                };

            self.movingArrow = true;
            self.activeArrowID = arrowID;
            self.activeArrowSetID = arrowSetID;

            /*
             * Show the scaled target
             */
            self.scaledTarget.wrapper.show();
            
            /*
             * Set the position and the zoom of the main target
             */
            self.mainTarget.container.archerTarget('set', 'transform',
                self.mainTarget.scaledTransX + fromCenter.x / self.mainTarget.defaultZoom - fromCenter.x / self.options.tapZoom,
                self.mainTarget.scaledTransY + fromCenter.y / self.mainTarget.defaultZoom - fromCenter.y / self.options.tapZoom,
                self.options.tapZoom
            );

            self.arrowOldX = arrow.x;
            self.arrowOldY = arrow.y;

            self.movingController(arrowSetID, arrowID, true);

            
        },

        /**
         * Called if an arrow was dropped/deselect. Will hide the scaled target and the cross, etc.
         * @param  {Object}  e          jQuery event
         * @param  {Integer} arrowSetID Id of the arrowset the arrow is in
         * @param  {Integer} arrowID    Id of the arrow in the arrowset
         * @param  {Object}  arrows     Object containing all arrowset objects
         */
        onArrowDeselect: function (arrowSetID, arrowID, arrows) {

            var self = this;
            
            self.scaledTarget.wrapper.hide();
 
            self.mainTarget.container.archerTarget('set', 'transform',
                self.mainTarget.defaultTransX,
                self.mainTarget.defaultTransY,
                self.mainTarget.defaultZoom
            );

            self.resetCrossPosition();

            self.arrows = arrows;

            self.movingArrow = false;

        },

        onArrowMove: function (arrowSetID, arrowID, arrows) {

            this.arrows = arrows;

        },

        movingController: function (arrowSetID, arrowID, setScaledTargetPos) {

            if (!this.movingArrow) {
                return;
            }


            var self = this,
                main = self.mainTarget,
                arrow = self.getArrowPosition(arrowSetID, arrowID),
                fromCenter = {
                    x: (main.width / 2 - arrow.x) - (main.scaledTransX - main.transX) * self.mainTarget.zoom,
                    y: (main.height / 2 - arrow.y) - (main.scaledTransY - main.transY) * self.mainTarget.zoom
                };
                

            if (setScaledTargetPos) self.setScaledTarget(fromCenter);

            self.setCrossPosition(arrow.x, arrow.y);

            self.checkMoving(arrowSetID, arrowID);
            
                
            requestAnimationFrame(function () {
                self.movingController(arrowSetID, arrowID, false);
            });

        },

        /**
         * Sets the position of the cross
         * @param {Integer} x Position of the arrow on the x-axe
         * @param {Integer} y Position of the arrow on the y-axe
         */
        setCrossPosition: function (x, y) {

            var self = this,
                cx = self.scaledTarget.wrapperWidth / 2  - (self.arrowOldX - x) / (self.mainTarget.zoom / self.options.scaledZoom),
                cy = self.scaledTarget.wrapperHeight / 2 - (self.arrowOldY - y) / (self.mainTarget.zoom / self.options.scaledZoom);

            self.crossX = (cx - self.options.crossWidth / 2);
            self.crossY = (cy - self.options.crossWidth / 2);

            self.crossXEl.css({

                height: self.crossY
                
            });

            self.crossYEl.css({

                width: self.crossX
                
            });

        },


        /**
         * Set the position of the scaled target
         * @param {Object} fromCenter Distance to the center of the target (x and y coordinate)
         */
        setScaledTarget: function (fromCenter) {

            var self = this,
                transX = self.scaledTarget.defaultTransX + fromCenter.x / (self.mainTarget.zoom / self.options.scaledZoom),
                transY = self.scaledTarget.defaultTransY + fromCenter.y / (self.mainTarget.zoom / self.options.scaledZoom);

            transX += self.crossX - self.crossOrgX
            transY += self.crossY - self.crossOrgY

            self.scaledTarget.container.archerTarget('set', 'transform', transX, transY);

        },

        /**
         * Get the actual position of an arrow.
         * 
         * @param  {Integer} arrowSetID Id of the arrowset containing the arrow
         * @param  {Integer} arrowID    Id of the arrow in the arrowset
         * @return {Object}  Position of the arrow
         */
        getArrowPosition: function (arrowSetID, arrowID) {

            var arrowElement = this.arrows[arrowSetID].data[arrowID].element;

            return {
                x: parseInt(arrowElement.getAttribute('cx'), 10),
                y: parseInt(arrowElement.getAttribute('cy'), 10)
            };

        },

        /**
         * Sets the position of the cross to the center
         */
         resetCrossPosition: function () {

            var self = this;

            /**
             * Position of the cross on the x-axe
             * @type {Number}
             */
            self.crossX = self.crossOrgX = (self.scaledTarget.wrapperWidth - self.options.crossWidth / 2) / 2;
            /**
             * Position of the cross on the y-axe
             * @type {Number}
             */
            self.crossY = self.crossOrgY = (self.scaledTarget.wrapperHeight - self.options.crossWidth / 2) / 2;


        },


        /**
         * Checks, if we have to move the main (and scaled) target.
         */
        checkMoving: function (arrowSetID, arrowID) {

            var self = this
                /**
                 * The position of the current arrow in pixel
                 * @type {Object}
                 */
                arrow            = self.getArrowPosition(arrowSetID, arrowID),
                /**
                 * If true, the main target was moved
                 * @type {Boolean}
                 */
                hasMoved         = false,

                main             = self.mainTarget,
                mainZoom         = self.mainTarget.zoom,
                mainWidth        = main.width,
                mainHeight       = main.height,
                mainTransX       = main.transX,
                mainTransY       = main.transY,
                mainScaledTransX = main.scaledTransX,
                mainScaledTransY = main.scaledTransY;

            /*
             * Check if the arrow is on the top/right/left/bottom, so we've to position the target.
             */
            if (arrow.y < self.options.margin.bottom + 20) {
                mainTransY += 1;
                hasMoved = true;
                                    
            } else if (arrow.y > mainHeight - 20) {
                mainTransY -= 1;
                hasMoved = true;
            }
                        
            if (arrow.x < 20) {
                mainTransX += 1;
                hasMoved = true;
            } else if (arrow.x > mainWidth - 20) {
                mainTransX -= 1;
                hasMoved = true;
            }


            if (hasMoved) {

                self.mainTarget.setTransform(
                    mainTransX,
                    mainTransY
                );

                var fromCenter = {
                    x: (main.width / 2 - arrow.x) - (main.scaledTransX - main.transX) * main.zoom,
                    y: (main.height / 2 - arrow.y) - (main.scaledTransY - main.transY) * main.zoom
                };

                    
                self.setScaledTarget(fromCenter, true);
            }

        }

    });

}(jQuery));