ArcherTarget.prototype.setZoom = function (newZoom) {

	this.$container.trigger('zoom.archerTarget', [newZoom, this.scale]);

	this.scale = newZoom;

	this.setTransform();

	this.clearConverterCache();

};
