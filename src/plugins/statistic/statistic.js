/*
 * archerTarget.js plugin "statistic" - version 0.1 [2014-01-02]
 * This plugin shows a scaleed target if an arrow is moving.
 * Created for use in smartphone applications.
 *
 * Copyright 2014, Andre Meyering
 * Licensed under the MIT license.
 */
(function () {

	'use strict';

	function ringToInteger (ring) {
		return ring === 'X' ? 10 : (ring === 'M' ? 0 : parseInt(ring, 10));
	}

	ArcherTarget.addPlugin('statistic', {
		/*
		 * Initializing function
		 */
		initialize: function (target, options) {

			var self = this,
				centerPoint,
				i, l,
				pxX = target.convertTo.pxX,
				pxY = target.convertTo.pxY,
				targetListLength = target.targetList.length;

			self.target = target;
			self.arrows = options.arrows || [];

			self.canvasGroup = target.canvas.createGroup({id: target._id + 'Statistic'});

			self.average = self.getAverage(self.arrows);

			if (options.showCenterPoint) {

				for (i = 0, l = target.targetList.length; i < l; i++) {

					centerPoint = target.canvas.createCircle({
						x: pxX(self.average.x, i),
						y: pxY(self.average.y, i),
						radius: options.showCenterPoint.radius,
						fill: options.showCenterPoint.color,
						stroke: options.showCenterPoint.stroke || '#000',
						strokeWidth: options.showCenterPoint.strokeWidth || 1
					});

					self.canvasGroup.appendChild(centerPoint);

				}
			}

			if (options.showTargetCenterPoint && targetListLength > 1) {

				for (i = 0, l = target.targetList.length; i < l; i++) {

					centerPoint = target.canvas.createCircle({
						x: pxX(self.average.targets[i].x, i),
						y: pxY(self.average.targets[i].y, i),
						radius: options.showTargetCenterPoint.radius,
						fill: options.showTargetCenterPoint.color,
						stroke: options.showTargetCenterPoint.stroke || '#000',
						strokeWidth: options.showTargetCenterPoint.strokeWidth || 1
					});

					self.canvasGroup.appendChild(centerPoint);

				}
			}

			self.standardDeviation = self.getStandardDeviation(self.arrows, self.average);

			if (options.showStandardDeviation) {

				for (i = 0, l = target.targetList.length; i < l; i++) {

					self.canvasGroup.appendChild(self.createEllipse({
						cx: pxX(self.average.x, i),
						cy: pxY(self.average.y, i),
						rx: pxX(self.standardDeviation.x),
						ry: pxY(self.standardDeviation.y),
						fill: options.showStandardDeviation.color,
						stroke: options.showStandardDeviation.stroke || false,
						strokeWidth: options.showStandardDeviation.strokeWidth || 0
					}));

				}

			}

			if (options.showTargetStandardDeviation && targetListLength > 1) {

				for (i = 0, l = target.targetList.length; i < l; i++) {

					self.canvasGroup.appendChild(self.createEllipse({
						cx: pxX(self.average.targets[i].x, i),
						cy: pxY(self.average.targets[i].y, i),
						rx: pxX(self.standardDeviation.targets[i].x),
						ry: pxY(self.standardDeviation.targets[i].y),
						fill: options.showTargetStandardDeviation.color,
						stroke: options.showTargetStandardDeviation.stroke || false,
						strokeWidth: options.showTargetStandardDeviation.strokeWidth || 0
					}));

				}

			}

			target.canvas.rootGroup.appendChild(self.canvasGroup);

		},

		getAverage: function (arrowsets) {

			var sumRing = 0,
				sumX = 0,
				sumY = 0,
				countRing = 0,
				curRing,
				countXY = 0,
				targets = [],
				targetsLength = this.target.targetList.length,
				i;

			if (targetsLength > 1) {
				for (i = 0; i < targetsLength; i++) {
					targets[i] = {
						countRing: 0,
						countXY: 0,
						sumRing: 0,
						sumX: 0,
						sumY: 0
					};
				}
			}

			for (i = 0; i < arrowsets.length; i++) {

				var arrows = arrowsets[i].data;

				for (var j = 0; j < arrows.length; j++) {

					var targetIndex = arrows[j].target || 0;

					countRing++;
					curRing = ringToInteger(this.target.getRing(arrows[j]));
					sumRing += curRing;

					if (curRing !== 0 && curRing !== 'M') {

						countXY++;

						sumX += arrows[j].x;
						sumY += arrows[j].y;

						if (targetsLength > 1) {

							targets[targetIndex].countXY++;
							targets[targetIndex].sumX += arrows[j].x;
							targets[targetIndex].sumY += arrows[j].y;

						}

					}

					if (targetsLength > 1) {

						targets[targetIndex].countRing++;
						targets[targetIndex].sumRing += curRing;

					}

				}

			}

			if (targetsLength > 1) {

				for (i = 0; i < targetsLength; i++) {

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
				targets: targets
			};

		},

		getStandardDeviation: function (arrowsets, average) {

			var sumRing = 0,
				sumX = 0,
				sumY = 0,
				curRing,
				curX,
				curY,
				targets = [],
				targetsLength = average.targets.length,
				i;

			if (targetsLength > 1) {
				for (i = 0; i < targetsLength; i++) {

					targets[i] = {
						countRing: average.targets[i].countRing,
						countXY: average.targets[i].countXY,
						sumRing: 0,
						sumX: 0,
						sumY: 0
					};

				}
			}

			for (i = 0; i < arrowsets.length; i++) {

				var arrows = arrowsets[i].data;

				for (var j = 0; j < arrows.length; j++) {

					var targetIndex = arrows[j].target || 0;

					curRing = this.target.getRing(arrows[j]);

					sumRing += Math.pow(ringToInteger(curRing) -
						average.ring, 2);

					curX = Math.pow(arrows[j].x - average.x, 2);
					curY = Math.pow(arrows[j].y - average.y, 2);

					sumX += curX;
					sumY += curY;

					if (targetsLength > 1) {

						targets[targetIndex].sumX += curX;
						targets[targetIndex].sumY += curY;
						targets[targetIndex].sumRing += ringToInteger(curRing);

					}

				}

			}

			if (targetsLength > 1) {
				for (i = 0; i < targetsLength; i++) {
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
				targets: targets
			};

		},

		getPolygonFromArrows: function (arrowset, arrowsetId) {

			var self = this,
				string = '';


			var arrows = arrowset[arrowsetId].data;

			for (var i = 0; i < arrows.length; i++) {
				string = string + ' ' + self.target.convertTo.pxX(arrows[i].x, arrows[i].target) +
					',' + self.target.convertTo.pxY(arrows[i].y, arrows[i].target);
			}

			return string;

		},

		createPolygon: function (config) {

			var canvas = this.target.canvas,
				node = canvas.createSvgNode('polygon');

			node.setAttribute('points', config.points);
			node.setAttribute('fill', 'none');//config.fill);
			node.setAttribute('stroke', config.stroke);
			node.setAttribute('stroke-width', config.strokeWidth);

			return node;

		},

		createEllipse: function (config) {

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

		},

		getPluginData: function (target) {

			var self = this;

			return {
				average: self.average,
				standardDeviation: self.standardDeviation
			};
		}

	});

}());
