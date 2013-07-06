AT.prototype.getSize = function () {

	var s = window.getComputedStyle(this.container, null);

	this.width = s.width;

	this.height = s.height || this.width;

	if (this.width.indexOf('px') >= 0) {
		var w = this.width;
		this.width = w.substr(0, w.length - 2);
	}

	if (this.height.indexOf('px') >= 0) {
		var h = this.height;
		this.height = h.substr(0, h.length - 2);
	}

	DEVMODE && console.log('ArcherTarget :: getSize :: width: ' +
		this.width + '; height: ' + this.height);

};
