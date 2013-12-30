AT.prototype.setScale = function (newScale) {

	ArcherTarget.fireEvent(this.container, 'zoom.archerTarget',
		{newScale:newScale, oldScale: this.scale});

	this.scale = newScale;

	this.setTransform();

};
