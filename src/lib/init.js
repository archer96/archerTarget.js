ArcherTarget.prototype.init = function () {

    DEVMODE && console.log('archerTarget :: initializing jQuery.archerTarget :: init');

	var self = this;

    /*
     * Add class #archerTargetContainer' to the container and give it some style.
     */
    self.$container.addClass('archerTargetContainer').css({
        position: 'relative',
        overflow: 'hidden'
    });
    /*
     * Only a shorter reference
     */
    self.transX = self.options.transX;
    self.transY = self.options.transY;
    self.scale = self.options.scale;
    self.pluginList = self.options.plugins;
    /*
     * Merge styles (initial, hover,...)
     */
    self.mergeStyles();
    /*
     * Set the backgroundcolor
     */
    self.setBackgroundColor(self.options.backgroundColor);
    /*
     * Initialize the converter
     */
    self.initConverter();
    /*
     * Check for requestAnimationFrame() support or use a hack
     */
    self.RAF();
    /*
     * Set size variables (width and height)
     */
    self.setSize();
    /*
     * Create a new canvas (SVG element)
     */
    self.canvas = new VectorCanvas(self.width, self.height);
    /*
     * Append the canvas to the container
     */
    self.$container.append(self.canvas.canvas);
    /*
     * Create the target group
     */
    self.targetGroup = self.canvas.createGroup(
        true,
        {
            id: self.$containerId + 'TargetGroup'
        }
    );
    /*
     * Append it to the canvas.
     */
    self.canvas.canvas.appendChild(self.targetGroup);
    /*
     * Create the target array
     */
    self.targetList = self.createTarget(
        self.options.target instanceof Array ? self.options.target : [{ name: self.options.target }]
    );

    this.setGap();

    /*
     * Create the arrowset array
     */
    this.arrowList = this.createArrows(self.options.arrows);

    /*
     * Depending on the device the user is using, bind all intern events.
     */
    if (self.isTouch()) {

        DEVMODE && console.log('archerTarget :: using a touch device');

        this.bindContainerTouchEvents();
        this.bindArrowTouchEvents();
        this.bindTargetTouchEvents();

    } else {

        DEVMODE && console.log('archerTarget :: using a non-touch device');

        this.bindContainerEvents();
        this.bindArrowEvents();
        this.bindTargetEvents();

    }

    /*
     * Add the scale buttons if required.
     */
    if (this.scalable) {
        $('<div/>').addClass('archerTarget-zoomin').text('+').appendTo(self.$container);
        $('<div/>').addClass('archerTarget-zoomout').html('&#x2212;').appendTo(self.$container);
        /*
         * And bind scale events
         */
        this.bindZoomEvents();
    }


    /* Apply possible zoom */
    this.setTransform();

    /*
     * Initialize the plugins
     */
    self.initPlugins();

};
