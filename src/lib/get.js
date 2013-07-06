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
