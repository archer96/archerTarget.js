ArcherTarget.prototype.mergeStyles = function () {

	var self = this,
		options = self.options,
		style;

    /*
     * Merge every style with the inital style
     */
    for (style in options.targetDefaults.style) {
        if (options.targetDefaults.style.hasOwnProperty(style)) {
            options.targetDefaults.style[style] = $.extend(
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
            options.arrowDefaults.style[style] = $.extend(
                {},
                options.arrowDefaults.style.initial,
                options.arrowDefaults.style[style]
            );
        }
    }

};
