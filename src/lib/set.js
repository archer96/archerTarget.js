ArcherTarget.prototype.set = AT.prototype.set = function (method) {

	var at = _ATinstance[this._id],

	methods = {
		arrowActive: function (arrow) {
			at.setArrowActive(arrow);
		},
		arrowOptions: function (arrowset) {
			at.setArrowOptions(arrowset);
		},
		arrowStyle: function (arrowset) {
			at.setArrowStyle(arrowset);
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
