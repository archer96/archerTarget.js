ArcherTarget.prototype.setGap = function () {

	var i,
		target;

	this.gap = [];

	for (i = 0; i < this.targetList.length; i++) {

		target = this.targetList[i];

		this.gap[i] = {

			// Attention: converting the target radius using the x-axe;
			// otherwise an error will occur
			top: this.convertTo.canvasY(target.center[1]) -
				this.convertTo.canvasX(target.diameter / 2),

			left: this.convertTo.canvasX(target.center[0] -
					(target.diameter / 2))
		};

	}
};

