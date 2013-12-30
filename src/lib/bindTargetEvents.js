AT.prototype.bindTargetEvents = function () {

	var self = this,
		isTouch = self.options.isTouch;

	function bindTarget(index, domEle) {

		var eventHandler = function () {

			ArcherTarget.fireEvent(domEle.el, 'targetClick.archerTarget', {index: index});

		};

		var el = domEle.el.parentNode;

		el.addEventListener(isTouch ? 'touchend' : 'click', eventHandler);

		self.eventListeners.push(function () {
			el.removeEventListener(isTouch ? 'touchend' : 'click', eventHandler);
		});

	}

	for (var i = 0; i < self.targetList.length; i++) {
		bindTarget(i, self.targetList[i]);
	}

};
