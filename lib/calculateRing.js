jat.Target.prototype.calculateRing =  function (config) {

    var i,
        distanceToCenter = {
            x: 0,
            y: 0,
            diagonal: 0
        },
        targetTemp = {
            x: (this.convertTo.canvas.x(this.target[config.target].center[0]) + this.transX) * this.zoom,
            y: (this.convertTo.canvas.y(this.target[config.target].center[1]) + this.transY) * this.zoom,
            radius: this.convertTo.canvas.x(this.target[config.target].diameter) / 2 * this.zoom,
            numberRings: jat.Target.targets[this.target[config.target].name].numberRings
        },
        currentTarget = jat.Target.targets[this.target[config.target].name];
            
            
            
    if (config.x >= targetTemp.x) {
                
        distanceToCenter.x = targetTemp.x - config.x;
                
    } else {
                
        distanceToCenter.x = config.x - targetTemp.x;
                
    }
            
            
    if (config.y >= targetTemp.y) {
                
        distanceToCenter.y = config.y - targetTemp.y;
                
    } else {
                
        distanceToCenter.y = targetTemp.y - config.y;
                
    }
            
            
    if (distanceToCenter.x === 0 && distanceToCenter.y === 0) {
                
        distanceToCenter.diagonal = 0;
                    
    } else {
                
        distanceToCenter.diagonal = Math.sqrt(Math.pow(distanceToCenter.x, 2) + Math.pow(distanceToCenter.y, 2));
                
    }
            
            
    if (distanceToCenter.diagonal <= targetTemp.radius + 1) {
                
        for (i = targetTemp.numberRings - 1; i >= 0; i--) {
                    
            if (distanceToCenter.diagonal <= this.convertTo.canvas.x(currentTarget.diameters[i], this.target[config.target].diameter) / 2 * this.zoom + 1) {
                        
                return currentTarget.rating[i];
                        
            }
        }
                
    } else {
                
        return 0;
                
    }

};