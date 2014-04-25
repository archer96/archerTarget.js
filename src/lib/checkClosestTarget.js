AT.prototype.checkClosestTarget = function (currentTarget, config) {

	var self = this,
		targetLength = self.targetList.length,
		convertTo = self.convertTo,
		curCenterX,
		curCenterY,
		curRadius,
		target,
		i;

	for (i = 0; i < targetLength; i++) {

		target = self.targetList[i];

		curCenterX = (convertTo.canvasX(target.center[0]) + self.transX) * self.scale;
		curCenterY = (convertTo.canvasY(target.center[1]) + self.transY) * self.scale;
		curRadius  = convertTo.canvasX(target.diameter) / 2  * self.scale;

		if (config.x > curCenterX - curRadius &&
			config.x < curCenterX + curRadius &&
			config.y > curCenterY - curRadius &&
			config.y < curCenterY + curRadius
			) {
			return i;
		}
	}

	return currentTarget;

};
