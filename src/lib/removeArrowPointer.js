/**
 * Removes the arrow-pointer from the DOM
 */
AT.prototype.removeArrowPointer = function () {

	this.canvas.canvas.removeChild(this.dragMark.el);

};
