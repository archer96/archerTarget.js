jat.Target.prototype.checkClosestTarget = function (currentTarget, config) {

    var i,
        curCenterX,
        curCenterY,
        curRadius;
            
    for (i = 0; i < this.target.length; i = i + 1) {
                
        curCenterX = this.convertTo.canvas.x(this.target[i].center[0]);
        curCenterY = this.convertTo.canvas.y(this.target[i].center[1]);
        curRadius  = this.convertTo.canvas.x(this.target[i].diameter) / 2;

                
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