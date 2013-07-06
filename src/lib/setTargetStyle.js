AT.prototype.setTargetStyle = function (state, config) {

	var i,
		targets = this.targetList,
		states;

	states = {
		initial: function () {
			for (i = 0; i < targets.length; i++) {

				targets[i].el.style.opacity = targets[i].style.initial.opacity;

			}
		},
		arrow: function () {
			var arrowState;

			for (i = 0; i < targets.length; i++) {

				arrowState = (i === config.active) ? 'arrowOn' : 'arrowOff';

				targets[i].el.style.opacity = targets[i].style[arrowState].opacity;

			}
		}
	};

	if (states[state]) {
		states[state]();
	}

};
