AT.prototype.mergeStyles = function () {

	var self = this,
		options = this.options,
		style;

    /*
     * Merge every style with the inital style
     */
    for (style in options.targetDefaults.style) {
        if (options.targetDefaults.style.hasOwnProperty(style)) {
            self.options.targetDefaults.style[style] = ArcherTarget.extend(
                true,
                {},
                options.targetDefaults.style.initial,
                options.targetDefaults.style[style]
            );
        }
    }
    /*
     * Merge every style with the inital style
     */
    for (style in options.arrowDefaults.style) {
        if (options.arrowDefaults.style.hasOwnProperty(style)) {
            self.options.arrowDefaults.style[style] = ArcherTarget.extend(
                true,
                {},
                options.arrowDefaults.style.initial,
                options.arrowDefaults.style[style]
            );
        }
    }

};
