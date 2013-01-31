/*!
 * jQuery ArcherTarget - v0.3.0pre - 2013-01-31
 * http://archertarget.andremeyering.de
 * Copyright (c) 2013 Andre Meyering;
 * Licensed MIT
 */
(function (window, document, $, undefined) {

/*
	undefined is used here as the undefined global
	variable in ECMAScript 3 and is mutable (i.e. it can
	be changed by someone else). undefined isn't really
	being passed in so we can ensure that its value is
	truly undefined. In ES5, undefined can no longer be
	modified.

	window and document are passed through as local
	variables rather than as globals, because this (slightly)
	quickens the resolution process and can be more
	efficiently minified (especially when both are
	regularly referenced in your plugin).

	$ (jQuery or Zepto) is passed through as a local
	variable because it could be overwritten by other
	libraries or jQuery could be in noConflict mode
	so $ would not be jQuery or Zepto
*/

// ECMAScript 5 strict mode
'use strict';

if (typeof window.DEVMODE === 'undefined') {
	window.DEVMODE = 0;
}

var
	/**
	 * Plugin name
	 * @type {String}
	 */
	pluginName = 'archerTarget',
	/**
	 * Default options
	 * @type {Object}
	 */
	defaults = {
		/**
		 * Target name (target file has to be loaded after jquery.archertarget.js (!))
		 * @type {String}
		 */
		target: 'wa_x',
		/**
		 * Default options for every target
		 * @type {Object}
		 */
		targetDefaults: {
			center: [50, 50],
			diameter: 90,
			style: {
				initial: {
					opacity: 1
				},
				hover: {
					opacity: 1
				},
				arrowOn: {
					opacity: 1
				},
				arrowOff: {
					opacity: 0.8
				}
			}
		},
		/**
		 * Arrowset object (default none)
		 * @type {Object}
		 */
		arrows: {},
		/**
		 * Default options for every arrowset
		 * @type {Object}
		 */
		arrowDefaults: {
			/**
			 * State of the arrowset (and all arrows in the set).
			 * If false, the arrows will be hidden
			 * @type {Boolean}
			 */
			active: true,
			/**
			 * Arrows draggable by user?
			 * @type {Boolean}
			 */
			draggable: true,
			/**
			 * Radius of the arrows in the arrowset
			 * @type {Number}
			 */
			radius: 5,
			/**
			 * Style of the arrows.
			 * @type {Object}
			 */
			style: {
				/**
				 * Initial style (e.g. when the arrows are loaded)
				 * @type {Object}
				 */
				initial: {
					/**
					 * Opacity of the arrows
					 * @type {Number}
					 */
					opacity: 0.9,
					/**
					 * Color of the arrows
					 * @type {String}
					 */
					color: '#00ff00',
					/**
					 * Shall the arrows have a stroke?
					 * Pass false or HEX-Code (e.g. #013356)
					 * @type {Boolean|String}
					 */
					stroke: false
				},
				/**
				 * Style, if the user hovers an arrow (not available on smartphones).
				 * Arguments are the same as in 'initial'.
				 * @type {Object}
				 */
				hover: {
					opacity: 1
				},
				/**
				 * Style, if the user selects an arrow (e.g. by clicking or dragging).
				 * Arguments are the same as in 'initial'.
				 * @type {Object}
				 */
				selected: {
					opacity: 1
				}
			},
			/**
			 * ID of the target the arrow is on
			 * @type {Number}
			 */
			target: 0
		},
		/**
		 * Backgroundcolor. Pass 'transparent' or an HEX-Code (e.g. #00ff00).
		 * @type {String}
		 */
		backgroundColor: 'transparent',
		/**
		 * Shall the targets / the container be draggable?
		 * @type {Boolean}
		 */
		draggable: true,
		/**
		 * Scale of the container / the targets.
		 * @type {Number}
		 */
		scale: 1,
		/**
		 * Maximal scale of the container / the targets.
		 * @type {Number}
		 */
		maxScale: 6,
		/**
		 * Minimal scale of the container / the targets.
		 * @type {Number}
		 */
		minScale: 0.6,
		/**
		 * Step of the scale buttons.
		 * @type {Number}
		 */
		scaleStep: 0.2,
		/**
		 * Shall the target be scalable? If false, the scale buttons are not
		 * added to the container.
		 * @type {Boolean}
		 */
		scalable: true,
		/**
		 * Transition on the x-axe (usefull for positioning;
		 * see plugin 'appZoom' for example)
		 * @type {Number}
		 */
		transX: 0,
		/**
		 * Transition on the y-axe (usefull for positioning;
		 * see plugin 'appZoom' for example)
		 * @type {Number}
		 */
		transY: 0,
		/**
		 * Class of the arrows.
		 * @type {String}
		 */
		arrowClass: 'arrow',
		/**
		 * Plugins to use.
		 * @type {Object}
		 */
		plugins: {}
	},
	/**
	 * All events supported by jQuery.archerTarget
	 * @type {Object}
	 */
	apiEvents = {

		onTargetOver: 'targetOver',
		onTargetOut: 'targetOut',
		onTargetMove: 'targetMove',
		onTargetClick: 'targetClick',

		onArrowOver: 'arrowOver',
		onArrowOut: 'arrowOut',
		onArrowMove: 'arrowMove',
		onArrowSelect: 'arrowSelect',
		onArrowDeselect: 'arrowDeselect',

		onScale: 'zoom',

		onContainerTap: 'containerTap',
		onContainerMousedown: 'containerMousedown'
	},
	/**
	 * All parameters supported by jQuery.archerTarget
	 * @type {Object}
	 */
	apiParams = {
		get: {
			ring: 1,
			targetParams: 1,
			transform: 1,
			arrows: 1
		},
		set: {
			arrowOptions: 1,
			arrowActive: 1,
			arrowStyle: 1,

			backgroundColor: 1,
			scale: 1,
			transform: 1
		}
	};



/**
 * @constructor
 */
var ArcherTarget = function (element, options) {

	DEVMODE && console.log('archerTarget :: initializing jQuery.archerTarget :: constructor');

	var self = this;

	/*
	 * jQuery has an extend method that merges the
	 * contents of two or more objects, storing the
	 * result in the first object. The first object
	 * is generally empty because we don't want to alter
	 * the default options for future instances of the plugin
	 */
	this.options = options = $.extend(true, {}, defaults, options) ;

	this._defaults = defaults;
	this._name = pluginName;

	self.$container = $(element);
	self.$containerId = element.id ? element.id : self.GUID();

	/*
	 * Bind every event with the given function
	 */
	for (var event in apiEvents) {
		if (apiEvents.hasOwnProperty(event) && options[event]) {
			$(element).on(apiEvents[event] + '.archerTarget', options[event]);
		}
	}

	self.init();

};


ArcherTarget.Targets = {};
ArcherTarget.Plugins = {};

$.fn.archerTarget = function (method) {

	var args = arguments;

	/*
	 * Check if we only want to add a target or plugin
	 */
	if (method === 'addTarget') {
		// arguments[1] = target name
		// arguments[2] = target options/arguments
		ArcherTarget.Targets[arguments[1]] = arguments[2];

		DEVMODE && console.log('archerTarget :: added target ' + arguments[1]);

		return $(this);

	} else if (method === 'addPlugin') {
		// arguments[1] = plugin name
		// arguments[2] = plugin options/arguments
		ArcherTarget.Plugins[arguments[1]] = arguments[2];

		DEVMODE && console.log('archerTarget :: added plugin ' + arguments[1]);

		return $(this);
	/*
	 * Check if we want to set or get something.
	 */
	} else if ((method === 'set' || method === 'get')) {

		var methodName;

		if (!apiParams[method][args[1]]) {
			$.error('Method ' +  method + args[1] + ' does not exist on jQuery.' + pluginName);
		}

		// Example: ring -> Ring -> get + Ring -> getRing
		methodName = method + args[1].charAt(0).toUpperCase() + args[1].substr(1);

		// Note that arguments is not an Array, but we want to call the .slice()
		// method on it. We do this with .call().
		return $(this).data('plugin_' + pluginName)[methodName].apply(
			$(this).data('plugin_' + pluginName), Array.prototype.slice.call(args, 2));

	/*
	 * Otherwise initialize jQuery.archerTarget (only if either options or nothing is given).
	 */
	} else if (typeof method === 'object' || ! method) {

		/*
		 * Go through each passed element.
		 */
		return this.each(function () {

			if (!$(this).data('plugin_' + pluginName)) {

				$(this).data(
					'plugin_' + pluginName,
					new ArcherTarget(this, method)
				);

			}


		});

	} else {

		$.error('Method ' +  method + ' does not exist on jQuery.' + pluginName);

	}

};


/**
 * GUID generator
 * Script from: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
 */
ArcherTarget.prototype.GUID = function () {

	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
		return v.toString(16);
	});

};

