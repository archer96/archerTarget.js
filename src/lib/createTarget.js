AT.prototype.createTarget = function (targets) {

	var self = this,
		i, j,
		target,
		targetDiameter;

	targets = targets || [];


	for (i = 0; i < targets.length; i++) {

		targets[i] = ArcherTarget.extend(true, {}, this.options.targetDefaults, targets[i]);

		target = targets[i];

		target.originalCenter = target.center;

		target.el = this.canvas.createGroup(
			{
				id: self._id + 'Target_' + i,
				eleClass: 'targetCanvas'
			}
		);

		target.rings = [];

		for (j = 0; j < AT.Targets[target.name].numberRings; j++) {

			target.rings[j] = {};

			targetDiameter = AT.Targets[target.name].diameters[j];

			target.rings[j].el = this.canvas.createCircle({
				x: self.convertTo.canvasX(target.center[0]),
				y: self.convertTo.canvasY(target.center[1]),
				radius: self.convertTo.canvasX(targetDiameter, target.diameter) / 2,
				fill: AT.Targets[target.name].colors[j],
				stroke: AT.Targets[target.name].strokeColors[j],
				eleClass: j
			});

			target.el.appendChild(target.rings[j].el);

		}

		target.el.style.opacity = target.style.initial.opacity;
		this.targetGroup.appendChild(target.el);


	}

	DEVMODE && console.log('archerTarget :: created target(s) ', targets);

	return targets;

};
