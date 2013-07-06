AT.prototype.bindTargetTouchEvents = function () {

	var self = this;

	function bindTarget(index, domEle) {

		domEle.el.parentNode.addEventListener('touchend', function () {

			ArcherTarget.fireEvent(domEle.el, 'targetClick.archerTarget', {index: index});

		});

	}

	for (var i = 0; i < self.targetList.length; i++) {
		bindTarget(i, self.targetList[i]);
	}

};
