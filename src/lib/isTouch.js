ArcherTarget.prototype.isTouch = function () {

	return (
		('ontouchstart' in window) ||
		(window.DocumentTouch && document instanceof DocumentTouch) ||
		this.options.touch === true
	);

};
