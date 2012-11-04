jat.Target.prototype.checkClosestTarget = function (currentTarget, config) {

    var i,
        curCenterX,
        curCenterY,
        curRadius,
        target = this.target[i],
        convertCanvas = this.convertTo.canvas,
        targetLength = this.target.length;

    for (i = 0; i < targetLength; i++) {

        curCenterX = (convertCanvas.x(target.center[0]) + this.transX) * this.zoom;
        curCenterY = (convertCanvas.y(target[i].center[1]) + this.transY) * this.zoom;
        curRadius  = convertCanvas.x(target[i].diameter) / 2  * this.zoom;

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