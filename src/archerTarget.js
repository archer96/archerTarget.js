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
