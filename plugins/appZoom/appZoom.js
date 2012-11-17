/*
 * jArcherTarget plugin "appZoom" - version 0.2 [2012-09-23]
 * This plugin shows a zoom target if an arrow is moving. Created for use in smartphone applications.
 *
 * Copyright 2012, Andre Meyering
 * Licensed under the MIT license.
 */
(function ($) {

    $.fn.archerTarget('addPlugin', 'appZoom', {

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
            self.scaledTarget.wrapperHeight = mainHeight / 100 * self.options.height;
            /*
             * Set the default transX and transY of the scaled target target. If we use these variables, it will center the target.
             */
            self.scaledTarget.defaultTransX = -(self.scaledTarget.width / 2 - self.scaledTarget.wrapperWidth / (2 * self.mainTarget.defaultZoom));
            self.scaledTarget.defaultTransY = -(self.scaledTarget.height / 2 - self.scaledTarget.wrapperHeight / (2 * self.mainTarget.defaultZoom));
            
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

                }).append(self.createCross()).append(self.scaledTarget.container).hide();


            /*
             * ... and add the target before the container.
             */
            self.mainTarget.container.before(self.scaledTarget.wrapper);

        },

        /**
         * Creates the cross for the scaled target
         * @return {Object} Cross DOM element
         */
        createCross: function () {

            var self = this,
                cross = $('<div/>').attr('id', self.mainTarget.container[0].id + 'Cross').append(

                    $('<div/>').css({

                        'border-bottom': self.options.crossWidth + 'px solid ' + self.options.crossColor,
                        width: self.scaledTarget.wrapperWidth,
                        height: (self.scaledTarget.wrapperHeight - self.options.crossWidth / 2) / 2

                    }).css({
                        position: 'absolute'
                    })

                ).append(

                    $('<div/>').css({

                        'border-right': self.options.crossWidth + 'px solid ' + self.options.crossColor,
                        width: (self.scaledTarget.wrapperWidth - self.options.crossWidth / 2) / 2,
                        height: self.scaledTarget.wrapperHeight

                    }).css({
                        position: 'absolute'
                    })

                ).css({
                    'z-index': 990,
                    position: 'relative',
                    top: 0,
                    left: 0
                });

            return cross;
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
                arrowElement = arrows[arrowSetID].data[arrowID].element,
                /**
                 * Position of the arrow in pixel
                 * @type {Object}
                 */
                arrow = {
                    x: parseInt(arrowElement.getAttribute('cx'), 10),
                    y: parseInt(arrowElement.getAttribute('cy'), 10)
                },
                /**
                 * Distance of the arrow to the center in pixel
                 * @type {Object}
                 */
                fromCenter = {
                    x: self.mainTarget.width / 2 - arrow.x,
                    y: self.mainTarget.height / 2 - arrow.y
                };


            self.movingArrow = true;

            
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

            
            var setScaledTarget = function () {

                self.setScaledTarget(arrowSetID, arrowID, self.arrows);

            };

            
            cancelAnimationFrame(setScaledTarget);
            /*
             * Set the scaled target
             */
            requestAnimationFrame(setScaledTarget);

            /*
             * Don't know why, but Chrome doesn't call setScaledTarget after first time using requestAnimationFrame
             */
            if (window.webkitRequestAnimationFrame) {
                requestAnimationFrame(setScaledTarget);
            }

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

            self.arrows = arrows;

            self.movingArrow = false;

        },

        onArrowMove: function (arrowSetID, arrowID, arrows) {

            this.arrows = arrows;

        },

        /**
         * Will set the position of the scaled target
         * @param  {Integer} arrowSetID Id of the arrowset the arrow is in
         * @param  {Integer} arrowID    Id of the arrow in the arrowset
         * @param  {Object}  arrows     Object containing all arrowset objects
         */
        setScaledTarget: function (arrowSetID, arrowID, arrows) {

            var self = this;

            if (self.movingArrow) {
                
                /**
                 * The position of the current arrow in pixel
                 * @type {Object}
                 */
                var arrowElement = arrows[arrowSetID].data[arrowID].element,
                    arrow = {
                        x: parseInt(arrowElement.getAttribute('cx'), 10),
                        y: parseInt(arrowElement.getAttribute('cy'), 10)
                    },
                    main = self.mainTarget,
                    mainZoom = self.mainTarget.zoom,
                    mainWidth = main.width,
                    mainHeight = main.height,
                    mainTransX = main.transX,
                    mainTransY = main.transY,
                    mainScaledTransX = main.scaledTransX,
                    mainScaledTransY = main.scaledTransY,
                    /**
                     * Distance of the arrow to the center in pixel
                     * @type {Object}
                     */
                    fromCenter = {
                        x: (mainWidth / 2 - arrow.x) - (mainScaledTransX - mainTransX) * mainZoom,
                        y: (mainHeight / 2 - arrow.y) - (mainScaledTransY - mainTransY) * mainZoom
                    },
                    /**
                     * Called to move the target if needed
                     * @param {Boolean} arrowMove If false, the function is called by the moving interval
                     */
                    moveTarget = function (arrowMove) {

                        /*
                         * Check if the arrow is on the top/right/left/bottom, so we've to position the target.
                         */
                        if (arrow.y < self.options.margin.bottom + 20 && mainTransY < (mainScaledTransY + mainHeight / 2 / mainZoom + self.options.margin.bottom)) {

                            mainTransY += 2;

                            self.mainTarget.setTransform(
                                mainTransX,
                                mainTransY
                            );
                                    
                        } else if (arrow.y > mainHeight - 20 && mainTransY > (mainScaledTransY + mainHeight / -2 / mainZoom)) {

                            mainTransY -= 2;

                            self.mainTarget.setTransform(
                                false,
                                mainTransY
                            );

                        }

                        
                        if (arrow.x < 20 && mainTransX < (mainScaledTransX + mainWidth / 2 / mainZoom)) {

                            mainTransX += 2;

                            self.mainTarget.setTransform(
                                mainTransX,
                                mainTransY
                            );
                                    
                        } else if (arrow.x > mainWidth - 20 && mainTransX > (mainScaledTransX + mainWidth / -2 / mainZoom)) {

                            mainTransX -= 2;

                            self.mainTarget.setTransform(
                                mainTransX,
                                mainTransY
                            );

                        }

                        /*
                         * The position of the scaled target
                         */
                        self.scaledTarget.container.archerTarget('set', 'transform',
                            self.scaledTarget.defaultTransX + fromCenter.x / (mainZoom / self.options.scaledZoom),
                            self.scaledTarget.defaultTransY + fromCenter.y / (mainZoom / self.options.scaledZoom)
                        );

                    };

                /*
                 * Move the target
                 */
                moveTarget();

                requestAnimationFrame(function () {
                    self.setScaledTarget(arrowSetID, arrowID, self.arrows);
                });


            }

        }


    });

}(jQuery));