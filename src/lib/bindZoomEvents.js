AT.prototype.bindZoomEvents = function () {

	var self = this,
		newZoom = 0,
		c = this.container;

	c.querySelector('.archerTarget-zoomin').addEventListener('click', function () {

		if (self.scale <= self.options.maxScale) {
			newZoom = self.scale + self.options.scaleStep;
		}

		self.setZoom(newZoom);

	});

	c.querySelector('.archerTarget-zoomout').addEventListener('click', function () {

		if (self.scale >= self.options.minScale + self.options.scaleStep) {
			newZoom = self.scale - self.options.scaleStep;
		}

		self.setZoom(newZoom);

	});

};
