/*
 * Get offset of an element. This is from Zepto.js (modified)
 */
ArcherTarget.offset = function(element){

	if (element.length === 0) {
		return null;
	}

	var obj = element.getBoundingClientRect();

	return {
		left: obj.left + window.pageXOffset,
		top: obj.top + window.pageYOffset,
		width: Math.round(obj.width),
		height: Math.round(obj.height)
	};

};
