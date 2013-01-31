ArcherTarget.prototype.checkClosestTarget = function (currentTarget, config) {

	var self = this,
		i,
		curCenterX,
		curCenterY,
		curRadius,
		convert = self.convertTo,
		targetLength = self.targetList.length,
		target;

	for (i = 0; i < targetLength; i++) {

		target = self.targetList[i];

		curCenterX = (convert.canvasX(target.center[0]) + self.transX) * self.scale;
		curCenterY = (convert.canvasY(target.center[1]) + self.transY) * self.scale;
		curRadius  = convert.canvasX(target.diameter) / 2  * self.scale;

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
