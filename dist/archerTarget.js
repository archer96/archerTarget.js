/*!
 * archerTarget.js - v0.3.3 - 2013-07-30
 * https://github.com/archer96/archerTarget.js
 * Copyright (c) 2013 Andre Meyering;
 * Licensed MIT
 */
(function (window, document, undefined) {

'use strict';

if (typeof window.DEVMODE === 'undefined') {
	window.DEVMODE = 0;
}

var /**
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
		 * zoom in button
		 * @type {String}
		 */
		zoomInButton: '+',
		/**
		 * zoom out button
		 * @type {String}
		 */
		zoomOutButton: '&#x2212;',
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
		plugins: {},
		/**
		 * true, if using touch device. If don't given by user, archerTarget.js will check
		 * for touch support.
		 * @type {Boolean}
		 */
		isTouch: null
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
	},
	_ATinstance = {};


window.ArcherTarget = function (element, options) {

	if (typeof this === 'undefined') {
		throw new Error('"this" is undefined. use "new ArcherTarget(...)"' +
			'and NOT "ArcherTarget(...)"');
	}

	var self = this;

	if (!element.id) {
		element.id = ArcherTarget.GUID();
	}

	self._id = element.id;

	/*
	 * We have to unbind all event listeners if the element
	 * has already been used.
	 */
	if (_ATinstance[self._id]) {

		var newElement = element.cloneNode(true);
		element.parentNode.replaceChild(newElement, element);

		element = document.getElementById(self._id);
	}

	_ATinstance[self._id] = new AT(element, options);

	return self;

};

ArcherTarget.addTarget = function (name, options) {
	AT.Targets[name] = options;
	DEVMODE && console.log('archerTarget :: added target :: ' + name);
};

ArcherTarget.addPlugin = function (name, options) {
	AT.Plugins[name] = options;
	DEVMODE && console.log('archerTarget :: added plugin :: ' + name);
};

/**
 * @constructor
 */
var AT = function (element, options) {

	var self = this;

	self._name = pluginName;
	self._defaults = defaults;
	self._id = element.id;

	self.options = ArcherTarget.extend(true, {}, defaults, options);

	self.container = element;
	self.containerId = self._id;

	/*
	 * Bind every event with the given function
	 */
	for (var event in apiEvents) {
		if (apiEvents.hasOwnProperty(event) && options[event]) {
			element.addEventListener(apiEvents[event] + '.archerTarget', options[event], false);
		}
	}

	self.init();

};

AT.Targets = {};
AT.Plugins = {};

/**
 * GUID generator
 * Script from: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
 */
ArcherTarget.GUID = function () {

	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
		return v.toString(16);
	});

};

/**
 * Simple check for requestAnimationFrame and cancelAnimationFrame.
 */
function RAF() {

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

}

function addEventListenerList(list, event, fn) {
    for (var i = 0, len = list.length; i < len; i++) {
        list[i].addEventListener(event, fn, false);
    }
}

