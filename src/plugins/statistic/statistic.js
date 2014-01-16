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
		return ring === 'X' ? 10 : ((!ring || ring === 'M') ? 0 : parseInt(ring, 10));
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

			self.canvasAverageGroup = target.canvas.createGroup(
				{id: target._id + 'StatisticAverage'});
			self.canvasGroup = target.canvas.createGroup({id: target._id + 'Statistic'});

			self.average = self.getAverage(self.arrows);

			if (options.showEndCenterPoint && options.arrows.length > 1) {

				for (i = 0, l = self.arrows.length; i < l; i++) {

					centerPoint = target.canvas.createCircle({
						x: pxX(self.average.arrows[i].x, 0),
						y: pxY(self.average.arrows[i].y, 0),
						radius: options.showEndCenterPoint.radius,
						fill: options.showEndCenterPoint.color,
						stroke: options.showEndCenterPoint.stroke || '#000',
						strokeWidth: options.showEndCenterPoint.strokeWidth || 0
					});

					self.canvasAverageGroup.appendChild(centerPoint);

					centerPoint = self.createText({
						x: pxX(self.average.arrows[i].x, 0),
						y: pxY(self.average.arrows[i].y, 0),
						color: options.showEndCenterPoint.textColor,
						size: options.showEndCenterPoint.textSize
					}, i);

					self.canvasAverageGroup.appendChild(centerPoint);

				}
			}

			if (options.showTargetCenterPoint && targetListLength > 1) {

				for (i = 0; i < targetListLength; i++) {

					centerPoint = target.canvas.createCircle({
						x: pxX(self.average.targets[i].x, i),
						y: pxY(self.average.targets[i].y, i),
						radius: options.showTargetCenterPoint.radius,
						fill: options.showTargetCenterPoint.color,
						stroke: options.showTargetCenterPoint.stroke || '#000',
						strokeWidth: options.showTargetCenterPoint.strokeWidth || 0
					});

					self.canvasAverageGroup.appendChild(centerPoint);

				}
			}

			if (options.showCenterPoint) {

				for (i = 0; i < targetListLength; i++) {

					centerPoint = target.canvas.createCircle({
						x: pxX(self.average.x, i),
						y: pxY(self.average.y, i),
						radius: options.showCenterPoint.radius,
						fill: options.showCenterPoint.color,
						stroke: options.showCenterPoint.stroke || '#000',
						strokeWidth: options.showCenterPoint.strokeWidth || 0
					});

					self.canvasAverageGroup.appendChild(centerPoint);

				}
			}

			self.standardDeviation = self.getStandardDeviation(self.arrows, self.average);

			if (options.showEndStandardDeviation && options.arrows.length > 1) {

				for (i = 0, l = options.arrows.length; i < l; i++) {

					self.canvasGroup.insertBefore(self.createEllipse({
						cx: pxX(self.average.arrows[i].x, 0),
						cy: pxY(self.average.arrows[i].y, 0),
						rx: pxX(self.standardDeviation.arrows[i].x),
						ry: pxY(self.standardDeviation.arrows[i].y),
						fill: options.showEndStandardDeviation.color,
						stroke: options.showEndStandardDeviation.stroke || false,
						strokeWidth: options.showEndStandardDeviation.strokeWidth || 0
					}), self.canvasGroup.firstChild);

				}

			}

			if (options.showTargetStandardDeviation && targetListLength > 1) {

				for (i = 0; i < targetListLength; i++) {

					self.canvasGroup.insertBefore(self.createEllipse({
						cx: pxX(self.average.targets[i].x, i),
						cy: pxY(self.average.targets[i].y, i),
						rx: pxX(self.standardDeviation.targets[i].x),
						ry: pxY(self.standardDeviation.targets[i].y),
						fill: options.showTargetStandardDeviation.color,
						stroke: options.showTargetStandardDeviation.stroke || false,
						strokeWidth: options.showTargetStandardDeviation.strokeWidth || 0
					}), self.canvasGroup.firstChild);

				}

			}

			if (options.showStandardDeviation) {

				for (i = 0; i < targetListLength; i++) {

					self.canvasGroup.insertBefore(self.createEllipse({
						cx: pxX(self.average.x, i),
						cy: pxY(self.average.y, i),
						rx: pxX(self.standardDeviation.x),
						ry: pxY(self.standardDeviation.y),
						fill: options.showStandardDeviation.color,
						stroke: options.showStandardDeviation.stroke || false,
						strokeWidth: options.showStandardDeviation.strokeWidth || 0
					}), self.canvasGroup.firstChild);

				}

			}

			target.canvas.rootGroup.appendChild(self.canvasGroup);
			target.canvas.canvas.appendChild(self.canvasAverageGroup);

		},

		getAverage: function (arrowsets) {

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

				if (curRing !== 0 && curRing !== 'M' &&
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

		},

		getStandardDeviation: function (arrowsets, average) {

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

				curX = isFinite(arrowsetData[j].x) ? Math.pow(arrowsetData[j].x - average.x, 2) : 0;
				curY = isFinite(arrowsetData[j].y) ? Math.pow(arrowsetData[j].y - average.y, 2) : 0;

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

		createText: function (config, content) {

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
