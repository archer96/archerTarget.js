jat.Target.prototype.checkOnTarget = function (arrow, config) {
    
    if (this.target.length >= 1) {
        
        return true;
        
    }
    
    if (arrow.x > 100 + config.tolerance ||
            arrow.y > 100 + config.tolerance ||
            arrow.x < -config.tolerance ||
            arrow.y < -config.tolerance
            ) {
                                                    
        return false;
        
    }
    
};