AT.prototype.bindArrowEvents =  function () {

	var self = this,
		arrowTmp = {},
		arrowsetTmp = {},
		arrowTarget,
		curPageX,
		curPageY,
		offsetLeft = ArcherTarget.offset(self.container).left,
		offsetTop = ArcherTarget.offset(self.container).top,
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

		ArcherTarget.fireEvent(arrowTmp.el, 'arrowMove.archerTarget',
			{arrowset: arrowsetTmp.id, arrow: arrowTmp.id, arrows: self.arrowList});

	};

	onMouseMove = function (e) {

		if (self.arrowMoving) {

			curPageX = e.pageX - offsetLeft;
			curPageY = e.pageY - offsetTop;

		}

		return false;

	};

	onMouseDown = function (e) {

		var element = e.target;

		if (!self.arrowMoving) {

			var parentNode = this.parentNode,
				thisClass = element.className.baseVal,
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

				self.container.style.cursor = 'move';

			}

			arrowTmp.el.setAttribute('fill', arrowsetTmp.data.style.selected.color);
			arrowTmp.el.style.opacity = arrowsetTmp.data.style.selected.opacity;

			ArcherTarget.fireEvent(arrowTmp.el, 'arrowSelect.archerTarget',
				{arrowset: arrowsetTmp.id, arrow: arrowTmp.id, arrows: self.arrowList});

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
			arrowTmp.el.style.opacity = arrowsetTmp.data.style.hover.opacity;

			ArcherTarget.fireEvent(arrowTmp.el, 'arrowOver.archerTarget',
				{arrowset: arrowsetTmp.id, arrow: arrowTmp.id, arrows: self.arrowList});

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

			self.container.style.cursor = 'default';

			ArcherTarget.fireEvent(self.container, 'arrowDeselect.archerTarget',
				{arrowset: arrowsetTmp.id, arrow: arrowTmp.id, arrows: self.arrowList});

		}

		return false;

	};

	onMouseOut = function () {

		if (!self.arrowMoving || !arrowsetTmp.data.draggable) {

			arrowTmp.el.setAttribute('fill', arrowsetTmp.data.style.initial.color);
			arrowTmp.el.style.opacity = arrowsetTmp.data.style.initial.opacity;

			ArcherTarget.fireEvent(arrowTmp.el, 'arrowOut.archerTarget',
				{arrowset: arrowsetTmp.id, arrow: arrowTmp.id, arrows: self.arrowList});

		}

		return false;

	};

	this.container.addEventListener('mousemove', onMouseMove);
	this.container.addEventListener('mouseup', onMouseUp);
	this.container.addEventListener('click', onMouseUp);

	var c = this.container.querySelectorAll('.arrowSetCanvas circle');
	addEventListenerList(c, 'mouseout', onMouseOut);
	addEventListenerList(c, 'mousedown', onMouseDown);
	addEventListenerList(c, 'mouseover', onMouseDown);

};

AT.prototype.bindArrowTouchEvents = function () {

	var self = this,
		arrowTmp = {},
		arrowsetTmp = {},
		arrowTarget,
		curPageX,
		curPageY,
		offsetLeft,
		offsetTop,
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

				self.setTargetStyle('arrow', {active: arrowTarget});

			}
		}


		/* Save temp data to arrow array */
		self.arrowList[arrowsetTmp.id] = arrowsetTmp.data;
		self.arrowList[arrowsetTmp.id].data[arrowTmp.id] = arrowTmp;

		window.requestAnimationFrame(move);

		ArcherTarget.fireEvent(arrowTmp.el, 'arrowMove.archerTarget',
			{arrowset: arrowsetTmp.id, arrow: arrowTmp.id, arrows: self.arrowList});

	};

	onTouchMove = function (e) {

		if (!self.arrowMoving) {
			return false;
		}

		touch = e.touches[0];

		curPageX = touch.pageX - offsetLeft;
		curPageY = touch.pageY - offsetTop;

		return false;

	};

	onTouchStart = function (e) {

		var element = e.target;

		if (!self.arrowMoving) {

			offsetLeft = ArcherTarget.offset(self.container).left;
			offsetTop = ArcherTarget.offset(self.container).top;

			var parentNode = element.parentNode,
				thisClass = element.className.baseVal,
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
			arrowTmp.el = element;
			arrowTmp.id = id;

		}

		DEVMODE && console.log('archerTarget :: touchstart on arrow ', arrowTmp);

		touch = e.touches[0];

		curPageX = touch.pageX - offsetLeft || self.convertTo.pxX(arrowTmp.x, arrowTarget);
		curPageY = touch.pageY - offsetTop || self.convertTo.pxY(arrowTmp.y, arrowTarget);


		self.arrowMoving = true;


		if (arrowsetTmp.data.draggable) {

			self.setTargetStyle('arrow', { active: arrowTarget });

			self.container.style.cursor = 'move';

		}

		arrowTmp.el.setAttribute('fill', arrowsetTmp.data.style.selected.color);
		arrowTmp.el.style.opacity = arrowsetTmp.data.style.selected.opacity;

		ArcherTarget.fireEvent(arrowTmp.el, 'arrowSelect.archerTarget',
			{arrowset: arrowsetTmp.id, arrow: arrowTmp.id, arrows: self.arrowList});

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


		if (e.touches.length === 1 && arrowsetTmp.data.draggable) {

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

		self.container.style.cursor = 'default';

		ArcherTarget.fireEvent(self.container, 'arrowDeselect.archerTarget',
			{arrowset: arrowsetTmp.id, arrow: arrowTmp.id, arrows: self.arrowList});

		return false;

	};

	self.container.addEventListener('touchmove', onTouchMove);
	self.container.addEventListener('touchend', onTouchEnd);

	addEventListenerList(self.container.querySelectorAll('.arrowSetCanvas circle'),
		'touchstart', onTouchStart);

};