/**
 * Simple check for requestAnimationFrame and cancelAnimationFrame.
 */
ArcherTarget.prototype.RAF = function () {

    /*
     * requestAnimationFrame - browser check
     * see: http://paulirish.com/2011/requestanimationframe-for-smart-animating/
     */
    var lastTime = 0,
        vendors = ['ms', 'moz', 'webkit', 'o'],
        i;

    for (i = 0; i < vendors.length && !window.requestAnimationFrame; i++) {

        window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'] ||
            window[vendors[i] + 'CancelRequestAnimationFrame'];

    }

    if (!window.requestAnimationFrame) {

        window.requestAnimationFrame = function (callback) {

            var currTime = new Date().getTime(),
                timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                }, timeToCall);

            lastTime = currTime + timeToCall;

            return id;

        };

    }

    if (!window.cancelAnimationFrame) {

        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };

    }

};

ArcherTarget.prototype.bindArrowEvents = function () {

	var self = this,
		arrowTmp = {},
		arrowsetTmp = {},
		arrowTarget,
		curPageX,
		curPageY,
		offsetLeft = this.$container.offset().left,
		offsetTop = this.$container.offset().top,
		pointerHeight = 0,
		move,
		onMouseMove,
		onMouseDown,
		onMouseUp,
		onMouseOut;

	self.arrowMoving = false;

	move = function () {

		if (!self.arrowMoving || !arrowsetTmp.data.draggable) {
			return false;
		}

		arrowTmp.el.setPosition({
			x: curPageX,
			y: curPageY
		});

		if (arrowsetTmp.data.draggable instanceof Object) {

			self.setArrowPointer({
				x: curPageX,
				y: curPageY,
				drag: arrowsetTmp.data.draggable,
				arrowRadius: arrowsetTmp.data.radius
			});

		}

		arrowTmp.ring = self.calculateRing({
			x: curPageX,
			y: curPageY - pointerHeight,
			target: arrowTarget
		});


		arrowTmp.x = self.convertTo.pcX(curPageX, arrowTarget);
		arrowTmp.y = self.convertTo.pcY(curPageY - pointerHeight, arrowTarget);
		arrowTmp.ring = arrowTmp.ring;


		if (!self.checkOnTarget(arrowTmp)) {

			var tmpTarget = self.checkClosestTarget(arrowTarget, {x: curPageX, y: curPageY});

			if (arrowTarget !== tmpTarget) {

				arrowTmp.target = arrowTarget = tmpTarget;

				self.setTargetStyle('arrow', { active: arrowTarget });

			}
		}


		/* Save temp data to arrow array */
		self.arrowList[arrowsetTmp.id] = arrowsetTmp.data;
		self.arrowList[arrowsetTmp.id].data[arrowTmp.id] = arrowTmp;

		window.requestAnimationFrame(move);

		arrowTmp.$el.trigger('arrowMove.archerTarget',
			[arrowsetTmp.id, arrowTmp.id, self.arrowList]);

	};

	onMouseMove = function (e) {

		if (self.arrowMoving) {

			curPageX = e.pageX - offsetLeft;
			curPageY = e.pageY - offsetTop;

		}

		return false;

	};

	onMouseDown = function (e) {

		if (!self.arrowMoving) {

			var parentNode = this.parentNode,
				thisClass = $(this).attr('class'),
				id;

			arrowsetTmp.id = parseInt(parentNode.id.substr(parentNode.id.indexOf('_') + 1), 10);
			arrowsetTmp.data = self.arrowList[arrowsetTmp.id];
			arrowTarget = arrowsetTmp.data.target;

			if (thisClass.indexOf(' ') === -1) {

				id = parseInt(thisClass, 10);

			} else {

				id = parseInt(thisClass.substr(0, thisClass.indexOf(' ')), 10);

			}

			arrowTmp = arrowsetTmp.data.data[id];
			arrowTmp.el = this;
			arrowTmp.$el = $(this);
			arrowTmp.id = id;
		}

		if (e.type === 'mousedown') {

			/*
			 * Self triggered mousedown events don't have the pageX and pageY attribute,
			 * so we use the old arrow-position.
			 */
			curPageX = e.pageX - offsetLeft || self.convertTo.pxX(arrowTmp.x, arrowTarget);
			curPageY = e.pageY - offsetTop || self.convertTo.pxY(arrowTmp.y, arrowTarget);

			self.arrowMoving = true;


			if (arrowsetTmp.data.draggable) {

				self.setTargetStyle('arrow', { active: arrowTarget });

				self.$container[0].style.cursor = 'move';

			}

			arrowTmp.el.setAttribute('fill', arrowsetTmp.data.style.selected.color);

			arrowTmp.$el
				.css({
					opacity: arrowsetTmp.data.style.selected.opacity
				})
				.trigger(
					'arrowSelect.archerTarget',
					[arrowsetTmp.id, arrowTmp.id, self.arrowList]
				);


			if (arrowsetTmp.data.draggable instanceof Object && arrowsetTmp.data.draggable) {

				self.createArrowPointer({
					x: self.convertTo.pxX(arrowTmp.x, arrowTarget),
					y: self.convertTo.pxY(arrowTmp.y, arrowTarget),
					drag: arrowsetTmp.data.draggable,
					color: arrowsetTmp.data.style.selected.color,
					arrowRadius: arrowsetTmp.data.radius
				});

				pointerHeight = arrowsetTmp.data.draggable.height + arrowsetTmp.data.radius;


			} else {

				pointerHeight = 0;

			}


			window.cancelAnimationFrame(move);
			/*
			 * request a new animation frame
			 */
			window.requestAnimationFrame(move);


		} else if (e.type === 'mouseover' && !self.arrowMoving) {

			arrowTmp.el.setAttribute('fill', arrowsetTmp.data.style.hover.color);

			arrowTmp.$el.css({
				opacity: arrowsetTmp.data.style.hover.opacity
			}).trigger('arrowOver.archerTarget', [arrowsetTmp.id, arrowTmp.id]);


		}

		return false;

	};

	onMouseUp = function () {

		if (self.arrowMoving) {

			self.arrowMoving = false;

			self.setTargetStyle('initial');

			arrowTmp.el.setAttribute('fill', arrowsetTmp.data.style.hover.color);


			if (arrowsetTmp.data.draggable instanceof Object) {

				self.removeArrowPointer();

				arrowTmp.el.setPosition({
					x: self.convertTo.pxX(arrowTmp.x, arrowTarget),
					y: self.convertTo.pxY(arrowTmp.y, arrowTarget)
				});

			}

			self.$container[0].style.cursor = 'default';

			$(self.$container).trigger('arrowDeselect.archerTarget',
				[arrowsetTmp.id, arrowTmp.id, self.arrowList]);


		}

		return false;

	};

	onMouseOut = function () {

		if (!self.arrowMoving || !arrowsetTmp.data.draggable) {

			arrowTmp.el.setAttribute('fill', arrowsetTmp.data.style.initial.color);

			arrowTmp.$el.css({
				opacity: arrowsetTmp.data.style.initial.opacity
			}).trigger('arrowOut.archerTarget', [arrowsetTmp.id, arrowTmp.id]);

		}

		return false;

	};


	this.$container
		.on('mousemove', onMouseMove)
		.on('mouseup click', onMouseUp)
		.find('.arrowSetCanvas')
		.on('mouseout', 'circle', onMouseOut)
		.on('mousedown mouseover', 'circle', onMouseDown);

};

