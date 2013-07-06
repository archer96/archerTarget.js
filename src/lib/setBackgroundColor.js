AT.prototype.setBackgroundColor = function (color) {

	this.backgroundColor = this.container.style.backgroundColor = color;

	DEVMODE && console.log('ArcherTarget :: new backgroundcolor :: ' + color);

};
