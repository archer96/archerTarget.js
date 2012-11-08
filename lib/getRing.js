jat.Target.prototype.getRing = function (arrow) {
    
    var i, j;
    
    if (arrow) {
        
        return this.calculateRing({
            x: this.convertTo.px.x(arrow.x, arrow.target),
            y: this.convertTo.px.y(arrow.y, arrow.target),
            target: arrow.target
        });
        
        
    } else {
        
        for (i = 0; i < this.arrow.length; i++) {
            
            for (j = 0; j < this.arrow[i].data.length; j++) {

                var data = this.arrow[i].data[j];
                
                data.ring = this.calculateRing({
                    x: this.convertTo.px.x(data.x, data.target),
                    y: this.convertTo.px.y(data.y, data.target),
                    target: data.target
                });
                
            }
            
        }
        
        return this.arrow;
        
    }
    
};