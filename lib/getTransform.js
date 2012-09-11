/**
 * Returns a object containing the parameters of the SVG transform attribute
 * @return {Object} Transform object
 */
jat.Target.prototype.getTransform = function () {

	var transform = {
		x: this.transX,
		y: this.transY,
		scale: this.zoom
	}
	
	return transform;
};