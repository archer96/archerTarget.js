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