AT.prototype.bindContainerEvents = function () {

	var self = this,
		hasMoved = false;

	if (this.options.draggable) {

		var oldPageX,
			oldPageY,
			curPageX,
			curPageY,
			mouseDown = false,
			svg = this.container.getElementsByTagName('svg')[0],
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

			ArcherTarget.fireEvent(self.container, 'targetMove.archerTarget');

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


		var s = this.container.querySelectorAll('svg .targetCanvas');
		addEventListenerList(s, 'mousemove', onMouseMove);
		addEventListenerList(s, 'mousedown', onMouseDown);
		addEventListenerList(s, 'mouseup', onMouseUp);

	}

	var touchFunction = function (e) {

		var className = typeof e.target.className.baseVal !== undefined ?
			e.target.className.baseVal : e.target.className,
			element = e.target;

		if (!hasMoved && className.match(/archerTarget-zoomin/g) === null &&
			className.match(/archerTarget-zoomout/g) === null) {

			var x = e.pageX - ArcherTarget.offset(self.container).left,
				y = e.pageY - ArcherTarget.offset(self.container).top,
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

				ArcherTarget.fireEvent(self.container, 'containerMousedown.archerTarget',
					{canvasCoords:eventObject[0], targetCoords:eventObject[1]});

			} else {

				ArcherTarget.fireEvent(self.container, 'containerTap.archerTarget',
					{canvasCoords:eventObject[0], targetCoords:eventObject[1]});

			}

		}

	};

	self.container.addEventListener('mousedown', touchFunction);
	self.container.addEventListener('click', touchFunction);


};

AT.prototype.bindContainerTouchEvents = function () {

	var self = this,
		hasMoved = false,
		touch;

	if (this.options.draggable) {

		var oldPageX,
			oldPageY,
			curPageX,
			curPageY,
			mouseDown = false,
			svg = this.container.getElementsByTagName('svg')[0],
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

			ArcherTarget.fireEvent(self.container, 'targetMove.archerTarget');

		};

		onTouchMove = function (e) {

			if (!mouseDown || self.arrowMoving) {
				return;
			}

			touch = e.touches[0];

			curPageX = touch.pageX;
			curPageY = touch.pageY;

		};

		onTouchStart = function (e) {

			if (self.arrowMoving) {
				return;
			}

			touch = e.touches[0];

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

			if (self.arrowMoving) {
				return;
			}

			mouseDown = hasMoved = false;

			svg.style.cursor = 'default';

		};

		var t = self.container.querySelectorAll('svg .targetCanvas');
		addEventListenerList(t, 'touchmove', onTouchMove);
		addEventListenerList(t, 'touchstart', onTouchStart);
		addEventListenerList(t, 'touchend', onTouchEnd);

	}

	var touchFunction = function (e) {

		if (self.arrowMoving) {
			return;
		}

		var className = typeof e.target.className.baseVal !== undefined ?
		e.target.className.baseVal : e.target.className,
			element = e.target;

		if (!hasMoved && className.match(/archerTarget-zoomin/g) === null &&
			className.match(/archerTarget-zoomout/g) === null) {

			var x,
				y,
				tapTarget,
				eventObject,
				offsetLeft = ArcherTarget.offset(self.container).left,
				offsetTop = ArcherTarget.offset(self.container).top;

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

				ArcherTarget.fireEvent(self.container, 'containerMousedown.archerTarget',
					{canvasCoords:eventObject[0], targetCoords:eventObject[1], touches: e.touches});

			} else {

				ArcherTarget.fireEvent(self.container, 'containerTap.archerTarget',
					{canvasCoords:eventObject[0], targetCoords:eventObject[1], touches: e.touches});

			}

		}

	};

	self.container.addEventListener('touchstart', touchFunction);
	self.container.addEventListener('touchend', touchFunction);

};

