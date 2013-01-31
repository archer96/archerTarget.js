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

