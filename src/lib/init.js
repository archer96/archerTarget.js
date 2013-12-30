AT.prototype.init = function () {

	var self = this;

	DEVMODE && console.log('archerTarget :: initializing archerTarget :: init');

	self.isTouch();

	/*
	 * Add class 'archerTargetContainer' to the container and give it some style.
	 */
	self.container.className += ' archerTargetContainer';
	self.container.style.overflow = 'hidden';
	self.container.style.position = 'relative';

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
	RAF();
	/*
	 * Get size variables (width and height)
	 */
	self.getSize();
	/*
	 * Create a new canvas (SVG element)
	 */
	self.canvas = new VectorCanvas(self.width, self.height);
	/*
	 * Append the canvas to the container
	 */
	self.container.appendChild(self.canvas.canvas);
	/*
	 * Create the target group
	 */
	self.targetGroup = self.canvas.createGroup(
		{ id: self._id + 'TargetGroup' },
		true
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

	self.setGap();
	/*
	 * Create the arrowset array
	 */
	this.arrowList = self.createArrows(self.options.arrows);

	self.bindArrowEvents();
	self.bindContainerEvents();
	self.bindTargetEvents();

	/*
	 * Add the scale buttons if required.
	 */
	if (self.options.scalable) {

		var zoomIn = document.createElement('div'),
			zoomOut = document.createElement('div');

		zoomIn.className = 'archerTarget-zoomin';
		zoomOut.className = 'archerTarget-zoomout';

		zoomIn.innerHTML = self.options.zoomInButton;
		zoomOut.innerHTML = self.options.zoomOutButton;

		self.container.appendChild(zoomIn);
		self.container.appendChild(zoomOut);
		/*
		 * And bind scale events
		 */
		self.bindZoomEvents();
	}


	/* Apply possible zoom */
	self.setTransform();

	/*
	 * Initialize the plugins
	 */
	self.initPlugins();

};
