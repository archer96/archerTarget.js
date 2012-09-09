/**
 * Checks if the arrow is on the target.
 * @param  {Object} arrow
 * @param  {Object} arrow.x          Position on the x axe.
 * @param  {Object} arrow.y          Position on the y axe.
 * @param  {Object} config
 * @param  {Object} config.tolerance Tolerance in percent.
 * @return {Boolean}
 */
jat.Target.prototype.checkOnTarget = function (arrow, config) {
    
    /*
     * Check if there is more than one target.
     * If there's only one target, we'll return that the arrow is on the target.
     */
    if (this.target.length >= 1) {
        
        return true;
        
    }
    
    /*
     * Check if the arrow is on the target.
     */
    if (arrow.x > 100 + config.tolerance ||
        arrow.y > 100 + config.tolerance ||
        arrow.x < -config.tolerance ||
        arrow.y < -config.tolerance
       ) {
                                                    
        return false;
        
    }

    return true;
    
};