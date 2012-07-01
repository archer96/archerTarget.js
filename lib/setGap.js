jat.Target.prototype.setGap = function () {
            
    var i;
            
    this.gap = [];

    for (i = 0; i < this.target.length; i = i + 1) {
    
        this.gap[i] = {
            top: this.convertTo.canvas.y(this.target[i].center[1] - (this.target[i].diameter / 2)),
            left: this.convertTo.canvas.x(this.target[i].center[0] - (this.target[i].diameter / 2))
        };
        
    }
};