/**
 * Short function for other get functions
 *
 * @param {String} method Method name of what to get
 */
ArcherTarget.prototype.get = AT.prototype.get = function (method) {

	var at = _ATinstance[this._id],
		methods = {
			arrows: function () {
				return at.getArrows();
			},
			targetParams: function (targetName) {
				return getTargetParams(targetName);
			},
			transform: function () {
				return at.getTransform();
			},
			ring: function (arrow) {
				return at.getRing(arrow);
			},
			pluginData: function (pluginName) {
				return at.getPluginData(pluginName);
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
/**
 * Returns the list of current arrows.
 *
 * @return {Array} Array of arrowsets
 */
AT.prototype.getArrows = function () {
	return this.arrowList;
};
/**
 * Calculates the ring of an arrow when `arrow` is given or
 * calculates the ring of all arrows.
 *
 * @param  {Object}        arrow Arrow object
 * @return {String|Object}       Ring of arrow or arrowset
 */
AT.prototype.getRing = function (arrow) {

	var self = this;

	if (arrow) {

		return self.calculateRing({
			x: self.convertTo.pxX(arrow.x, arrow.target),
			y: self.convertTo.pxY(arrow.y, arrow.target),
			target: arrow.target || 0
		});


	} else {

		var i, j,
			data;

		for (i = 0; i < self.arrowList.length; i++) {

			for (j = 0; j < self.arrowList[i].data.length; j++) {

				data = self.arrowList[i].data[j];

				data.ring = self.calculateRing({
					x: self.convertTo.pxX(data.x, data.target),
					y: self.convertTo.pxY(data.y, data.target),
					target: data.target
				});

			}

		}

		return self.arrowList;

	}

};
/**
 * Gets container width and height
 */
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
 * Returns an object containing the parameters of the SVG transform attribute
 *
 * @return {Object} Transform object
 */
AT.prototype.getTransform = function () {
	return {
		x: this.transX,
		y: this.transY,
		scale: this.scale
	};
};
/**
 * Returns the target parameters (rings, colors, etc.)
 *
 * @param  {String} targetName Name of the target
 * @return {Object}            Object containing the parameters of the target
 */
var getTargetParams = ArcherTarget.getTarget = function (targetName) {
	return AT.Targets[targetName] || {};
};

AT.prototype.getPluginData = function (pluginName) {

	return this.activePlugins[pluginName].getPluginData(this);

};
