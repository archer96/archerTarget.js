jat.Target.prototype.checkClosestTarget = function (currentTarget, config) {

    var self = this,
        i,
        curCenterX,
        curCenterY,
        curRadius,
        convert = self.convertTo,
        targetLength = self.target.length;

    for (i = 0; i < targetLength; i++) {

        var target = self.target[i];
        
        curCenterX = (convert.canvasX(target.center[0]) + self.transX) * self.zoom;
        curCenterY = (convert.canvasY(target.center[1]) + self.transY) * self.zoom;
        curRadius  = convert.canvasX(target.diameter) / 2  * self.zoom;

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