ArcherTarget.prototype.bindArrowTouchEvents = function () {

	var self = this,
		arrowTmp = {},
		arrowsetTmp = {},
		arrowTarget,
		curPageX,
		curPageY,
		offsetLeft = this.$container.offset().left,
		offsetTop = this.$container.offset().top,
		pointerHeight = 0,
		touch,
		move,
		onTouchMove,
		onTouchStart,
		onTouchEnd;

	self.arrowMoving = false;

	move = function () {

		if (!self.arrowMoving || !arrowsetTmp.data.draggable) {
			return false;
		}

		arrowTmp.el.setPosition({
			x: curPageX,
			y: curPageY
		});

		if (arrowsetTmp.data.draggable instanceof Object) {

			self.setArrowPointer({
				x: curPageX,
				y: curPageY,
				drag: arrowsetTmp.data.draggable,
				arrowRadius: arrowsetTmp.data.radius
			});

		}

		arrowTmp.ring = self.calculateRing({
			x: curPageX,
			y: curPageY - pointerHeight,
			target: arrowTarget
		});

		arrowTmp.x = self.convertTo.pcX(curPageX, arrowTarget);
		arrowTmp.y = self.convertTo.pcY(curPageY - pointerHeight, arrowTarget);


		if (!self.checkOnTarget(arrowTmp)) {

			var tmpTarget = self.checkClosestTarget(arrowTarget, {x: curPageX, y: curPageY});

			if (arrowTarget !== tmpTarget) {

				arrowTmp.target = arrowTarget = tmpTarget;

				self.setTargetStyle('arrow', { active: arrowTarget });

			}
		}


		/* Save temp data to arrow array */
		self.arrowList[arrowsetTmp.id] = arrowsetTmp.data;
		self.arrowList[arrowsetTmp.id].data[arrowTmp.id] = arrowTmp;

		window.requestAnimationFrame(move);

		arrowTmp.$el.trigger('arrowMove.archerTarget',
			[arrowsetTmp.id, arrowTmp.id, self.arrowList]);

	};

	onTouchMove = function (e) {

		if (!self.arrowMoving) {
			return false;
		}

		touch = e.originalEvent.touches[0];

		curPageX = touch.pageX - offsetLeft;
		curPageY = touch.pageY - offsetTop;

		return false;

	};

	onTouchStart = function (e) {

		if (!self.arrowMoving) {

			var parentNode = this.parentNode,
				thisClass = $(this).attr('class'),
				id;

			arrowsetTmp.id = parseInt(parentNode.id.substr(parentNode.id.indexOf('_') + 1), 10);

			arrowsetTmp.data = self.arrowList[arrowsetTmp.id];

			arrowTarget = arrowsetTmp.data.target;

			if (thisClass.indexOf(' ') === -1) {

				id = parseInt(thisClass, 10);

			} else {

				id = parseInt(thisClass.substr(0, thisClass.indexOf(' ')), 10);

			}

			arrowTmp = arrowsetTmp.data.data[id];
			arrowTmp.el = this;
			arrowTmp.$el = $(this);
			arrowTmp.id = id;

		}

		DEVMODE && console.log('archerTarget :: touchstart on arrow ', arrowTmp);

		if (!e.originalEvent && arguments[1]) {
			e.originalEvent = arguments[1].originalEvent;
		}


		touch = e.originalEvent.touches[0];

		curPageX = touch.pageX - offsetLeft || self.convertTo.pxX(arrowTmp.x, arrowTarget);
		curPageY = touch.pageY - offsetTop || self.convertTo.pxY(arrowTmp.y, arrowTarget);


		self.arrowMoving = true;


		if (arrowsetTmp.data.draggable) {

			self.setTargetStyle('arrow', { active: arrowTarget });

			self.$container[0].style.cursor = 'move';

		}

		arrowTmp.el.setAttribute('fill', arrowsetTmp.data.style.selected.color);

		arrowTmp.$el
			.css({
				opacity: arrowsetTmp.data.style.selected.opacity
			})
			.trigger('arrowSelect.archerTarget', [arrowsetTmp.id, arrowTmp.id, self.arrowList]);


		if (arrowsetTmp.data.draggable instanceof Object && arrowsetTmp.data.draggable) {

			self.createArrowPointer({
				x: self.convertTo.pxX(arrowTmp.x, arrowTarget),
				y: self.convertTo.pxY(arrowTmp.y, arrowTarget),
				drag: arrowsetTmp.data.draggable,
				color: arrowsetTmp.data.style.selected.color,
				arrowRadius: arrowsetTmp.data.radius
			});

			pointerHeight = arrowsetTmp.data.draggable.height + arrowsetTmp.data.radius;


		} else {

			pointerHeight = 0;

		}


		if (e.originalEvent.touches.length === 1 && arrowsetTmp.data.draggable) {

			window.cancelAnimationFrame(move);
			/*
			 * request a new animation frame
			 */
			window.requestAnimationFrame(move);

		}

		return false;

	};

	onTouchEnd = function () {

		if (!self.arrowMoving) {
			return false;
		}

		DEVMODE && console.log('archerTarget :: touchend on arrow ', arrowTmp);


		self.arrowMoving = false;


		self.setTargetStyle('initial');

		arrowTmp.el.setAttribute('fill', arrowsetTmp.data.style.hover.color);


		if (arrowsetTmp.data.draggable instanceof Object) {

			self.removeArrowPointer();

			arrowTmp.el.setPosition({
				x: self.convertTo.pxX(arrowTmp.x, arrowTarget),
				y: self.convertTo.pxY(arrowTmp.y, arrowTarget)
			});

		}

		self.$container[0].style.cursor = 'default';

		self.$container.trigger('arrowDeselect.archerTarget',
			[arrowsetTmp.id, arrowTmp.id, self.arrowList]);

		return false;

	};


	this.$container
		.on('touchmove', onTouchMove)
		.on('touchend', onTouchEnd)
		.find('.arrowSetCanvas')
			.on('touchstart', 'circle', onTouchStart);


};

