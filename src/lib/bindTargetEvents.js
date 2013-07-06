AT.prototype.bindTargetEvents = function () {

	var self = this;

	function bindTarget(index, domEle) {

		var p = domEle.el;

		// There's a problem with mouseover and mouseout.

		//p.addEventListener('mouseover', function () {

		//	if (self.arrowMoving) {
		//		return false;
		//	}

		//	domEle.el.style.opacity = domEle.style.hover.opacity;

		//	ArcherTarget.fireEvent(domEle.el, 'targetOver.archerTarget', {index: index});

		//	return false;

		//});

		//p.addEventListener('mouseout', function () {

		//	if (self.arrowMoving) {
		//		return false;
		//	}

		//	domEle.el.style.opacity = domEle.style.initial.opacity;

		//	ArcherTarget.fireEvent(domEle.el, 'targetOut.archerTarget', {index: index});

		//	return false;

		//});

		p.addEventListener('click', function () {

			ArcherTarget.fireEvent(domEle.el, 'targetClick.archerTarget', {index: index});

		});

	}

	for (var i = 0; i < self.targetList.length; i++) {
		bindTarget(i, self.targetList[i]);
	}

};
