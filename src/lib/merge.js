AT.prototype.mergeStyles = function () {

	var self        = this,
		options     = self.options,
		targetStyle = options.targetDefaults.style,
		arrowStyle  = options.arrowDefaults.style,
		style,
		property;

	/*
	 * Merge every style with the inital style
	 */
	for (style in targetStyle) {
		if (targetStyle.hasOwnProperty(style)) {

			for (property in targetStyle[style]) {
				if (targetStyle[style].hasOwnProperty(property)) {

					options.targetDefaults.style[style][property] =
						typeof(targetStyle[style][property]) !== 'undefined' ?
						targetStyle[style][property] : targetStyle.initial[property];

				}
			}

		}
	}
	/*
	 * Merge every style with the inital style
	 */
	for (style in arrowStyle) {
		if (arrowStyle.hasOwnProperty(style)) {

			for (property in arrowStyle[style]) {
				if (arrowStyle[style].hasOwnProperty(property)) {

					options.arrowDefaults.style[style][property] =
						typeof(arrowStyle[style][property]) !== 'undefined' ?
						arrowStyle[style][property] : arrowStyle.initial[property];

				}
			}

		}
	}

};
