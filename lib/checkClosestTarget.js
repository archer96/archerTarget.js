jat.Target.prototype.checkClosestTarget = function (currentTarget, config) {

    var i,
        curCenterX,
        curCenterY,
        curRadius;
            
    for (i = 0; i < this.target.length; i++) {

        curCenterX = (this.convertTo.canvas.x(this.target[i].center[0]) + this.transX) * this.zoom;
        curCenterY = (this.convertTo.canvas.y(this.target[i].center[1]) + this.transY) * this.zoom;
        curRadius  = this.convertTo.canvas.x(this.target[i].diameter) / 2  * this.zoom;

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