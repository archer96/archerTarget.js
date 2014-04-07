/*
 * archerTarget.js plugin "appZoom" - version 0.3 [2014-01-19]
 * This plugin shows a scaleed target if an arrow is moving.
 * Created for use in smartphone applications.
 *
 * Copyright 2012 - 2014, Andre Meyering
 * Licensed under the MIT license.
 */
(function () {

	'use strict';

	var appZoom = function (target, options) {

		var self = this,
			mainWidth,
			mainHeight;

		self.movingArrow = false;

		/*
		 * Normal target
		 */
		self.mainTarget = target;
		self.mainTarget.defaultZoom = self.mainTarget.scale;
		/*
		 * Extend the given functions with the defaults
		 */
		self.options = ArcherTarget.extend(true, {}, self.defaults, options);


		mainWidth = self.mainTarget.width;
		mainHeight = self.mainTarget.height;

		/*
		 * Set the default and scaled transX and transY of the main target.
		 * We need the default to "reset" the target after a arrow was moved
		 * and the scaled if an arrow is moving.
		 */
		self.mainTarget.defaultTransX = mainWidth / 2 / self.mainTarget.defaultZoom -
			mainWidth / 2;
		self.mainTarget.defaultTransY = mainHeight / 2 / self.mainTarget.defaultZoom -
			mainHeight / 2;
		self.mainTarget.scaledTransX = mainWidth / 2 / self.options.tapScale -
			mainWidth / 2;
		self.mainTarget.scaledTransY = mainHeight / 2 / self.options.tapScale -
			mainHeight / 2;

		self.mainTarget.setTransform(
			self.mainTarget.defaultTransX,
			self.mainTarget.defaultTransY
		);

		/*
		 * We set the height and width of the scaled target.
		 */
		self.scaledTarget = {};
		self.scaledTarget.width = mainWidth * self.options.scaledZoom;
		self.scaledTarget.height = mainHeight * self.options.scaledZoom;
		self.scaledTarget.wrapperWidth = mainWidth / 100 * self.options.width;
		self.scaledTarget.wrapperHeight =
			!self.options.useHeightPx ?
			mainHeight / 100 * self.options.height :
			self.options.height;
		/*
		 * Set the default transX and transY of the scaled target target.
		 * If we use these variables, it will center the target.
		 */
		self.scaledTarget.defaultTransX = -(self.scaledTarget.width / 2 -
			self.scaledTarget.wrapperWidth / (2 * self.mainTarget.defaultZoom));
		self.scaledTarget.defaultTransY = -(self.scaledTarget.height / 2 -
			self.scaledTarget.wrapperHeight / (2 * self.mainTarget.defaultZoom));

		self.resetCrossPosition();

		/*
		 * Create the (hidden) scaled target.
		 */
		self.createScaledTarget();

	};

	/**
	 * Default parameters
	 * @type {Object}
	 */
	appZoom.prototype.defaults = {
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
		tapScale: 1.5,
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
	};

	appZoom.prototype.createTargetOptions = function () {

		var self = this,
			orgTargetList = self.mainTarget.targetList,
			targetList = [],
			m = self.mainTarget,
			s = self.scaledTarget,
			target;

		for (var i = 0; i < orgTargetList.length; i++) {
			target = orgTargetList[i];
			targetList[i] = {
				center: target.center,
				diameter: target.diameter,
				name: target.name
			};
		}

		return {
			target: targetList,
			scalable: false,
			draggable: false,
			scale: m.scale,
			backgroundColor: self.options.backgroundColor,
			transX: s.defaultTransX,
			transY: s.defaultTransY
		};

	};

	/**
	 * Creates the scaled target
	 */
	appZoom.prototype.createScaledTarget = function () {

		var self = this,
			/**
			 * Options for the scaled target
			 * @type {Object}
			 */
			targetOptions = self.createTargetOptions(),
			c = self.mainTarget.container,
			b = self.options.margin.bottom;
		/*
		 * Add event listeners
		 */
		c.addEventListener('arrowSelect.archerTarget', function (e) {
			self.onArrowSelect(e.arrowset, e.arrow, e.arrows);
		});
		c.addEventListener('arrowDeselect.archerTarget', function (e) {
			self.onArrowDeselect(e.arrowset, e.arrow, e.arrows);
		});
		c.addEventListener('arrowMove.archerTarget', function (e) {
			self.onArrowMove(e.arrowset, e.arrow, e.arrows);
		});

		if (!b && b !== 0) {
			self.options.margin.bottom = self.scaledTarget.wrapperHeight;
		}

		/*
		 * Create the cross.
		 */
		self.createCross();

		var w = document.createElement('div');

		w.innerHTML += '<div id="' + self.mainTarget.container.id + 'ScaledTargetWrapper" ' +
			'style="display:none;width:' + self.scaledTarget.wrapperWidth + 'px;height:' +
			self.scaledTarget.wrapperHeight + 'px;z-index:980;' +
			'margin-bottom:' + self.options.margin.bottom * (-1) + 'px;overflow:hidden;">' +
				'<div id="' + self.mainTarget.container.id + 'ScaledTarget" style="width:' +
				self.scaledTarget.width + 'px;height:' + self.scaledTarget.height + 'px;' +
				'z-index:980;position:relative;overflow:hidden;"></div>' +
			'</div>';

		self.scaledTarget.wrapper = w.childNodes[0];
		self.scaledTarget.container = w.querySelector('#' + self.mainTarget.container.id +
			'ScaledTarget');

		/*
		 * Create the scaled target with the target options...
		 */
		self.scaledTarget.wrapper.insertBefore(self.cross, self.scaledTarget.container);

		/*
		 * ... and add the target before the container.
		 */
		c.parentNode.insertBefore(self.scaledTarget.wrapper, c);

		self.scaledAT = new ArcherTarget(self.scaledTarget.container, targetOptions);

	};

	/**
	 * Creates the cross for the scaled target
	 */
	appZoom.prototype.createCross = function () {

		var self = this,
			x,
			y,
			c;

		x = '<div class="crossX" style="width:' + self.scaledTarget.wrapperWidth + 'px;' +
			'height:' + self.options.crossWidth + 'px;' +
			'background-color:' + self.options.crossColor +
			';position:absolute;"></div>';

		y = '<div class="crossY" style="width:' + self.options.crossWidth + 'px;' +
			'height:' + self.scaledTarget.wrapperHeight + 'px;' +
			'background-color:' + self.options.crossColor +
			';position:absolute;"></div>';

		c = '<div id="' + self.mainTarget.container.id + 'Cross" style="z-index:990;' +
			'position:relative;top:0;left:0">' + y + x + '</div>';

		self.cross = document.createElement('div');
		self.cross.innerHTML = c;

		self.crossXEl = self.cross.querySelector('.crossX');
		self.crossYEl = self.cross.querySelector('.crossY');

		self.cross = self.cross.childNodes[0];

	};

	/**
	 * Called if an arrow is selected. Will show the sclaed target, etc.
	 * @param  {Object}  e          jQuery event
	 * @param  {Integer} arrowSetID Id of the arrowset the arrow is in
	 * @param  {Integer} arrowID    Id of the arrow in the arrowset
	 * @param  {Object}  arrows     Object containing all arrowset objects
	 */
	appZoom.prototype.onArrowSelect = function (arrowSetID, arrowID, arrows) {

		if (!arrows[arrowSetID].draggable) {
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
		self.scaledTarget.wrapper.style.display = 'block';

		/*
		 * Set the position and the scale of the main target
		 */

		self.mainTarget.setTransform(
			self.mainTarget.scaledTransX + fromCenter.x / self.mainTarget.defaultZoom -
				fromCenter.x / self.options.tapScale,
			self.mainTarget.scaledTransY + fromCenter.y / self.mainTarget.defaultZoom -
				fromCenter.y / self.options.tapScale,
			self.options.tapScale
		);

		self.arrowOldX = arrow.x;
		self.arrowOldY = arrow.y;

		self.movingController(arrowSetID, arrowID, true);

	};

	/**
	 * Called if an arrow was dropped/deselect. Will hide the scaled target and the cross, etc.
	 * @param  {Object}  e          jQuery event
	 * @param  {Integer} arrowSetID Id of the arrowset the arrow is in
	 * @param  {Integer} arrowID    Id of the arrow in the arrowset
	 * @param  {Object}  arrows     Object containing all arrowset objects
	 */
	appZoom.prototype.onArrowDeselect = function (arrowSetID, arrowID, arrows) {

		var self = this;

		self.scaledTarget.wrapper.style.display = 'none';

		self.mainTarget.setTransform(
			self.mainTarget.defaultTransX,
			self.mainTarget.defaultTransY,
			self.mainTarget.defaultZoom
		);

		self.resetCrossPosition();

		self.arrows = arrows;

		self.movingArrow = false;

	};

	appZoom.prototype.onArrowMove = function (arrowSetID, arrowID, arrows) {
		this.arrows = arrows;
	};

	appZoom.prototype.movingController = function (arrowSetID, arrowID, setScaledTargetPos) {

		if (!this.movingArrow) {
			return;
		}

		var self = this,
			main = self.mainTarget,
			arrow = self.getArrowPosition(arrowSetID, arrowID),
			fromCenter = {
				x: (main.width / 2 - arrow.x) - (main.scaledTransX - main.transX) *
					self.mainTarget.scale,
				y: (main.height / 2 - arrow.y) - (main.scaledTransY - main.transY) *
					self.mainTarget.scale
			};

		if (setScaledTargetPos) {
			self.setScaledTarget(fromCenter);
		}

		self.setCrossPosition(arrow.x, arrow.y);

		self.checkMoving(arrowSetID, arrowID);


		window.requestAnimationFrame(function () {
			self.movingController(arrowSetID, arrowID, false);
		});

	};

	appZoom.prototype.setCrossTransform = function (element, transform) {
		element.style['-webkit-transform'] = transform;
		element.style['-moz-transform'] = transform;
		element.style['-o-transform'] = transform;
		element.style['-ms-transform'] = transform;
		element.style.transform = transform;

	};

	/**
	 * Sets the position of the cross
	 * @param {Integer} x Position of the arrow on the x-axe
	 * @param {Integer} y Position of the arrow on the y-axe
	 */
	appZoom.prototype.setCrossPosition = function (x, y) {

		var self = this,
			cx = self.scaledTarget.wrapperWidth / 2  - (self.arrowOldX - x) /
				(self.mainTarget.scale / self.options.scaledZoom),
			cy = self.scaledTarget.wrapperHeight / 2 - (self.arrowOldY - y) /
				(self.mainTarget.scale / self.options.scaledZoom);

		self.crossX = (cx - self.options.crossWidth / 2);
		self.crossY = (cy - self.options.crossWidth / 2);

		self.setCrossTransform(self.crossYEl, 'translate3d(' + self.crossX + 'px, 0, 0)');
		self.setCrossTransform(self.crossXEl, 'translate3d(0, ' + self.crossY + 'px, 0)');

	};


	/**
	 * Set the position of the scaled target
	 * @param {Object} fromCenter Distance to the center of the target (x and y coordinate)
	 */
	appZoom.prototype.setScaledTarget = function (fromCenter) {

		var self = this,
			transX = self.scaledTarget.defaultTransX + fromCenter.x /
				(self.mainTarget.scale / self.options.scaledZoom),
			transY = self.scaledTarget.defaultTransY + fromCenter.y /
				(self.mainTarget.scale / self.options.scaledZoom);

		transX += self.crossX - self.crossOrgX;
		transY += self.crossY - self.crossOrgY;

		self.scaledAT.set('transform', transX, transY);

	};

	/**
	 * Get the actual position of an arrow.
	 *
	 * @param  {Integer} arrowSetID Id of the arrowset containing the arrow
	 * @param  {Integer} arrowID    Id of the arrow in the arrowset
	 * @return {Object}  Position of the arrow
	 */
	appZoom.prototype.getArrowPosition = function (arrowSetID, arrowID) {

		var arrowElement = this.arrows[arrowSetID].data[arrowID].el;

		return {
			x: parseInt(arrowElement.getAttribute('cx'), 10),
			y: parseInt(arrowElement.getAttribute('cy'), 10)
		};

	};

	/**
	 * Sets the position of the cross to the center
	 */
	appZoom.prototype.resetCrossPosition = function () {

		var self = this;

		/**
		 * Position of the cross on the x-axe
		 * @type {Number}
		 */
		self.crossX = self.crossOrgX = (self.scaledTarget.wrapperWidth -
			self.options.crossWidth / 2) / 2;
		/**
		 * Position of the cross on the y-axe
		 * @type {Number}
		 */
		self.crossY = self.crossOrgY = (self.scaledTarget.wrapperHeight -
			self.options.crossWidth / 2) / 2;

	};

	/**
	 * Checks, if we have to move the main (and scaled) target.
	 */
	appZoom.prototype.checkMoving = function (arrowSetID, arrowID) {

		var self = this,
			/**
			 * The position of the current arrow in pixel
			 * @type {Object}
			 */
			arrow = self.getArrowPosition(arrowSetID, arrowID),
			/**
			 * If true, the main target was moved
			 * @type {Boolean}
			 */
			hasMoved = false,
			/*
			 * references
			 */
			main       = self.mainTarget,
			mainWidth  = main.width,
			mainHeight = main.height,
			mainTransX = main.transX,
			mainTransY = main.transY;

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
				x: (main.width / 2 - arrow.x) - (main.scaledTransX - main.transX) * main.scale,
				y: (main.height / 2 - arrow.y) - (main.scaledTransY - main.transY) * main.scale
			};


			self.setScaledTarget(fromCenter, true);
		}

	};

	ArcherTarget.addPlugin('appZoom', {

		init: function (target, options) {
			return new appZoom(target, options);
		}

	});

}());
