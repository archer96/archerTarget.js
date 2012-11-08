jat.Target.prototype.checkClosestTarget = function (currentTarget, config) {

    var self = this,
        i,
        curCenterX,
        curCenterY,
        curRadius,
        convertCanvas = self.convertTo.canvas,
        targetLength = self.target.length;

    for (i = 0; i < targetLength; i++) {

        var target = self.target[i];
        
        curCenterX = (convertCanvas.x(target.center[0]) + self.transX) * self.zoom;
        curCenterY = (convertCanvas.y(target.center[1]) + self.transY) * self.zoom;
        curRadius  = convertCanvas.x(target.diameter) / 2  * self.zoom;

        if (config.x > curCenterX - curRadius &&
            config.x < curCenterX + curRadius &&
            config.y > curCenterY - curRadius &&
            config.y < curCenterY + curRadius
           ) {
            return i;
        }
    }
    
    return currentTarget;
            
};