/**
 * Creates the arrow pointer
 * @param  {Object} config
 * @param  {Object} config.x           Arrow position on the x axe in pixel
 * @param  {Object} config.y           Arrow position on the y axe in pixel
 * @param  {Object} config.color       Color of the pointer
 * @param  {Object} config.arrowRadius Radius of the arrow (not the pointer)
 * @param  {Object} config.drag        Config of the pointer
 * @param  {Object} config.drag.width  Width of the pointer
 * @param  {Object} config.drag.height Height of the pointer
 */
ArcherTarget.prototype.createArrowPointer = function (config) {

	var self = this;

	self.dragMark = {};

	self.dragMark.el = self.canvas.createGroup(false, { id: self.$containerId + 'ArrowDrag' });


	self.dragMark.rect = self.canvas.createRect({
		x: config.x - config.drag.width / 2,
		y: config.y - config.drag.height - config.arrowRadius,
		width: config.drag.width,
		height: config.drag.height,
		fill: config.color
	});

	self.dragMark.el.appendChild(self.dragMark.rect);

	self.dragMark.circle = self.canvas.createCircle({
		x: config.x,
		y: config.y - config.drag.height - config.arrowRadius,
		radius: config.drag.width,
		fill: config.color,
		stroke: false,
		eleClass: false
	});

	self.dragMark.el.appendChild(self.dragMark.circle);

	self.canvas.canvas.appendChild(self.dragMark.el);
};
