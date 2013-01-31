ArcherTarget.prototype.setTargetStyle = function (state, config) {

	var i,
		targets = this.targetList;

	switch (state) {

	case 'initial':

		for (i = 0; i < targets.length; i++) {

			targets[i].$el.css({ opacity: targets[i].style.initial.opacity });

		}

		break;


	case 'arrow':

		var arrowState;

		for (i = 0; i < targets.length; i++) {

			arrowState = (i === config.active) ? 'arrowOn' : 'arrowOff';

			targets[i].$el.css({ opacity: targets[i].style[arrowState].opacity });

		}

		break;

	}
};

