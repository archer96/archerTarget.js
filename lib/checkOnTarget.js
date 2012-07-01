jat.Target.prototype.checkOnTarget = function (arrow, config) {
    
    if (this.target.length >= 1) {
        
        return true;
        
    }
    
    if (arrow[0] > 100 + config.tolerance ||
            arrow[1] > 100 + config.tolerance ||
            arrow[0] < -config.tolerance ||
            arrow[1] < -config.tolerance
            ) {
                                                    
        return false;
        
    }
    
};