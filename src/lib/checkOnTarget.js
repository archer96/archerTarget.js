/**
 * Checks if the arrow is on the target.
 * @param  {Object} arrow
 * @param  {Object} arrow.x          Position on the x axe.
 * @param  {Object} arrow.y          Position on the y axe.
 * @param  {Object} config
 * @param  {Object} config.tolerance Tolerance in percent.
 * @return {Boolean}
 */
AT.prototype.checkOnTarget = function (arrow, config) {

	/*
	 * Check if there is more than one target.
	 * If there's only one target, we'll return that the arrow is on the target.
	 */
	if (this.targetList.length <= 1) {

		return true;

	}

	var thisConfig = (!config || !config.tolerance) ? { tolerance: 5 } : config;

	/*
	 * Check if the arrow is on the target.
	 */
	if (arrow.x > 100 + thisConfig.tolerance ||
		arrow.y > 100 + thisConfig.tolerance ||
		arrow.x < -thisConfig.tolerance ||
		arrow.y < -thisConfig.tolerance
		) {

		return false;

	}

	return true;

};