ArcherTarget.prototype.bindContainerEvents =  function () {

	var self = this,
		hasMoved = false;

	if (this.draggable) {

		var oldPageX,
			oldPageY,
			curPageX,
			curPageY,
			mouseDown = false,
			svg = this.$container.find('svg')[0],
			move,
			onMouseMove,
			onMouseDown,
			onMouseUp;

		move = function () {

			if (!mouseDown) {
				return;
			}

			self.transX = (curPageX - oldPageX) / self.scale;
			self.transY = (curPageY - oldPageY) / self.scale;

			hasMoved = true;

			self.setTransform();

			window.requestAnimationFrame(move);

			self.$container.trigger('targetMove.archerTarget', []);


		};

		onMouseMove = function (e) {

			if (!mouseDown) {
				return;
			}

			curPageX = e.pageX;
			curPageY = e.pageY;

		};

		onMouseDown = function (e) {

			oldPageX = e.pageX - self.transX * self.scale;
			oldPageY = e.pageY - self.transY * self.scale;
			curPageX = e.pageX;
			curPageY = e.pageY;

			mouseDown = true;
			hasMoved  = false;

			svg.style.cursor = 'move';

			window.cancelAnimationFrame(move);
			/*
			 * request a new animation frame
			 */
			window.requestAnimationFrame(move);

		};

		onMouseUp = function () {

			mouseDown = hasMoved = false;

			svg.style.cursor = 'default';

		};


		this.$container
			.on('mousemove', 'svg', onMouseMove)
			.on('mousedown', 'svg', onMouseDown)
			.on('mouseup', onMouseUp);

	}

	this.$container.on('mousedown click', function (e) {

		if (!hasMoved && !$(e.target).hasClass('archerTarget-zoomin') &&
			!$(e.target).hasClass('archerTarget-zoomout')) {

			var x = e.pageX - $(this).offset().left,
				y = e.pageY - $(this).offset().top,
				tapTarget = self.checkClosestTarget(0, {
					x: x,
					y: y
				}),
				eventObject = [
					/*
					 * Container/Canvas coordinates in percent
					 */
					{
						x: x / self.width * 100,
						y: y / self.height * 100,
						xPx: x,
						yPx: y
					},
					/*
					 * Target coordinates + clicked target
					 */
					{
						x: self.convertTo.pcX(x, tapTarget),
						y: self.convertTo.pcY(y, tapTarget),
						target: tapTarget
					}
				];


			if (e.type === 'mousedown') {

				self.$container.trigger('containerMousedown.archerTarget', eventObject);

			} else {

				self.$container.trigger('containerTap.archerTarget', eventObject);

			}

		}

	});



};

ArcherTarget.prototype.bindContainerTouchEvents =  function () {

	var self = this,
		hasMoved = false,
		touch;

	if (this.options.draggable) {

		var oldPageX,
			oldPageY,
			curPageX,
			curPageY,
			mouseDown = false,
			svg = this.$container.find('svg')[0],
			move,
			onTouchMove,
			onTouchStart,
			onTouchEnd;


		move = function () {

			if (!mouseDown) {
				return;
			}

			self.transX = (curPageX - oldPageX) / self.scale;
			self.transY = (curPageY - oldPageY) / self.scale;

			hasMoved = true;

			self.setTransform();

			window.requestAnimationFrame(move);

			self.$container.trigger('targetMove.archerTarget', []);

		};

		onTouchMove = function (e) {

			if (!mouseDown) {
				return;
			}

			touch = e.originalEvent.touches[0];

			curPageX = touch.pageX;
			curPageY = touch.pageY;

		};

		onTouchStart = function (e) {

			touch = e.originalEvent.touches[0];

			oldPageX = touch.pageX - self.transX * self.scale;
			oldPageY = touch.pageY - self.transY * self.scale;
			curPageX = touch.pageX;
			curPageY = touch.pageY;

			mouseDown = true;
			hasMoved  = false;

			svg.style.cursor = 'move';

			window.cancelAnimationFrame(move);
			/*
			 * request a new animation frame
			 */
			window.requestAnimationFrame(move);

		};

		onTouchEnd = function () {

			mouseDown = hasMoved = false;

			svg.style.cursor = 'default';

		};


		this.$container
			.on('touchmove', 'svg, .targetCanvas', onTouchMove)
			.on('touchstart', 'svg, .targetCanvas', onTouchStart)
			.on('touchend', 'svg, .targetCanvas', onTouchEnd);

	}

	this.$container.on('touchstart touchend', function (e) {

		if (!hasMoved && !$(e.target).hasClass('archerTarget-zoomin') &&
			!$(e.target).hasClass('archerTarget-zoomout')) {

			var x,
				y,
				tapTarget,
				eventObject,
				offsetLeft = $(this).offset().left,
				offsetTop = $(this).offset().top;

			if (e.type === 'touchstart') {

				touch = event.touches[0];

				x = touch.pageX - offsetLeft;
				y = touch.pageY - offsetTop;

			} else {

				touch = event.changedTouches[0];

				x = touch.pageX - offsetLeft;
				y = touch.pageY - offsetTop;

			}

			tapTarget = self.checkClosestTarget(0, {
				x: x,
				y: y
			});

			eventObject = [
				/*
				 * Container/Canvas coordinates in percent
				 */
				{
					x: x / self.width * 100,
					y: y / self.height * 100,
					xPx: x,
					yPx: y
				},
				/*
				 * Target coordinates + clicked target
				 */
				{
					x: self.convertTo.pcX(x, tapTarget),
					y: self.convertTo.pcY(y, tapTarget),
					target: tapTarget
				},
				e
			];

			if (e.type === 'touchstart') {

				self.$container.trigger('containerMousedown.archerTarget', eventObject);

			} else {

				self.$container.trigger('containerTap.archerTarget', eventObject);

			}

		}

	});



};

ArcherTarget.prototype.bindTargetEvents = function () {

	var self = this;

	$(self.targetList).each(function (index, domEle) {

		domEle.$el.parent().on('mouseenter', function () {

			if (self.arrowMoving) {
				return false;
			}

			domEle.$el.css({

				opacity: domEle.style.hover.opacity

			}).trigger('targetOver.archerTarget', [index]);

			return false;

		}).on('mouseleave', function () {

			if (self.arrowMoving) {
				return false;
			}

			domEle.$el.css({

				opacity: domEle.style.initial.opacity

			}).trigger('targetOut.archerTarget', [index]);

			return false;

		}).on('click', function () {

			domEle.$el.trigger('targetClick.archerTarget', [index]);

		});

	});

};

ArcherTarget.prototype.bindTargetTouchEvents = function () {

	var self = this;

	$(this.target).each(function (index, domEle) {

		domEle.$el.on('mouseover', function () {

			if (self.arrowMoving) {
				return false;
			}

			domEle.$el.css({

				opacity: domEle.style.hover.opacity

			}).trigger('targetOver.archerTarget', [index]);

			return false;

		}).on('mouseout', function () {

			if (self.arrowMoving) {
				return false;
			}

			domEle.$el.css({

				opacity: domEle.style.initial.opacity

			}).trigger('targetOut.archerTarget', [index]);

			return false;

		}).on('click', function () {

			domEle.$el.trigger('targetClick.archerTarget', [index]);

		});

	});

};

ArcherTarget.prototype.bindZoomEvents = function () {

	var self = this,
		newZoom = 0;

	this.$container.on('click', '.archerTarget-zoomin', function () {

		if (self.scale <= self.maxScale) {
			newZoom = self.scale + self.scaleStep;
		}

		self.setZoom(newZoom);

	}).on('click', '.archerTarget-zoomout', function () {

		if (self.scale >= self.minScale + self.scaleStep) {
			newZoom = self.scale - self.scaleStep;
		}

		self.setZoom(newZoom);

	});

};

ArcherTarget.prototype.calculateRing =  function (config) {

	var self = this,
		i,
		target = self.targetList[config.target],
		currentTarget = ArcherTarget.Targets[target.name],
		distanceToCenter = {
			x: 0,
			y: 0,
			diagonal: 0
		},
		targetTmp = {
			x: (self.convertTo.canvasX(target.center[0]) + self.transX) * self.scale,
			y: (self.convertTo.canvasY(target.center[1]) + self.transY) * self.scale,
			radius: self.convertTo.canvasX(target.diameter) / 2 * self.scale,
			numberRings: currentTarget.numberRings
		},
		diameter;


	distanceToCenter.x =
		(config.x >= targetTmp.x) ?
		targetTmp.x - config.x :
		config.x - targetTmp.x;

	distanceToCenter.y =
		(config.y >= targetTmp.y) ?
		config.y - targetTmp.y :
		targetTmp.y - config.y;

	distanceToCenter.diagonal =
		(distanceToCenter.x === 0 && distanceToCenter.y === 0) ?
		0 :
		Math.sqrt(Math.pow(distanceToCenter.x, 2) + Math.pow(distanceToCenter.y, 2));


	if (distanceToCenter.diagonal > targetTmp.radius + 1) {
		return 0;
	}

	for (i = targetTmp.numberRings - 1; i >= 0; i--) {

		diameter = self.convertTo.canvasX(currentTarget.diameters[i], target.diameter) /
					2 * self.scale + 1;

		if (distanceToCenter.diagonal <= diameter) {

			return currentTarget.rating[i];

		}
	}

};

