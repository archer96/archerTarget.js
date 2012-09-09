/**
 * Removes the arrow-pointer from the DOM
 */
jat.Target.prototype.removeArrowPointer = function () {

    this.canvas.canvas.removeChild(this.dragMark.element);

};