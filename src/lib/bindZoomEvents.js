ArcherTarget.prototype.bindZoomEvents = function () {

	var self = this,
		newZoom = 0;

	this.$container.on('click', '.archerTarget-zoomin', function () {

		if (self.scale <= self.maxScale) {
			newZoom = self.scale + self.scaleStep;
		}

		self.setZoom(newZoom);

	}).on('click', '.archerTarget-zoomout', function () {

		if (self.scale >= self.minScale + self.scaleStep) {
			newZoom = self.scale - self.scaleStep;
		}

		self.setZoom(newZoom);

	});

};
