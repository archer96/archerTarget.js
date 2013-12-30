ArcherTarget.prototype.get = AT.prototype.get = function (method) {

	var at = _ATinstance[this._id],
		methods;

	methods = {
		arrows: function () {
			return at.getArrows();
		},
		targetParams: function (targetName) {
			return getTargetParams(targetName);
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

/**
 * Returns the target parameters (rings, colors, etc.)
 *
 * @param  {String} targetName Name of the target
 * @return {Object}            Object containing the parameters of the target
 */

var getTargetParams = ArcherTarget.getTarget = function (targetName) {

	return AT.Targets[targetName] || {};

};
