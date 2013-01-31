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