ArcherTarget.prototype.checkClosestTarget = function (currentTarget, config) {

	var self = this,
		i,
		curCenterX,
		curCenterY,
		curRadius,
		convert = self.convertTo,
		targetLength = self.targetList.length,
		target;

	for (i = 0; i < targetLength; i++) {

		target = self.targetList[i];

		curCenterX = (convert.canvasX(target.center[0]) + self.transX) * self.scale;
		curCenterY = (convert.canvasY(target.center[1]) + self.transY) * self.scale;
		curRadius  = convert.canvasX(target.diameter) / 2  * self.scale;

		if (config.x > curCenterX - curRadius &&
			config.x < curCenterX + curRadius &&
			config.y > curCenterY - curRadius &&
			config.y < curCenterY + curRadius
			) {
			return i;
		}
	}

	return currentTarget;

};

/**
 * Checks if the arrow is on the target.
 * @param  {Object} arrow
 * @param  {Object} arrow.x          Position on the x axe.
 * @param  {Object} arrow.y          Position on the y axe.
 * @param  {Object} config
 * @param  {Object} config.tolerance Tolerance in percent.
 * @return {Boolean}
 */
ArcherTarget.prototype.checkOnTarget = function (arrow, config) {

	/*
	 * Check if there is more than one target.
	 * If there's only one target, we'll return that the arrow is on the target.
	 */
	if (this.targetList.length <= 1) {

		return true;

	}

	var thisConfig = (!config || !config.tolerance) ? { tolerance: 5 } : config;

	/*
	 * Check if the arrow is on the target.
	 */
	if (arrow.x > 100 + thisConfig.tolerance ||
		arrow.y > 100 + thisConfig.tolerance ||
		arrow.x < -thisConfig.tolerance ||
		arrow.y < -thisConfig.tolerance
		) {

		return false;

	}

	return true;

};

/**
 * Creates the arrow pointer
 * @param  {Object} config
 * @param  {Object} config.x           Arrow position on the x axe in pixel
 * @param  {Object} config.y           Arrow position on the y axe in pixel
 * @param  {Object} config.color       Color of the pointer
 * @param  {Object} config.arrowRadius Radius of the arrow (not the pointer)
 * @param  {Object} config.drag        Config of the pointer
 * @param  {Object} config.drag.width  Width of the pointer
 * @param  {Object} config.drag.height Height of the pointer
 */
ArcherTarget.prototype.createArrowPointer = function (config) {

	var self = this;

	self.dragMark = {};

	self.dragMark.el = self.canvas.createGroup(false, { id: self.$containerId + 'ArrowDrag' });


	self.dragMark.rect = self.canvas.createRect({
		x: config.x - config.drag.width / 2,
		y: config.y - config.drag.height - config.arrowRadius,
		width: config.drag.width,
		height: config.drag.height,
		fill: config.color
	});

	self.dragMark.el.appendChild(self.dragMark.rect);

	self.dragMark.circle = self.canvas.createCircle({
		x: config.x,
		y: config.y - config.drag.height - config.arrowRadius,
		radius: config.drag.width,
		fill: config.color,
		stroke: false,
		eleClass: false
	});

	self.dragMark.el.appendChild(self.dragMark.circle);

	self.canvas.canvas.appendChild(self.dragMark.el);
};

ArcherTarget.prototype.createArrows =  function (arrows) {

	if (!arrows) { arrows = []; }

	var self = this,
		i, j,
		arrowClass,
		dragObjectDefaults = {
			height: 40,
			width: 5
		},
		arrowLength = arrows.length,
		arrow,
		dataLength,
		arrowData;


	self.arrowGroup = self.canvas.createGroup(
		false,
		{
			id: self.$containerId + 'ArrowGroup'
		}
	);

	self.canvas.canvas.appendChild(self.arrowGroup);


	for (i = 0; i < arrowLength; i++) {

		arrows[i] = arrow instanceof Array ? { data: arrows[i]} : arrows[i];

		arrows[i] = $.extend(true, {}, self.options.arrowDefaults, arrows[i]);


		arrow = arrows[i];


		if (arrow.draggable instanceof Object) {
			arrow.draggable = $.extend(true, {}, dragObjectDefaults, arrow.draggable);
		}


		arrow.el = self.canvas.createGroup(
			false,
			{
				id: self.$containerId + 'ArrowSet_' + i,
				eleClass: 'arrowSetCanvas'
			}
		);
		arrow.$el = $(arrow.el);


		dataLength = arrow.data.length;

		for (j = 0; j < dataLength; j++) {

			arrowData = arrow.data[j];

			if (!self.targetList[arrow.target]) {
				arrow.target = 0;
			}

			arrowData.target = arrowData.target || arrow.target;

			if (!self.targetList[arrowData.target]) {
				arrowData.target = 0;
			}

			if (typeof(arrowData.active) === 'undefined') {
				arrowData.active = arrow.active;
			}

			arrowClass = arrowData.active ? '' : ' hidden';

			arrowData.el = self.canvas.createCircle({
				x: self.convertTo.pxX(arrowData.x, arrowData.target),
				y: self.convertTo.pxY(arrowData.y, arrowData.target),
				radius: arrow.radius,
				fill: arrow.style.initial.color,
				stroke: arrow.style.initial.stroke,
				eleClass: j + arrowClass
			});
			arrowData.$el = $(arrowData.el);

			arrowData.$el.css({
				opacity: arrow.style.initial.opacity
			});

			arrow.$el.append(arrowData.el);

		}

		self.arrowGroup.appendChild(arrow.el);

	}

	DEVMODE && console.log('archerTarget :: created arrowset(s) ', arrows);

	return arrows;

};

ArcherTarget.prototype.createTarget = function (targets) {

	var self = this,
		i, j,
		target,
		targetDiameter;

	targets = targets || [];

	for (i = 0; i < targets.length; i++) {

		targets[i] = $.extend(true, {}, this.options.targetDefaults, targets[i]);

		target = targets[i];

		target.originalCenter = target.center;

		target.el = this.canvas.createGroup(
			false,
			{
				id: self.$containerId + 'Target_' + i,
				eleClass: 'targetCanvas'
			}
		);
		target.$el = $(target.el);

		target.rings = [];

		for (j = 0; j < ArcherTarget.Targets[target.name].numberRings; j++) {

			target.rings[j] = {};

			targetDiameter = ArcherTarget.Targets[target.name].diameters[j];

			target.rings[j].el = this.canvas.createCircle({
				x: this.convertTo.canvasX(target.center[0]),
				y: this.convertTo.canvasY(target.center[1]),
				radius:this.convertTo.canvasX(targetDiameter, target.diameter) / 2,
				fill: ArcherTarget.Targets[target.name].colors[j],
				stroke: ArcherTarget.Targets[target.name].strokeColors[j],
				eleClass: j
			});

			target.$el.append(target.rings[j].el);

		}

		this.targetGroup.appendChild(target.el);

		target.$el.css({
			opacity: target.style.initial.opacity
		});

	}

	DEVMODE && console.log('archerTarget :: created target(s) ', targets);

	return targets;

};

ArcherTarget.prototype.getArrows = function () {

	return this.arrowList;

};

