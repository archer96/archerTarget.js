ArcherTarget.prototype.setArrowPointer = function (config) {

	this.dragMark.rect.setPosition({
		x: config.x - config.drag.width / 2,
		y: config.y - config.drag.height - config.arrowRadius
	});

	this.dragMark.circle.setPosition({
		x: config.x,
		y: config.y - config.drag.height - config.arrowRadius
	});

};