AT.prototype.bindTargetEvents = function () {

	var self = this;

	function bindTarget(index, domEle) {

		var p = domEle.el;

		// There's a problem with mouseover and mouseout.

		//p.addEventListener('mouseover', function () {

		//	if (self.arrowMoving) {
		//		return false;
		//	}

		//	domEle.el.style.opacity = domEle.style.hover.opacity;

		//	ArcherTarget.fireEvent(domEle.el, 'targetOver.archerTarget', {index: index});

		//	return false;

		//});

		//p.addEventListener('mouseout', function () {

		//	if (self.arrowMoving) {
		//		return false;
		//	}

		//	domEle.el.style.opacity = domEle.style.initial.opacity;

		//	ArcherTarget.fireEvent(domEle.el, 'targetOut.archerTarget', {index: index});

		//	return false;

		//});

		p.addEventListener('click', function () {

			ArcherTarget.fireEvent(domEle.el, 'targetClick.archerTarget', {index: index});

		});

	}

	for (var i = 0; i < self.targetList.length; i++) {
		bindTarget(i, self.targetList[i]);
	}

};

AT.prototype.bindTargetTouchEvents = function () {

	var self = this;

	function bindTarget(index, domEle) {

		domEle.el.parentNode.addEventListener('touchend', function () {

			ArcherTarget.fireEvent(domEle.el, 'targetClick.archerTarget', {index: index});

		});

	}

	for (var i = 0; i < self.targetList.length; i++) {
		bindTarget(i, self.targetList[i]);
	}

};

AT.prototype.bindZoomEvents = function () {

	var self = this,
		newZoom = 0,
		c = this.container;

	c.querySelector('.archerTarget-zoomin').addEventListener('click', function () {

		if (self.scale <= self.options.maxScale) {
			newZoom = self.scale + self.options.scaleStep;
		}

		self.setZoom(newZoom);

	});

	c.querySelector('.archerTarget-zoomout').addEventListener('click', function () {

		if (self.scale >= self.options.minScale + self.options.scaleStep) {
			newZoom = self.scale - self.options.scaleStep;
		}

		self.setZoom(newZoom);

	});

};

