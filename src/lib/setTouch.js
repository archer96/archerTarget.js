AT.prototype.setTouch = function () {

	var self = this;

	if (self.options.isTouch !== null) {
		return self.options.isTouch;
	}

	self.options.isTouch = ('ontouchstart' in window) ||
		(window.DocumentTouch && document instanceof DocumentTouch) ||
		false;

};
