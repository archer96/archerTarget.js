ArcherTarget.prototype.createTarget = function (targets) {

	var self = this,
		i, j,
		target,
		targetDiameter;

	targets = targets || [];

	for (i = 0; i < targets.length; i++) {

		targets[i] = $.extend(true, {}, this.options.targetDefaults, targets[i]);

		target = targets[i];

		target.originalCenter = target.center;

		target.el = this.canvas.createGroup(
			false,
			{
				id: self.$containerId + 'Target_' + i,
				eleClass: 'targetCanvas'
			}
		);
		target.$el = $(target.el);

		target.rings = [];

		for (j = 0; j < ArcherTarget.Targets[target.name].numberRings; j++) {

			target.rings[j] = {};

			targetDiameter = ArcherTarget.Targets[target.name].diameters[j];

			target.rings[j].el = this.canvas.createCircle({
				x: this.convertTo.canvasX(target.center[0]),
				y: this.convertTo.canvasY(target.center[1]),
				radius:this.convertTo.canvasX(targetDiameter, target.diameter) / 2,
				fill: ArcherTarget.Targets[target.name].colors[j],
				stroke: ArcherTarget.Targets[target.name].strokeColors[j],
				eleClass: j
			});

			target.$el.append(target.rings[j].el);

		}

		this.targetGroup.appendChild(target.el);

		target.$el.css({
			opacity: target.style.initial.opacity
		});

	}

	DEVMODE && console.log('archerTarget :: created target(s) ', targets);

	return targets;

};