AT.prototype.calculateRing = function (config) {

	var self = this,
		i,
		target = self.targetList[config.target],
		currentTarget = AT.Targets[target.name],
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

AT.prototype.checkClosestTarget = function (currentTarget, config) {

	var self = this,
		i,
		curCenterX,
		curCenterY,
		curRadius,
		targetLength = self.targetList.length,
		target;

	for (i = 0; i < targetLength; i++) {

		target = self.targetList[i];

		curCenterX = (self.convertTo.canvasX(target.center[0]) + self.transX) * self.scale;
		curCenterY = (self.convertTo.canvasY(target.center[1]) + self.transY) * self.scale;
		curRadius  = self.convertTo.canvasX(target.diameter) / 2  * self.scale;

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
AT.prototype.checkOnTarget = function (arrow, config) {

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
AT.prototype.createArrowPointer = function (config) {

	var self = this;

	self.dragMark = {};

	self.dragMark.el = self.canvas.createGroup({ id: self.$containerId + 'ArrowDrag' });


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

AT.prototype.createArrows = function (arrows) {

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
		{
			id: self.containerId + 'ArrowGroup'
		}
	);

	for (i = 0; i < arrowLength; i++) {

		arrows[i] = arrow instanceof Array ? { data: arrows[i]} : arrows[i];

		arrows[i] = ArcherTarget.extend(true, {}, self.options.arrowDefaults, arrows[i]);

		arrow = arrows[i];

		if (arrow.draggable instanceof Object) {
			arrow.draggable = ArcherTarget.extend(true, {}, dragObjectDefaults, arrow.draggable);
		}

		arrow.el = self.canvas.createGroup(
			{
				id: self.containerId + 'ArrowSet_' + i,
				eleClass: 'arrowSetCanvas'
			}
		);

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

			arrowData.el.style.opacity = arrow.style.initial.opacity;

			arrow.el.appendChild(arrowData.el);

		}

		self.arrowGroup.appendChild(arrow.el);

	}

	self.canvas.canvas.appendChild(self.arrowGroup);

	DEVMODE && console.log('archerTarget :: created arrowset(s) ', arrows);

	return arrows;

};

AT.prototype.createTarget = function (targets) {

	var self = this,
		i, j,
		target,
		targetDiameter;

	targets = targets || [];


	for (i = 0; i < targets.length; i++) {

		targets[i] = ArcherTarget.extend(true, {}, this.options.targetDefaults, targets[i]);

		target = targets[i];

		target.originalCenter = target.center;

		target.el = this.canvas.createGroup(
			{
				id: self.containerId + 'Target_' + i,
				eleClass: 'targetCanvas'
			}
		);

		target.rings = [];

		for (j = 0; j < AT.Targets[target.name].numberRings; j++) {

			target.rings[j] = {};

			targetDiameter = AT.Targets[target.name].diameters[j];

			target.rings[j].el = this.canvas.createCircle({
				x: self.convertTo.canvasX(target.center[0]),
				y: self.convertTo.canvasY(target.center[1]),
				radius: self.convertTo.canvasX(targetDiameter, target.diameter) / 2,
				fill: AT.Targets[target.name].colors[j],
				stroke: AT.Targets[target.name].strokeColors[j],
				eleClass: j
			});

			target.el.appendChild(target.rings[j].el);

		}

		target.el.style.opacity = target.style.initial.opacity;
		this.targetGroup.appendChild(target.el);


	}

	DEVMODE && console.log('archerTarget :: created target(s) ', targets);

	return targets;

};

/**
 * Merges objects; originally from jQuery
 * This is a modified version of the code
 */
ArcherTarget.extend = function () {

	var src,
		copyIsArray,
		copy,
		name,
		options,
		clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if (typeof target !== 'object' && isFunction(target)) {
		target = {};
	}

	if (length === i) {
		target = this;
		--i;
	}

	for (; i < length; i++) {
		// Only deal with non-null/undefined values
		if ((options = arguments[i]) !== null) {
			// Extend the base object
			for (name in options) {
				if (options.hasOwnProperty(name)) {
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {

						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];

						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = ArcherTarget.extend( deep, clone, copy );

					// Don't bring in undefined values
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;

};

ArcherTarget.fireEvent = function (target, name, params) {

	var evt = document.createEvent('Event');

	evt.initEvent(name, true, true); //true for can bubble, true for cancelable

	if (params) {
		for (var param in params) {
			if (params.hasOwnProperty(param)) {
				evt[param] = params[param];
			}
		}
	}

	target.dispatchEvent(evt);

};

ArcherTarget.prototype.get = AT.prototype.get = function (method) {

	var at = _ATinstance[this._id],
		methods;

	methods = {
		arrows: function () {
			return at.getArrows();
		}
	};

	if (method && methods[method]) {

		if (arguments[1]) {
			return methods[method].apply(null, Array.prototype.slice.call(arguments, 1));
		}

		return methods[method]();

	} else {

		DEVMODE && console.error('ArcherTarget :: get method "' + method + '"" not found!');

	}

};

AT.prototype.getArrows = function () {

	return this.arrowList;

};

AT.prototype.getRing = function (arrow) {

	var self = this;

	if (arrow) {

		return self.calculateRing({
			x: self.convertTo.pxX(arrow.x, arrow.target),
			y: self.convertTo.pxY(arrow.y, arrow.target),
			target: arrow.target
		});


	} else {

		var i, j,
			data;

		for (i = 0; i < this.arrow.length; i++) {

			for (j = 0; j < this.arrow[i].data.length; j++) {

				data = this.arrow[i].data[j];

				data.ring = self.calculateRing({
					x: self.convertTo.pxX(data.x, data.target),
					y: self.convertTo.pxY(data.y, data.target),
					target: data.target
				});

			}

		}

		return this.arrow;

	}

};

AT.prototype.getSize = function () {

	var s = window.getComputedStyle(this.container, null);

	this.width = s.width;

	this.height = s.height || this.width;

	if (this.width.indexOf('px') >= 0) {
		var w = this.width;
		this.width = w.substr(0, w.length - 2);
	}

	if (this.height.indexOf('px') >= 0) {
		var h = this.height;
		this.height = h.substr(0, h.length - 2);
	}

	DEVMODE && console.log('ArcherTarget :: getSize :: width: ' +
		this.width + '; height: ' + this.height);

};

/**
 * Returns the target parameters (rings, colors, etc.)
 *
 * @param  {String} targetName Name of the target
 * @return {Object}            Object containing the parameters of the target
 */
function getTargetParams(targetName) {

	return AT.Targets[targetName];

}

/**
 * Returns a object containing the parameters of the SVG transform attribute
 * @return {Object} Transform object
 */
AT.prototype.getTransform = function () {

	return {
		x: this.transX,
		y: this.transY,
		scale: this.scale
	};

};

AT.prototype.init = function () {

	var self = this;

	DEVMODE && console.log('archerTarget :: initializing archerTarget :: init');

	/*
	 * Add class 'archerTargetContainer' to the container and give it some style.
	 */
	self.container.className += 'archerTargetContainer';
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
		{ id: self.containerId + 'TargetGroup' },
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

	/*
	 * Depending on the device the user is using, bind all intern events.
	 */
	if (self.isTouch()) {

		DEVMODE && console.log('archerTarget :: using a touch device');

		self.bindContainerTouchEvents();
		self.bindArrowTouchEvents();
		self.bindTargetTouchEvents();

	} else {

		DEVMODE && console.log('archerTarget :: using a non-touch device');

		self.bindContainerEvents();
		self.bindArrowEvents();
		self.bindTargetEvents();

	}

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

AT.prototype.initConverter = function ()  {

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

AT.prototype.initPlugins = function () {

    var plugin;

    for (plugin in this.pluginList) {

        if (this.pluginList.hasOwnProperty(plugin) && AT.Plugins[plugin]) {

            AT.Plugins[plugin].initialize(this, this.pluginList[plugin]);

        }

    }
};

AT.prototype.isTouch = function () {

	var self = this;

	if (self.options.isTouch !== null) {
		return self.options.isTouch;
	}

	return (
		('ontouchstart' in window) ||
		(window.DocumentTouch && document instanceof DocumentTouch) || false
	);

};

// http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-
// if-a-javascript-object-is-a-dom-object

// Returns true if it is a DOM node
function isNode(o) {
	return (
		typeof Node === 'object' ? o instanceof Node :
		o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName==='string'
	);
}

// Returns true if it is a DOM element
function isElement(o) {
	return (
		typeof HTMLElement === 'object' ? o instanceof HTMLElement : //DOM2
		o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName==='string'
	);
}



function isFunction(functionToCheck) {
	return functionToCheck &&
		Object.prototype.toString.call(functionToCheck) === '[object Function]';
}
function isArray(arrayToCheck) {
	return arrayToCheck && Object.prototype.toString.call(arrayToCheck) === '[object Array]';
}
function isObject(objectToCheck) {
	return objectToCheck && Object.prototype.toString.call(objectToCheck) === '[object Object]';
}
function isPlainObject(objectToCheck) {
	return !(objectToCheck instanceof Array) && (typeof objectToCheck !== 'number') &&
		(typeof objectToCheck !== 'string') && (typeof objectToCheck !== 'boolean') &&
		!isNode(objectToCheck) && !isElement(objectToCheck);
}

AT.prototype.mergeStyles = function () {

	var self = this,
		options = this.options,
		style;

    /*
     * Merge every style with the inital style
     */
    for (style in options.targetDefaults.style) {
        if (options.targetDefaults.style.hasOwnProperty(style)) {
            self.options.targetDefaults.style[style] = ArcherTarget.extend(
                true,
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
            self.options.arrowDefaults.style[style] = ArcherTarget.extend(
                true,
                {},
                options.arrowDefaults.style.initial,
                options.arrowDefaults.style[style]
            );
        }
    }

};

/*
 * Get offset of an element. This is from Zepto.js (modified)
 */
ArcherTarget.offset = function(element){

	if (element.length === 0) {
		return null;
	}

	var obj = element.getBoundingClientRect();

	return {
		left: obj.left + window.pageXOffset,
		top: obj.top + window.pageYOffset,
		width: Math.round(obj.width),
		height: Math.round(obj.height)
	};

};

/**
 * Removes the arrow-pointer from the DOM
 */
AT.prototype.removeArrowPointer = function () {

	this.canvas.canvas.removeChild(this.dragMark.el);

};

ArcherTarget.prototype.set = AT.prototype.set = function (method) {

	var at = _ATinstance[this._id],

	methods = {
		arrowActive: function (arrow) {
			at.setArrowActive(arrow);
		},
		arrowOptions: function (arrowset) {
			at.setArrowOptions(arrowset);
		},
		transform: function (x, y, scale) {
			at.setTransform(x, y, scale);
		}
	};

	if (method && methods[method]) {

		if (arguments[1]) {
			return methods[method].apply(null, Array.prototype.slice.call(arguments, 1));
		}

		return methods[method]();

	} else {

		DEVMODE && console.error('ArcherTarget :: set method "' + method + '"" not found!');

	}

};

/**
 * Set arrows or arrowsets active or inactive.
 *
 * @param {Object}  arrow
 * @param {Integer} arrow.arrowsetID ID of the arrowset
 * @param {Integer} [arrow.arrowID]  ID of the arrow.
 * @param {Boolean} [arrow.active]   Active state of the arrow(set).
 *                                   If not given, we'll use the options from the arrows.
 */
AT.prototype.setArrowActive = function (arrow) {

	var self = this,
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

			var i;

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
AT.prototype.setArrowOptions = function (arrowset) {

	var self = this,
		field,
		methodName,
		options;

	options = {
		active: function (method) {
			self[method]({
				arrowsetID: arrowset.arrowsetID,
				active: arrowset.options.active
			});
		}
	};


	for (field in arrowset.options) {

		if (arrowset.options.hasOwnProperty(field)) {

			methodName = 'setArrow' + field.charAt(0).toUpperCase() + field.substr(1);

			if (arrowset.options[field] !== self.arrowList[arrowset.arrowsetID][field] &&
				options[field]) {

				options[field](methodName);

			}

		}

	}

	ArcherTarget.extend(true, self.arrowList[arrowset.arrowsetID], arrowset.options);

};

AT.prototype.setArrowPointer = function (config) {

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
AT.prototype.setArrowPosition = function (arrow) {

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

		DEVMODE && console.log('archerTarget :: setArrowPosition :: positioning all arrows');

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
		arrow = ArcherTarget.extend(true, {}, defaultConfig, arrow);


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
 * @param {Integer|Array} [arrow.arrowID]  ID of the arrow. If given, the arrow.arrowsetID
 *                                         has to be an integer and not an array
 * @param {Object|Array}  arrow.style      Style of the arrow(s) or arrowset(s). Construction
 *                                         should look like defaultParams.style.initial.
 *                                         If arrow.style is an array, the order has to be
 *                                         the same as arrow.arrowsetID or arrow.arrowID.
 */
AT.prototype.setArrowStyle = function (arrow) {

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

				arrowObj.el.opacity = style.opacity;

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

			arrowObj.el.opacity = style.opacity;

		};

	/*
	 * Merge default and given config
	 */
	arrow = ArcherTarget.extend(true, {}, defaultConfig, arrow);

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

AT.prototype.setBackgroundColor = function (color) {

	this.backgroundColor = this.container.style.backgroundColor = color;

	DEVMODE && console.log('ArcherTarget :: new backgroundcolor :: ' + color);

};

AT.prototype.setGap = function () {

	var self = this,
		i,
		target;

	self.gap = [];

	for (i = 0; i < self.targetList.length; i++) {

		target = self.targetList[i];

		self.gap[i] = {
			// Attention: converting the target radius using the x-axe;
			// otherwise an error will occur
			top: self.convertTo.canvasY(target.center[1]) -
				self.convertTo.canvasX(target.diameter / 2),

			left: self.convertTo.canvasX(target.center[0] -
					(target.diameter / 2))
		};

	}
};

AT.prototype.setTargetStyle = function (state, config) {

	var i,
		targets = this.targetList,
		states;

	states = {
		initial: function () {
			for (i = 0; i < targets.length; i++) {

				targets[i].el.style.opacity = targets[i].style.initial.opacity;

			}
		},
		arrow: function () {
			var arrowState;

			for (i = 0; i < targets.length; i++) {

				arrowState = (i === config.active) ? 'arrowOn' : 'arrowOff';

				targets[i].el.style.opacity = targets[i].style[arrowState].opacity;

			}
		}
	};

	if (states[state]) {
		states[state]();
	}

};

AT.prototype.setTransform = function (x, y, scale) {

	if (!x && x !== 0) { x = this.transX; } else { this.transX = x; }
	if (!y && y !== 0) { y = this.transY; } else { this.transY = y; }
	if (!scale) { scale = this.scale; } else { this.scale = scale; }

	this.canvas.applyTransformParams(scale, x, y);

	this.setArrowPosition();

};

AT.prototype.setZoom = function (newScale) {

	ArcherTarget.fireEvent(this.container, 'zoom.archerTarget',
		{newScale:newScale, oldScale: this.scale});

	this.scale = newScale;

	this.setTransform();

};

var VectorCanvas = function (width, height) {

	if (!window.SVGAngle) {
		alert('No SVG supported!');
	}

	this.createSvgNode = function (nodeName) {
		return document.createElementNS('http://www.w3.org/2000/svg', nodeName);
	};

	this.canvas = this.createSvgNode('svg');

	this.setSize(width, height);

};

VectorCanvas.prototype = {

	width: 0,
	height: 0,
	canvas: null,

	setSize: function (width, height) {

		this.canvas.setAttribute('width', width);
		this.canvas.setAttribute('height', height);

		this.width = width;
		this.height = height;

	},

	createCircle: function (config) {

		var node = this.createSvgNode('circle');

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

		return node;
	},

	createRect: function (config) {

		var node = this.createSvgNode('rect');
		node.setAttribute('x', config.x);
		node.setAttribute('y', config.y);
		node.setAttribute('width', config.width);
		node.setAttribute('height', config.height);
		node.setAttribute('fill', config.fill);
		node.setPosition = function (point) {
			node.setAttribute('x', point.x);
			node.setAttribute('y', point.y);
		};

		return node;

	},

	createGroup: function (groupConfig, isRoot) {

		var config = groupConfig || {},
			node = this.createSvgNode('g');

		if (config.id) {
			node.id = config.id;
		}

		if (config.eleClass) {
			node.setAttribute('class', config.eleClass);
		}

		if (isRoot) {
			this.rootGroup = node;
		}

		return node;

	},

	applyTransformParams: function (scale, transX, transY) {

		this.rootGroup.setAttribute(
			'transform', 'scale(' + scale + ') translate(' + transX + ', ' + transY + ')'
		);

	}
};


}(window, document));
