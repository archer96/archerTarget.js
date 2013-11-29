AT.prototype.bindZoomEvents = function () {

	var self = this,
		newZoom = 0,
		c = this.container;

	function eventHandlerZoomIn () {
		if (self.scale <= self.options.maxScale) {
			newZoom = self.scale + self.options.scaleStep;
		}
		self.setZoom(newZoom);
	}

	function eventHandlerZoomOut () {
		if (self.scale >= self.options.minScale + self.options.scaleStep) {
			newZoom = self.scale - self.options.scaleStep;
		}
		self.setZoom(newZoom);
	}

	c.querySelector('.archerTarget-zoomin').addEventListener('click', eventHandlerZoomIn);
	c.querySelector('.archerTarget-zoomout').addEventListener('click', eventHandlerZoomOut);

	self.eventListeners.push(function () {
		c.querySelector('.archerTarget-zoomin').removeEventListener('click', eventHandlerZoomIn);
		c.querySelector('.archerTarget-zoomout').removeEventListener('click', eventHandlerZoomOut);
	});

};