ArcherTarget.prototype.getRing = function (arrow) {

	if (arrow) {

		return this.calculateRing({
			x: this.convertTo.pxX(arrow.x, arrow.target),
			y: this.convertTo.pxY(arrow.y, arrow.target),
			target: arrow.target
		});


	} else {

		var i, j,
			data;

		for (i = 0; i < this.arrow.length; i++) {

			for (j = 0; j < this.arrow[i].data.length; j++) {

				data = this.arrow[i].data[j];

				data.ring = this.calculateRing({
					x: this.convertTo.pxX(data.x, data.target),
					y: this.convertTo.pxY(data.y, data.target),
					target: data.target
				});

			}

		}

		return this.arrow;

	}

};

/**
 * Returns the target parameters (rings, colors, etc.)
 *
 * @param  {String} targetName Name of the target
 * @return {Object}            Object containing the parameters of the target
 */
ArcherTarget.prototype.getTargetParams = function (targetName) {

	return ArcherTarget.Targets[targetName];

};

/**
 * Returns a object containing the parameters of the SVG transform attribute
 * @return {Object} Transform object
 */
ArcherTarget.prototype.getTransform = function () {

	return {
		x: this.transX,
		y: this.transY,
		scale: this.scale
	};

};

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

ArcherTarget.prototype.initConverter = function ()  {

    var self = this,
        converterCacheCanvas = {
            x: {},
            y: {}
        };

    self.convertTo = {

        pcX: function (arg, targetID) {

            if (!targetID) { targetID = 0; }

            return (arg / self.scale - self.gap[targetID].left - self.transX) /
                self.convertTo.canvasX(self.targetList[targetID].diameter) * 100;

        },

        pcY: function (arg, targetID) {

            if (!targetID) { targetID = 0; }

            // Attention: converting the target diameter using the x-axe;
            // otherwise an error will occur
            return (arg / self.scale - self.gap[targetID].top - self.transY) /
                self.convertTo.canvasX(self.targetList[targetID].diameter) * 100;

        },

        pxX: function (arg, targetID) {

            if (!targetID) { targetID = 0; }

            return ((self.convertTo.canvasX(self.targetList[targetID].diameter) / 100) *
                arg + self.gap[targetID].left + self.transX) * self.scale;

        },

        pxY: function (arg, targetID) {

            if (!targetID) { targetID = 0; }

            // Attention: converting the target diameter using the x-axe;
            // otherwise an error will occur
            return ((self.convertTo.canvasX(self.targetList[targetID].diameter) / 100) *
                arg + self.gap[targetID].top + self.transY) * self.scale;

        },

        canvasX: function (arg, targetDiameter) {

            if (!targetDiameter) { targetDiameter = 100; }

            if (!converterCacheCanvas.x[targetDiameter]) {
                converterCacheCanvas.x[targetDiameter] = {};
            }

            var tmpCache = converterCacheCanvas.x[targetDiameter];

            if (!tmpCache[arg]) {

                tmpCache[arg] = self.width / 100 * targetDiameter / 100 * arg;

            }

            return tmpCache[arg];

        },

        canvasY: function (arg, targetDiameter) {

            if (!targetDiameter) { targetDiameter = 100; }


            if (!converterCacheCanvas.y[targetDiameter]) {
                converterCacheCanvas.y[targetDiameter] = {};
            }

            var tmpCache = converterCacheCanvas.y[targetDiameter];

            if (!tmpCache[arg]) {

                tmpCache[arg] = self.height / 100 * targetDiameter / 100 * arg;

            }

            return tmpCache[arg];

        }

    };

};

ArcherTarget.prototype.initPlugins = function () {

    var plugin;

    for (plugin in this.pluginList) {

        if (this.pluginList.hasOwnProperty(plugin) && ArcherTarget.Plugins[plugin]) {

            ArcherTarget.Plugins[plugin].initialize(this, this.pluginList[plugin]);

        }

    }
};

ArcherTarget.prototype.isTouch = function () {

	return (
		('ontouchstart' in window) ||
		(window.DocumentTouch && document instanceof DocumentTouch) ||
		this.options.touch === true
	);

};

ArcherTarget.prototype.mergeStyles = function () {

	var self = this,
		options = self.options,
		style;

    /*
     * Merge every style with the inital style
     */
    for (style in options.targetDefaults.style) {
        if (options.targetDefaults.style.hasOwnProperty(style)) {
            options.targetDefaults.style[style] = $.extend(
                {},
                options.targetDefaults.style.initial,
                options.targetDefaults.style[style]
            );
        }
    }
    /*
     * Merge every style with the inital style
     */
    for (style in options.arrowDefaults.style) {
        if (options.arrowDefaults.style.hasOwnProperty(style)) {
            options.arrowDefaults.style[style] = $.extend(
                {},
                options.arrowDefaults.style.initial,
                options.arrowDefaults.style[style]
            );
        }
    }

};

/**
 * Removes the arrow-pointer from the DOM
 */
ArcherTarget.prototype.removeArrowPointer = function () {

	this.canvas.canvas.removeChild(this.dragMark.el);

};

/**
 * Sets arrows or arrowsets active or inactive.
 *
 * @param {Object}  arrow
 * @param {Integer} arrow.arrowsetID ID of the arrowset
 * @param {Integer} [arrow.arrowID]  ID of the arrow.
 * @param {Boolean} [arrow.active]   Active state of the arrow(set).
 *                                   If not given, we'll use the options from the arrows.
 */
ArcherTarget.prototype.setArrowActive = function (arrow) {

	var self = this,
		i,
		/**
		 * Sets an arrow active or inactive
		 *
		 * @param {Integer} arrowSetID Id of the arrowset
		 * @param {Integer} arrowID    Id of the arrow
		 * @param {Boolean} active
		 */
		setArrow = function (arrowSetID, arrowID, active) {

			/*
			 * If no active state is given, we'll use the saved value.
			 */
			if (typeof (active) === 'undefined') {

				active = self.arrowList[arrowSetID].data[arrowID].active;

			} else {

				self.arrowList[arrowSetID].data[arrowID].active = active;

			}


			var domEle = self.arrowList[arrowSetID].data[arrowID].el,
				elClass = active ? '' : ' hidden';

			domEle.setAttribute('class', arrowID + elClass);

		},

		/**
		 * Sets all arrows of an arrowset active or inactive
		 *
		 * @param {Integer} arrowSetID Id of the arrowset
		 * @param {Boolean} active
		 */
		setArrowset = function (arrowSetID, active) {

			/*
			 * If no active state is given, we'll use the saved value.
			 */
			if (typeof (active) !== 'undefined') {

				self.arrowList[arrowSetID].active = active;

			}

			var len = self.arrowList[arrowSetID].data.length;
			for (i = 0; i < len; i++) {

				setArrow(arrowSetID, i, active);

			}

		};



	/*
	 * Check if the ID of an arrow is given.
	 */
	if (typeof (arrow.arrowID) !== 'undefined') {

		setArrow(arrow.arrowsetID, arrow.arrowID, arrow.active);

	/*
	 * Otherwise set all arrows of an end acitve/inactive
	 */
	} else {

		setArrowset(arrow.arrowsetID, arrow.active);

	}

};


/**
 * Merges the given options with the arrowset options (e.g. 'draggable', 'style').
 *
 * @param {Object}  arrowset
 * @param {Integer} arrowset.arrowsetID  ID of the arrowset
 * @param {Object}  [arrowset.options]   Options to merge
 */
ArcherTarget.prototype.setArrowOptions = function (arrowset) {

	var self = this,
		field,
		methodName;


	for (field in arrowset.options) {

		if (arrowset.options.hasOwnProperty(field)) {

			methodName = 'setArrow' + field.charAt(0).toUpperCase() + field.substr(1);

			if (arrowset.options[field] !== self.arrowList[arrowset.arrowsetID][field]) {

				/*
				 * TODO: Add more cases than just 'active'
				 */
				switch (field) {

					case 'active':

						self[methodName]({
							arrowsetID: arrowset.arrowsetID,
							active: arrowset.options[field]
						});

						break;

					default:

						break;

				}


			}

		}

	}

	$.extend(true, self.arrowList[arrowset.arrowsetID], arrowset.options);

};


