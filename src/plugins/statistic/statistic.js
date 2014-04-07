/*
 * archerTarget.js plugin "statistic" - version 0.2 [2014-01-19]
 * This plugin shows a scaleed target if an arrow is moving.
 * Created for use in smartphone applications.
 *
 * Copyright 2014, Andre Meyering
 * Licensed under the MIT license.
 */
(function () {

	'use strict';

	function ringToInteger (ring) {
		return ring === 'X' ? 10 : ((!ring || ring === 'M') ? 0 : parseInt(ring, 10));
	}

	var statistic = function (target, options) {

		var self = this,
			centerPoint,
			i, l,
			pxX = target.convertTo.pxX,
			pxY = target.convertTo.pxY,
			targetListLength = target.targetList.length;

		self.target = target;
		self.arrows = options.arrows || [];
		self.options = options;

		self.canvasAverageGroup = target.canvas.createGroup(
			{id: target._id + 'StatisticAverage'});
		self.canvasGroup = target.canvas.createGroup({id: target._id + 'Statistic'});

		self.average = self.getAverage(self.arrows);

		if (options.showEndCenterPoint && options.arrows.length > 1) {
			self.createEndCenterPoints(options.endCenterPointOptions);
		}
		if (options.showTargetCenterPoint && targetListLength > 1) {
			self.createTargetCenterPoints(options.targetCenterPointOptions);
		}
		if (options.showCenterPoint) {
			self.createCenterPoints(options.centerPointOptions);
		}

		self.standardDeviation = self.getStandardDeviation(self.arrows, self.average);

		if (options.showEndStandardDeviation && options.arrows.length > 1) {
			self.createEndStandardDeviations(options.endStandardDeviationOptions);
		}
		if (options.showTargetStandardDeviation && targetListLength > 1) {
			self.createTargetStandardDeviations(options.targetStandardDeviationOptions);
		}
		if (options.showStandardDeviation) {
			self.createStandardDeviations(options.standardDeviationOptions);
		}

		target.canvas.rootGroup.appendChild(self.canvasGroup);
		target.canvas.canvas.appendChild(self.canvasAverageGroup);

	};

	statistic.prototype.getAverage = function (arrowsets) {

		var sumRing = 0,
			sumX = 0,
			sumY = 0,
			countRing = 0,
			curRing,
			countXY = 0,
			targets = [],
			arrows = [],
			arrowListLength = arrowsets.length,
			targetListLength = this.target.targetList.length,
			i, j;

		if (targetListLength > 1) {
			for (i = 0; i < targetListLength; i++) {
				targets[i] = {
					countRing: 0,
					countXY: 0,
					sumRing: 0,
					sumX: 0,
					sumY: 0
				};
			}
		}

		var l = arrowsets[0].data.length;

		for (i = 0, j = 0;
			i < arrowListLength && j < l;
			j++, i = (j === l) ? i + 1 : i, j = (j === l) ? j = 0 : j)
		{

			l = arrowsets[i].data.length;

			if (j === 0 && arrowListLength > 1) {
				arrows[i] = {
					countRing: 0,
					countXY: 0,
					sumRing: 0,
					sumX: 0,
					sumY: 0
				};
			}

			var arrowsetData = arrowsets[i].data,
				targetIndex = arrowsetData[j].target || 0;

			countRing++;

			arrowsetData[j].target = arrowsetData[j].target >= targetListLength ? 0 :
				arrowsetData[j].target;

			curRing = ringToInteger(this.target.getRing(arrowsetData[j]));
			sumRing += curRing;

			if (curRing !== 0 &&
				isFinite(arrowsetData[j].x) && isFinite(arrowsetData[j].y)) {

				countXY++;

				var x = arrowsetData[j].x;
				var y = arrowsetData[j].y;

				sumX += x;
				sumY += y;

				if (arrowListLength > 1) {
					arrows[i].countXY++;
					arrows[i].sumX += x;
					arrows[i].sumY += y;
				}

				if (targetListLength > 1) {
					targets[targetIndex].countXY++;
					targets[targetIndex].sumX += x;
					targets[targetIndex].sumY += y;
				}

			}

			if (arrowListLength > 1) {
				arrows[i].countRing++;
				arrows[i].sumRing += curRing;
			}

			if (targetListLength > 1) {
				targets[targetIndex].countRing++;
				targets[targetIndex].sumRing += curRing;
			}

		}

		if (arrowListLength > 1) {
			for (i = 0; i < arrowListLength; i++) {
				arrows[i].x = arrows[i].countXY ?
					arrows[i].sumX / arrows[i].countXY : 0;
				arrows[i].y = arrows[i].countXY ?
					arrows[i].sumY / arrows[i].countXY : 0;
				arrows[i].ring = arrows[i].countRing ?
					arrows[i].sumRing / arrows[i].countRing : 0;
			}
		}

		if (targetListLength > 1) {
			for (i = 0; i < targetListLength; i++) {
				targets[i].x = targets[i].countXY ?
					targets[i].sumX / targets[i].countXY : 0;
				targets[i].y = targets[i].countXY ?
					targets[i].sumY / targets[i].countXY : 0;
				targets[i].ring = targets[i].countRing ?
					targets[i].sumRing / targets[i].countRing : 0;
			}
		}

		return {
			sumRing: sumRing,
			sumX: sumX,
			sumY: sumY,
			countRing: countRing,
			countXY: countXY,
			ring: countRing ? sumRing / countRing : 0,
			x: countXY ? sumX / countXY : 0,
			y: countXY ? sumY / countXY : 0,
			targets: targets,
			arrows: arrows
		};

	};

	statistic.prototype.getStandardDeviation = function (arrowsets, average) {

		var sumRing = 0,
			sumX = 0,
			sumY = 0,
			curRing,
			curX,
			curY,
			arrows = [],
			targets = [],
			arrowListLength = arrowsets.length,
			targetListLength = average.targets.length,
			i, j;

		if (targetListLength > 1) {
			for (i = 0; i < targetListLength; i++) {
				targets[i] = {
					countRing: average.targets[i].countRing,
					countXY: average.targets[i].countXY,
					sumRing: 0,
					sumX: 0,
					sumY: 0
				};
			}
		}

		var l = arrowsets[0].data.length;

		for (i = 0, j = 0;
			i < arrowListLength && j < l;
			j++, i = (j === l) ? i + 1 : i, j = (j === l) ? j = 0 : j)
		{

			l = arrowsets[i].data.length;

			if (j === 0 && arrowListLength > 1) {
				arrows[i] = {
					countRing: average.arrows[i].countRing,
					countXY: average.arrows[i].countXY,
					sumRing: 0,
					sumX: 0,
					sumY: 0
				};
			}

			var arrowsetData = arrowsets[i].data,
				targetIndex = arrowsetData[j].target || 0;

			curRing = Math.pow(ringToInteger(
				this.target.getRing(arrowsetData[j])) - average.ring, 2);
			sumRing += curRing;

			curX = (isFinite(arrowsetData[j].x) && arrowsetData[j].x !== 0) ?
				Math.pow(arrowsetData[j].x - average.x, 2) : 0;
			curY = (isFinite(arrowsetData[j].y) && arrowsetData[j].y !== 0) ?
				Math.pow(arrowsetData[j].y - average.y, 2) : 0;

			sumX += curX;
			sumY += curY;

			if (arrowListLength > 1) {
				arrows[i].sumX += curX;
				arrows[i].sumY += curY;
				arrows[i].sumRing += curRing;
			}

			if (targetListLength > 1) {
				targets[targetIndex].sumX += curX;
				targets[targetIndex].sumY += curY;
				targets[targetIndex].sumRing += curRing;
			}

		}

		if (arrowListLength > 1) {
			for (i = 0; i < arrowListLength; i++) {
				arrows[i].x = arrows[i].countXY ?
					Math.sqrt(arrows[i].sumX / arrows[i].countXY) : 0;
				arrows[i].y = arrows[i].countXY ?
					Math.sqrt(arrows[i].sumX / arrows[i].countXY) : 0;
				arrows[i].ring = arrows[i].countRing ?
					Math.sqrt(arrows[i].sumRing / arrows[i].countRing) : 0;
			}
		}

		if (targetListLength > 1) {
			for (i = 0; i < targetListLength; i++) {
				targets[i].x = targets[i].countXY ?
					Math.sqrt(targets[i].sumX / targets[i].countXY) : 0;
				targets[i].y = targets[i].countXY ?
					Math.sqrt(targets[i].sumX / targets[i].countXY) : 0;
				targets[i].ring = targets[i].countRing ?
					Math.sqrt(targets[i].sumRing / targets[i].countRing) : 0;
			}
		}

		return {
			sumRing: sumRing,
			sumX: sumX,
			sumY: sumY,
			countRing: average.countRing,
			countXY: average.countXY,
			ring: Math.sqrt(sumRing / average.countRing),
			x: Math.sqrt(sumX / average.countXY),
			y: Math.sqrt(sumY / average.countXY),
			targets: targets,
			arrows: arrows
		};

	};

	statistic.prototype.getPolygonFromArrows = function (arrowset, arrowsetId) {

		var self = this,
			string = '';


		var arrows = arrowset[arrowsetId].data;

		for (var i = 0; i < arrows.length; i++) {
			string = string + ' ' + self.target.convertTo.pxX(arrows[i].x, arrows[i].target) +
				',' + self.target.convertTo.pxY(arrows[i].y, arrows[i].target);
		}

		return string;

	};

	statistic.prototype.createPolygon = function (config) {

		var canvas = this.target.canvas,
			node = canvas.createSvgNode('polygon');

		node.setAttribute('points', config.points);
		node.setAttribute('fill', 'none');//config.fill);
		node.setAttribute('stroke', config.stroke);
		node.setAttribute('stroke-width', config.strokeWidth);

		return node;

	};

	statistic.prototype.createEllipse = function (config) {

		var canvas = this.target.canvas,
			node = canvas.createSvgNode('ellipse');

		node.setAttribute('cx', config.cx);
		node.setAttribute('cy', config.cy);
		node.setAttribute('rx', config.rx);
		node.setAttribute('ry', config.ry);

		node.setAttribute('fill', config.fill);
		node.setAttribute('stroke', config.stroke);
		node.setAttribute('stroke-width', config.strokeWidth);

		return node;

	};

	statistic.prototype.createText = function (config, content) {

		var canvas = this.target.canvas,
			node = canvas.createSvgNode('text'),
			size = config.size || 10;

		node.setAttribute('x', config.x);
		node.setAttribute('y', config.y + size / 2);

		node.style.fontSize = size;
		node.style.textAnchor = 'middle';

		var textNode = document.createTextNode(content);
		node.appendChild(textNode);

		return node;

	};

	statistic.prototype.createCenterPoints = function (options) {

		var self = this,
			target = self.target,
			targetListLength = self.target.targetList.length,
			pxX = target.convertTo.pxX,
			pxY = target.convertTo.pxY,
			centerPoint,
			i;

		self.centerPointsEl = [];

		for (i = 0; i < targetListLength; i++) {

			centerPoint = target.canvas.createCircle({
				x: pxX(self.average.x, i),
				y: pxY(self.average.y, i),
				radius: options.radius,
				fill: options.color,
				stroke: options.stroke || '#000',
				strokeWidth: options.strokeWidth || 0
			});

			self.canvasAverageGroup.appendChild(centerPoint);

			self.centerPointsEl[i] = centerPoint;

		}

	};

	statistic.prototype.createEndCenterPoints = function (options) {

		var self = this,
			target = self.target,
			pxX = target.convertTo.pxX,
			pxY = target.convertTo.pxY,
			centerCircle,
			centerText;

		self.endCenterPointsEl = [];

		for (var i = 0, l = self.arrows.length; i < l; i++) {

			centerCircle = target.canvas.createCircle({
				x: pxX(self.average.arrows[i].x, 0),
				y: pxY(self.average.arrows[i].y, 0),
				radius: options.radius,
				fill: options.color,
				stroke: options.stroke || '#000',
				strokeWidth: options.strokeWidth || 0
			});

			centerText = self.createText({
				x: pxX(self.average.arrows[i].x, 0),
				y: pxY(self.average.arrows[i].y, 0),
				color: options.textColor,
				size: options.textSize
			}, i);

			self.canvasAverageGroup.appendChild(centerCircle);
			self.canvasAverageGroup.appendChild(centerText);

			self.endCenterPointsEl[i] = {
				circle:centerCircle,
				text: centerText
			};

		}

	};

	statistic.prototype.createTargetCenterPoints = function (options) {

		var self = this,
			target = self.target,
			targetListLength = self.target.targetList.length,
			pxX = target.convertTo.pxX,
			pxY = target.convertTo.pxY,
			centerEllipse,
			i;

		self.targetCenterPointsEl = [];

		for (i = 0; i < targetListLength; i++) {

			centerEllipse = target.canvas.createCircle({
				x: pxX(self.average.targets[i].x, i),
				y: pxY(self.average.targets[i].y, i),
				radius: options.radius,
				fill: options.color,
				stroke: options.stroke || '#000',
				strokeWidth: options.strokeWidth || 0
			});

			self.canvasAverageGroup.appendChild(centerEllipse);

			self.targetCenterPointsEl[i] = centerEllipse;

		}

	};

	statistic.prototype.createStandardDeviations = function (options) {

		var self = this,
			target = self.target,
			targetListLength = target.targetList.length,
			pxX = target.convertTo.pxX,
			pxY = target.convertTo.pxY,
			standardDeviationPoint,
			i, l;

		self.standardDeviationsEl = [];

		for (i = 0; i < targetListLength; i++) {

			standardDeviationPoint = self.createEllipse({
				cx: pxX(self.average.x, i),
				cy: pxY(self.average.y, i),
				rx: pxX(self.standardDeviation.x),
				ry: pxY(self.standardDeviation.y),
				fill: options.color,
				stroke: options.stroke || false,
				strokeWidth: options.strokeWidth || 0
			});

			self.canvasGroup.insertBefore(standardDeviationPoint, self.canvasGroup.firstChild);

			self.standardDeviationsEl[i] = standardDeviationPoint;

		}

	};

	statistic.prototype.createEndStandardDeviations = function (options) {

		var self = this,
			target = self.target,
			pxX = target.convertTo.pxX,
			pxY = target.convertTo.pxY,
			standardDeviationPoint,
			i, l;

		self.endStandardDeviationsEl = [];

		for (i = 0, l = self.options.arrows.length; i < l; i++) {

			standardDeviationPoint = self.createEllipse({
				cx: pxX(self.average.arrows[i].x, 0),
				cy: pxY(self.average.arrows[i].y, 0),
				rx: pxX(self.standardDeviation.arrows[i].x),
				ry: pxY(self.standardDeviation.arrows[i].y),
				fill: options.color,
				stroke: options.stroke || false,
				strokeWidth: options.strokeWidth || 0
			});

			self.canvasGroup.insertBefore(standardDeviationPoint, self.canvasGroup.firstChild);

			self.endStandardDeviationsEl[i] = standardDeviationPoint;

		}

	};

	statistic.prototype.createTargetStandardDeviations = function (options) {

		var self = this,
			target = self.target,
			targetListLength = target.targetList.length,
			pxX = target.convertTo.pxX,
			pxY = target.convertTo.pxY,
			standardDeviationPoint,
			i, l;

		self.targetStandardDeviationsEl = [];

		for (i = 0; i < targetListLength; i++) {

			standardDeviationPoint = self.createEllipse({
				cx: pxX(self.average.targets[i].x, i),
				cy: pxY(self.average.targets[i].y, i),
				rx: pxX(self.standardDeviation.targets[i].x),
				ry: pxY(self.standardDeviation.targets[i].y),
				fill: options.color,
				stroke: options.stroke || false,
				strokeWidth: options.strokeWidth || 0
			});

			self.canvasGroup.insertBefore(standardDeviationPoint, self.canvasGroup.firstChild);

			self.targetStandardDeviationsEl[i] = standardDeviationPoint;

		}

	};
	/**
	 * Shows or hides average arrow on targets
	 * @param {Object}        config
	 * @param {Boolean}       config.show         Whether to show or hide the average arrow
	 * @param {Number|String} [config.arrowsetID] ID of arrowset to show its average arrow or
	 *                                            'all' for all ends
	 * @param {Number}        [config.targetID]   ID of target to show its average arrow or
	 *                                            'all' for all	targets
	 */
	statistic.prototype.showAverage = function (config) {

		var self = this,
			isActive = config.active,
			i;

		if (config.arrowsetID === 'all') {

			if (isActive) {

				if (!self.endCenterPointsEl || !self.endCenterPointsEl.length) {
					self.createEndCenterPoints(self.options.endCenterPointOptions);
				} else {
					for (i = 0; i < self.endCenterPointsEl.length; i++) {
						self.endCenterPointsEl[i].circle.setAttribute('class', '');
						self.endCenterPointsEl[i].text.setAttribute('class', '');
					}
				}

			} else if (self.endCenterPointsEl && self.endCenterPointsEl.length) {

				for (i = 0; i < self.endCenterPointsEl.length; i++) {
					self.endCenterPointsEl[i].circle.setAttribute('class', 'hidden');
					self.endCenterPointsEl[i].text.setAttribute('class', 'hidden');
				}

			}

		} else if (config.targetID === 'all') {
			//self.createTargetCenterPoints(self.options.targetCenterPointOptions);

			if (isActive) {

				if (!self.targetCenterPointsEl || !self.targetCenterPointsEl.length) {
					self.createTargetCenterPoints(self.options.targetCenterPointOptions);
				} else {
					for (i = 0; i < self.targetCenterPointsEl.length; i++) {
						self.targetCenterPointsEl[i].setAttribute('class', '');
					}
				}

			} else if (self.targetCenterPointsEl && self.targetCenterPointsEl.length) {

				for (i = 0; i < self.targetCenterPointsEl.length; i++) {
					self.targetCenterPointsEl[i].setAttribute('class', 'hidden');
				}

			}

		} else {

			if (isFinite(config.arrowsetID)) {
				self.endCenterPointsEl[config.arrowsetID].circle.setAttribute('class',
					isActive ? '' : 'hidden');
				self.endCenterPointsEl[config.arrowsetID].text.setAttribute('class',
					isActive ? '' : 'hidden');
			}

		}

	};
	/**
	 * Shows or hides standard deviation arrow on targets
	 * @param {Object}        config
	 * @param {Boolean}       config.show         Whether to show or hide the standard
	 *                                            deviation arrow
	 * @param {Number|String} [config.arrowsetID] ID of arrowset to show its standard deviation
	 *                                            arrow or 'all' for all ends
	 * @param {Number}        [config.targetID]   ID of target to show its standard deviation
	 *                                            arrow or 'all' for all	targets
	 */
	statistic.prototype.showStandardDeviation = function (config) {

		var self = this,
			isActive = config.active,
			i;

		if (config.showAll === 'all') {

			if (isActive) {

				if (!self.standardDeviationsEl || !self.standardDeviationsEl.length) {
					self.createStandardDeviations(self.options.standardDeviationOptions);
				} else {
					for (i = 0; i < self.standardDeviationsEl.length; i++) {
						self.standardDeviationsEl[i].setAttribute('class', '');
					}
				}

			} else if (self.standardDeviationsEl && self.standardDeviationsEl.length) {

				for (i = 0; i < self.standardDeviationsEl.length; i++) {
					self.standardDeviationsEl[i].setAttribute('class', 'hidden');
				}

			}

		} else if (config.arrowsetID === 'all') {

			if (isActive) {

				if (!self.endStandardDeviationsEl || !self.endStandardDeviationsEl.length) {
					self.createEndStandardDeviations(self.options.endStandardDeviationOptions);
				} else {
					for (i = 0; i < self.endStandardDeviationsEl.length; i++) {
						self.endStandardDeviationsEl[i].setAttribute('class', '');
					}
				}

			} else if (self.endStandardDeviationsEl && self.endStandardDeviationsEl.length) {

				for (i = 0; i < self.endStandardDeviationsEl.length; i++) {
					self.endStandardDeviationsEl[i].setAttribute('class', 'hidden');
				}

			}

		} else if (config.targetID === 'all') {

			if (isActive) {

				if (!self.targetStandardDeviationsEl || !self.targetStandardDeviationsEl.length) {
					self.createTargetStandardDeviations(
						self.options.targetStandardDeviationOptions);
				} else {
					for (i = 0; i < self.targetStandardDeviationsEl.length; i++) {
						self.targetStandardDeviationsEl[i].setAttribute('class', '');
					}
				}

			} else if (self.targetStandardDeviationsEl && self.targetStandardDeviationsEl.length) {

				for (i = 0; i < self.targetStandardDeviationsEl.length; i++) {
					self.targetStandardDeviationsEl[i].setAttribute('class', 'hidden');
				}

			}

		} else {

			if (isFinite(config.arrowsetID)) {
				self.endStandardDeviationsEl[config.arrowsetID].setAttribute('class',
					isActive ? '' : 'hidden');
			}

		}

	};

	statistic.prototype.getPluginData = function (target) {

		var self = this;

		return {
			average: self.average,
			standardDeviation: self.standardDeviation,
			showAverage: function (config) {
				self.showAverage(config);
			},
			showStandardDeviation: function (config) {
				self.showStandardDeviation(config);
			}
		};

	};

	ArcherTarget.addPlugin('statistic', {
		init: function (target, options) {
			return new statistic(target, options);
		}
	});

}());
