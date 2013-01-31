/**
 * Removes the arrow-pointer from the DOM
 */
ArcherTarget.prototype.removeArrowPointer = function () {

	this.canvas.canvas.removeChild(this.dragMark.el);

};