ArcherTarget.prototype.setArrowPointer = function (config) {

	this.dragMark.rect.setPosition({
		x: config.x - config.drag.width / 2,
		y: config.y - config.drag.height - config.arrowRadius
	});

	this.dragMark.circle.setPosition({
		x: config.x,
		y: config.y - config.drag.height - config.arrowRadius
	});

};

/**
 * Sets the position of an arrow or arrows in an arrowset.
 * Position has to be saved in 'this.arrow[i].data[j]'.
 *
 * @param {Object} [arrow] Should be an object containing the ID's of arrows and arrowsets.
 *                         If arrow is no given, we'll set the position of all arrows and
 *                         arrowsets.
 * @param {Integer|Array} arrow.arrowsetID  ID of the arrowset or an array containing the
 *                                          ID's of the the arrowsets
 * @param {Integer|Array} [arrow.arrowID]   ID of the arrow. If given, the arrow.arrowsetID
 *                                          has to be an integer and not an array
 */
 ArcherTarget.prototype.setArrowPosition = function (arrow) {

	var i,
		j,
		self = this,
		toPxX = self.convertTo.pxX,
		toPxY = self.convertTo.pxY,
		defaultConfig = {},
		/**
		 * Sets the position of an arrow
		 * @param {[type]} arrowsetID Id of the arrowsets
		 * @param {[type]} arrowID    ID of the arrow
		 */
		setPosition = function (arrowsetID, arrowID) {

			var arrowData = self.arrowList[arrowsetID].data[arrowID];

			arrowData.el.setPosition({
				x: (toPxX(arrowData.x, arrowData.target)),
				y: (toPxY(arrowData.y, arrowData.target))
			});

		};



	if (typeof(arrow) === 'undefined') {

		DEVMODE > 8 && console.log('archerTarget :: setArrowPosition :: positioning all arrows');

		/*
		 * Set the position of all arrows
		 */
		for (i = 0; i < self.arrowList.length; i++) {

			for (j = 0; j < self.arrowList[i].data.length; j++) {

				setPosition(i, j);

			}
		}


	} else {

		/*
		 * Merge default and given config
		 */
		arrow = $.extend({}, defaultConfig, arrow);


		/*
		 * Check if arrow.arrowsetID is an array. If true we have to set the position of
		 * all arrows in the given arrowsets
		 */
		if (arrow.arrowsetID instanceof Array) {

			for (i = 0; i < arrow.arrowsetID.length; i++) {

				for (j = 0; j < self.arrowList[arrow.arrowsetID[i]].data.length; j++) {

					setPosition(arrow.arrowsetID[i], j);

				}
			}

		} else if (typeof(arrow.arrowID) !== 'undefined') {

			/*
			 * If arrow.arrowsetID is not an array we'll check if arrow.arrowID is an array.
			 * If true, we'll reset the position of all given arrows in the arrowset
			 */
			if (arrow.arrowID instanceof Array) {

				for (i = 0; i < arrow.arrowID.length; i++) {

					setPosition(arrow.arrowsetID, arrow.arrowID[i]);

				}

			} else {

				setPosition(arrow.arrowsetID, arrow.arrowID);

			}

		/*
		 * If no arrow id is given and arrow.arrowsetID is not an array, we only reset one arrowset
		 */
		} else {

			setPosition(arrow.arrowsetID, arrow.active);

			for (i = 0; i < self.arrowList[arrow.arrowsetID].data.length; i++) {

				setPosition(arrow.arrowsetID, i);

			}

		}
	}

};

/**
 * Sets the style of arrows or arrowsets
 *
 * @param {Object}        arrow
 * @param {Integer|Array} arrow.arrowsetID ID of the arrowset or an array containing
 *                                         the ID's of the the arrowsets
 * @param {Integer|Array} [arrow.arrowID] ID of the arrow. If given, the arrow.arrowsetID
 *                                        has to be an integer and not an array
 * @param {Object|Array} arrow.style Style of the arrow(s) or arrowset(s). Construction
 *                                   should look like defaultParams.style.initial.
 *                                   If arrow.style is an array, the order has to be
 *                                   the same as arrow.arrowsetID or arrow.arrowID.
 */
ArcherTarget.prototype.setArrowStyle = function (arrow) {

	var self = this,
		i,
		j,
		defaultConfig = {
			style: self.options.arrowDefaults.style.initial
		},
		/**
		 * Updates the style of an arrowset
		 *
		 * @param {Integer} arrowSetID Id of the arrowset
		 * @param {Boolean} style      Style for the arrowset
		 */
		setArrowset = function (arrowSetID, style) {

			var arrowObj;

			if (!style.radius) {
				style.radius = self.arrowList[arrowSetID].radius;
			}

			for (j = 0; j < self.arrowList[arrowSetID].data.length; j++) {

				arrowObj = self.arrowList[arrowSetID].data[j];

				arrowObj.el.setStyle({
					stroke: style.stroke,
					radius: style.radius,
					fill: style.color
				});

				arrowObj.$el.css({
					opacity: style.opacity
				});

			}

		},
		/**
		 * Updates the style of an arrows
		 *
		 * @param {Integer} arrowSetID  Id of the arrowset
		 * @param {Integer} arrowID     Id of the arrow
		 * @param {Boolean} style       Style for the arrow
		 */
		setArrow = function (arrowSetID, arrowID, style) {

			var arrowObj = self.arrowList[arrowSetID].data[arrowID];

			if (!style.radius) {
				style.radius = self.arrowList[arrowSetID].radius;
			}

			arrowObj.el.setStyle({
				stroke: style.stroke,
				radius: style.radius,
				fill: style.color
			});

			arrowObj.$el.css({
				opacity: style.opacity
			});

		};

	/*
	 * Merge default and given config
	 */
	arrow = $.extend({}, defaultConfig, arrow);

	/*
	 * Check if arrow.arrowsetID is an array. If true we have to set the style all arrowsets
	 * in the array.
	 */
	if (arrow.arrowsetID instanceof Array) {

		if (arrow.style instanceof Array) {

			for (i = 0; i < arrow.arrowsetID.length; i++) {

				setArrowset(arrow.arrowsetID[i], arrow.style[i]);

			}

		} else {

			for (i = 0; i < arrow.arrowsetID.length; i++) {

				setArrowset(arrow.arrowsetID[i], arrow.style);

			}

		}


	} else if (typeof(arrow.arrowID) !== 'undefined') {

		/*
		 * If arrow.arrowsetID is not an array we check if arrow.arrowID is an array.
		 * If true, we'll set the style each arrow of the arrowset.
		 */
		if (arrow.arrowID instanceof Array) {

			if (arrow.style instanceof Array) {

				for (i = 0; i < arrow.arrowID.length; i++) {

					setArrow(arrow.arrowsetID, arrow.arrowID[i], arrow.style[i]);

				}

			} else {

				for (i = 0; i < arrow.arrowID.length; i++) {

					setArrow(arrow.arrowsetID, arrow.arrowID[i], arrow.style);

				}

			}

		} else {

			setArrow(arrow.arrowsetID, arrow.arrowID, arrow.style);

		}

	/*
	 * If no arrow id is given and arrow.arrowsetID is not
	 * an array, we only set the style of one arrowset
	 */
	} else {

		setArrowset(arrow.arrowsetID, arrow.style);

	}

};


ArcherTarget.prototype.setBackgroundColor = function (color) {

	this.backgroundColor = color;

	this.$container.css({
		backgroundColor: color
	});

};

