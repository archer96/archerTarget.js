/**
 * Returns a object containing the parameters of the SVG transform attribute
 * @return {Object} Transform object
 */
ArcherTarget.prototype.getTransform = function () {

	return {
		x: this.transX,
		y: this.transY,
		scale: this.scale
	};

};
