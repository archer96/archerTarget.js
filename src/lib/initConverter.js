AT.prototype.initConverter = function ()  {

	var self = this,
		converterCacheCanvas = {
			x: {},
			y: {}
		};

	self.convertTo = {

		pcX: function (arg, targetID) {

			if (!targetID) { targetID = 0; }

			return (arg / self.scale - self.gap[targetID].left - self.transX) /
				self.convertTo.canvasX(self.targetList[targetID].diameter) * 100;

		},

		pcY: function (arg, targetID) {

			if (!targetID) { targetID = 0; }

			// Attention: converting the target diameter using the x-axe;
			// otherwise an error will occur
			return (arg / self.scale - self.gap[targetID].top - self.transY) /
				self.convertTo.canvasX(self.targetList[targetID].diameter) * 100;

		},

		pxX: function (arg, targetID) {

			if (!targetID) { targetID = 0; }

			return ((self.convertTo.canvasX(self.targetList[targetID].diameter) / 100) *
				arg + self.gap[targetID].left + self.transX) * self.scale;

		},

		pxY: function (arg, targetID) {

			if (!targetID) { targetID = 0; }

			// Attention: converting the target diameter using the x-axe;
			// otherwise an error will occur
			return ((self.convertTo.canvasX(self.targetList[targetID].diameter) / 100) *
				arg + self.gap[targetID].top + self.transY) * self.scale;

		},

		canvasX: function (arg, targetDiameter) {

			if (!targetDiameter) { targetDiameter = 100; }
			if (!converterCacheCanvas.x[targetDiameter]) {
				converterCacheCanvas.x[targetDiameter] = {};
			}

			var tmpCache = converterCacheCanvas.x[targetDiameter];


			if (!tmpCache[arg]) {

				tmpCache[arg] = self.width / 100 * targetDiameter / 100 * arg;

			}

			return tmpCache[arg];

		},

		canvasY: function (arg, targetDiameter) {

			if (!targetDiameter) { targetDiameter = 100; }


			if (!converterCacheCanvas.y[targetDiameter]) {
				converterCacheCanvas.y[targetDiameter] = {};
			}

			var tmpCache = converterCacheCanvas.y[targetDiameter];

			if (!tmpCache[arg]) {

				tmpCache[arg] = self.height / 100 * targetDiameter / 100 * arg;

			}

			return tmpCache[arg];

		}

	};

};