ArcherTarget.prototype.setGap = function () {

	var i,
		target;

	this.gap = [];

	for (i = 0; i < this.targetList.length; i++) {

		target = this.targetList[i];

		this.gap[i] = {

			// Attention: converting the target radius using the x-axe;
			// otherwise an error will occur
			top: this.convertTo.canvasY(target.center[1]) -
				this.convertTo.canvasX(target.diameter / 2),

			left: this.convertTo.canvasX(target.center[0] -
					(target.diameter / 2))
		};

	}
};


ArcherTarget.prototype.setSize = function () {

	this.width = this.$container.width();

	this.height = this.$container.height() || this.$container.width();

};

ArcherTarget.prototype.setTargetStyle = function (state, config) {

	var i,
		targets = this.targetList;

	switch (state) {

	case 'initial':

		for (i = 0; i < targets.length; i++) {

			targets[i].$el.css({ opacity: targets[i].style.initial.opacity });

		}

		break;


	case 'arrow':

		var arrowState;

		for (i = 0; i < targets.length; i++) {

			arrowState = (i === config.active) ? 'arrowOn' : 'arrowOff';

			targets[i].$el.css({ opacity: targets[i].style[arrowState].opacity });

		}

		break;

	}
};


ArcherTarget.prototype.setTransform = function (x, y, scale) {

	if (!x && x !== 0) { x = this.transX; } else { this.transX = x; }
	if (!y && y !== 0) { y = this.transY; } else { this.transY = y; }
	if (!scale) { scale = this.scale; } else { this.scale = scale; }

	this.canvas.applyTransformParams(scale, x, y);

	this.setArrowPosition();

};

ArcherTarget.prototype.setZoom = function (newZoom) {

	this.$container.trigger('zoom.archerTarget', [newZoom, this.scale]);

	this.scale = newZoom;

	this.setTransform();

	this.clearConverterCache();

};

/*
 * adopted from jVectorMap version 0.2.3
 * (https://github.com/bjornd/jvectormap | http://jvectormap.com/)
 *
 * Copyright 2011-2012, Kirill Lebedev
 * licensed under the terms of MIT license
 *
 * modified version
 */

var VectorCanvas = function (width, height) {

	this.mode = window.SVGAngle ? 'svg' : 'vml';

	if (this.mode === 'svg') {
		this.createSvgNode = function (nodeName) {
			return document.createElementNS(this.svgns, nodeName);
		};
	} else {
		try {
			if (!document.namespaces.rvml) {
				document.namespaces.add('rvml', 'urn:schemas-microsoft-com:vml');
			}
			this.createVmlNode = function (tagName) {
				return document.createElement('<rvml:' + tagName + ' class="rvml">');
			};
		} catch (e) {
			this.createVmlNode = function (tagName) {
				return document.createElement('<' + tagName +
					' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
			};
		}
		document.createStyleSheet().addRule('.rvml', 'behavior:url(#default#VML)');
	}

	if (this.mode === 'svg') {
		this.canvas = this.createSvgNode('svg');
	} else {
		this.canvas = this.createVmlNode('group');
		this.canvas.style.position = 'absolute';
	}

	this.setSize(width, height);
};

VectorCanvas.prototype = {
	svgns: 'http://www.w3.org/2000/svg',
	mode: 'svg',
	width: 0,
	height: 0,
	canvas: null,

	setSize: function (width, height) {
		var i, l,
			paths;

		if (this.mode === 'svg') {
			this.canvas.setAttribute('width', width);
			this.canvas.setAttribute('height', height);
		} else {
			this.canvas.style.width = width + 'px';
			this.canvas.style.height = height + 'px';
			this.canvas.coordsize = width + ' ' + height;
			this.canvas.coordorigin = '0 0';
			if (this.rootGroup) {
				paths = this.rootGroup.getElementsByTagName('shape');
				for (i = 0, l = paths.length; i < l; i++) {
					paths[i].coordsize = width + ' ' + height;
					paths[i].style.width = width + 'px';
					paths[i].style.height = height + 'px';
				}
				this.rootGroup.coordsize = width + ' ' + height;
				this.rootGroup.style.width = width + 'px';
				this.rootGroup.style.height = height + 'px';
			}
		}
		this.width = width;
		this.height = height;
	},

	createCircle: function (config) {

		var node;

		if (this.mode === 'svg') {

			node = this.createSvgNode('circle');
			node.setAttribute('cx', config.x);
			node.setAttribute('cy', config.y);
			node.setAttribute('r', config.radius);
			node.setAttribute('fill', config.fill);
			node.setAttribute('stroke', config.stroke);
			node.setAttribute('class', config.eleClass);
			node.setPosition = function (point) {
				node.setAttribute('cx', point.x);
				node.setAttribute('cy', point.y);
			};
			node.setStyle = function (style) {
				node.setAttribute('r', style.radius);
				node.setAttribute('fill', style.fill);
				node.setAttribute('stroke', style.stroke);
			};

		} else {

			node = this.createVmlNode('oval');
			node.style.width = config.radius * 2 + 'px';
			node.style.height = config.radius * 2 + 'px';
			node.style.left = config.x - config.radius + 'px';
			node.style.top = config.y - config.radius  + 'px';
			node.fillcolor = config.fill;
			node.classList.add(config.eleClass);
			node.stroke = true;
			node.strokecolor = config.stroke;
			node.setPosition = function (point) {
				node.style.left = point.x - config.radius + 'px';
				node.style.top = point.y - config.radius + 'px';
			};
			node.setStyle = function (style) {
				node.style.width = style.radius * 2 + 'px';
				node.style.height = style.radius * 2 + 'px';
				node.fillcolor = style.fill;
				node.stroke = true;
				node.strokecolor = style.stroke;
			};
		}

		return node;
	},

	createRect: function (config) {
		var node;
		if (this.mode === 'svg') {
			node = this.createSvgNode('rect');
			node.setAttribute('x', config.x);
			node.setAttribute('y', config.y);
			node.setAttribute('width', config.width);
			node.setAttribute('height', config.height);
			node.setAttribute('fill', config.fill);
			node.setPosition = function (point) {
				node.setAttribute('x', point.x);
				node.setAttribute('y', point.y);
			};
		} else {
			node = this.createVmlNode('rect');
			node.style.width = config.width + 'px';
			node.style.height = config.width + 'px';
			node.style.left = config.x + 'px';
			node.style.top = config.y + 'px';
			node.fillcolor = config.fill;
			node.setPosition = function (point) {
				node.style.left = point.x + 'px';
				node.style.top = point.y + 'px';
			};
		}
		return node;
	},

	createGroup: function (isRoot, config) {
		var node;
		config = config || {};
		if (this.mode === 'svg') {
			node = this.createSvgNode('g');
			if (config.id) { node.id = config.id; }
			if (config.eleClass) { node.setAttribute('class', config.eleClass); }
		} else {
			node = this.createVmlNode('group');
			node.style.width = this.width + 'px';
			node.style.height = this.height + 'px';
			node.style.left = '0px';
			node.style.top = '0px';
			node.coordorigin = '0 0';
			if (config.id) { node.id = config.id; }
			if (config.eleClass) { node.classList.add(config.eleClass); }
			node.coordsize = this.width + ' ' + this.height;
		}
		if (isRoot) {
			this.rootGroup = node;
		}

		return node;

	},

	applyTransformParams: function (scale, transX, transY) {
		if (this.mode === 'svg') {
			this.rootGroup.setAttribute(
				'transform', 'scale(' + scale + ') translate(' + transX + ', ' + transY + ')'
			);
		} else {
			this.rootGroup.coordorigin = (this.width - transX - this.width / 100) +
				',' + (this.height - transY - this.height / 100);
			this.rootGroup.coordsize = this.width / scale + ',' + this.height / scale;
		}
	}
};


}(window, document, (window.jQuery || window.Zepto)));
