ArcherTarget.prototype.setTransform = function (x, y, scale) {

	if (!x && x !== 0) { x = this.transX; } else { this.transX = x; }
	if (!y && y !== 0) { y = this.transY; } else { this.transY = y; }
	if (!scale) { scale = this.scale; } else { this.scale = scale; }

	this.canvas.applyTransformParams(scale, x, y);

	this.setArrowPosition();

};
