ArcherTarget.prototype.createArrows =  function (arrows) {

	if (!arrows) { arrows = []; }

	var self = this,
		i, j,
		arrowClass,
		dragObjectDefaults = {
			height: 40,
			width: 5
		},
		arrowLength = arrows.length,
		arrow,
		dataLength,
		arrowData;


	self.arrowGroup = self.canvas.createGroup(
		false,
		{
			id: self.$containerId + 'ArrowGroup'
		}
	);

	self.canvas.canvas.appendChild(self.arrowGroup);


	for (i = 0; i < arrowLength; i++) {

		arrows[i] = arrow instanceof Array ? { data: arrows[i]} : arrows[i];

		arrows[i] = $.extend(true, {}, self.options.arrowDefaults, arrows[i]);


		arrow = arrows[i];


		if (arrow.draggable instanceof Object) {
			arrow.draggable = $.extend(true, {}, dragObjectDefaults, arrow.draggable);
		}


		arrow.el = self.canvas.createGroup(
			false,
			{
				id: self.$containerId + 'ArrowSet_' + i,
				eleClass: 'arrowSetCanvas'
			}
		);
		arrow.$el = $(arrow.el);


		dataLength = arrow.data.length;

		for (j = 0; j < dataLength; j++) {

			arrowData = arrow.data[j];

			if (!self.targetList[arrow.target]) {
				arrow.target = 0;
			}

			arrowData.target = arrowData.target || arrow.target;

			if (!self.targetList[arrowData.target]) {
				arrowData.target = 0;
			}

			if (typeof(arrowData.active) === 'undefined') {
				arrowData.active = arrow.active;
			}

			arrowClass = arrowData.active ? '' : ' hidden';

			arrowData.el = self.canvas.createCircle({
				x: self.convertTo.pxX(arrowData.x, arrowData.target),
				y: self.convertTo.pxY(arrowData.y, arrowData.target),
				radius: arrow.radius,
				fill: arrow.style.initial.color,
				stroke: arrow.style.initial.stroke,
				eleClass: j + arrowClass
			});
			arrowData.$el = $(arrowData.el);

			arrowData.$el.css({
				opacity: arrow.style.initial.opacity
			});

			arrow.$el.append(arrowData.el);

		}

		self.arrowGroup.appendChild(arrow.el);

	}

	DEVMODE && console.log('archerTarget :: created arrowset(s) ', arrows);

	return arrows;

};
