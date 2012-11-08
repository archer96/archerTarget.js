jat.Target.prototype.setGap = function () {
            
    var i;
            
    this.gap = [];

    this.clearConverterCache();
    
    for (i = 0; i < this.target.length; i++) {
    
        var target = this.target[i];

        this.gap[i] = {
			
			/* Attention: converting the target radius using the x-axe; otherwise an error will occur */
            top: this.convertTo.canvas.y(target.center[1]) - this.convertTo.canvas.x(target.diameter / 2),
			
            left: this.convertTo.canvas.x(target.center[0] - (target.diameter / 2))
        };
        
    }
};

