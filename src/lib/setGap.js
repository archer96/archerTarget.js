AT.prototype.setGap = function () {

	var self = this,
		i,
		target;

	self.gap = [];

	for (i = 0; i < self.targetList.length; i++) {

		target = self.targetList[i];

		self.gap[i] = {
			// Attention: converting the target radius using the x-axe;
			// otherwise an error will occur
			top: self.convertTo.canvasY(target.center[1]) -
				self.convertTo.canvasX(target.diameter / 2),

			left: self.convertTo.canvasX(target.center[0] -
					(target.diameter / 2))
		};

	}
};
