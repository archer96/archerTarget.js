AT.prototype.bindTargetTouchEvents = function () {

	var self = this;

	function bindTarget(index, domEle) {

		var eventHandler = function () {

			ArcherTarget.fireEvent(domEle.el, 'targetClick.archerTarget', {index: index});

		};

		domEle.el.parentNode.addEventListener('touchend', eventHandler);

		self.eventListeners.push(function () {
			domEle.el.parentNode.removeEventListener('touchend', eventHandler);
		});

	}

	for (var i = 0; i < self.targetList.length; i++) {
		bindTarget(i, self.targetList[i]);
	}

};
