AT.prototype.calculateRing = function (config) {

	var self = this,
		i,
		target = self.targetList[config.target],
		currentTarget = AT.Targets[target.name],
		distanceToCenter = {
			x: 0,
			y: 0,
			diagonal: 0
		},
		targetTmp = {
			x: (self.convertTo.canvasX(target.center[0]) + self.transX) * self.scale,
			y: (self.convertTo.canvasY(target.center[1]) + self.transY) * self.scale,
			radius:self.convertTo.canvasX(target.diameter) / 2 * self.scale,
			numberRings: currentTarget.numberRings
		},
		diameter;


	distanceToCenter.x =
		(config.x >= targetTmp.x) ?
		targetTmp.x - config.x :
		config.x - targetTmp.x;

	distanceToCenter.y =
		(config.y >= targetTmp.y) ?
		config.y - targetTmp.y :
		targetTmp.y - config.y;

	distanceToCenter.diagonal =
		(distanceToCenter.x === 0 && distanceToCenter.y === 0) ?
		0 :
		Math.sqrt(Math.pow(distanceToCenter.x, 2) + Math.pow(distanceToCenter.y, 2));


	if (distanceToCenter.diagonal > targetTmp.radius + 1) {
		return 0;
	}

	for (i = targetTmp.numberRings - 1; i >= 0; i--) {

		diameter = self.convertTo.canvasX(currentTarget.diameters[i], target.diameter) /
			2 * self.scale + 1;

		if (distanceToCenter.diagonal <= diameter) {

			return currentTarget.rating[i];

		}
	}

};
