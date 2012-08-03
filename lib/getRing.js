jat.Target.prototype.getRing = function (arrow) {
    
    var i, j;
    
    if (arrow) {
        
        return this.calculateRing({
            x: this.convertTo.px.x(arrow.x, arrow.target),
            y: this.convertTo.px.y(arrow.y, arrow.target),
            target: arrow.target
        });
        
        
    } else {
        
        for (i = 0; i < this.arrow.length; i = i + 1) {
            
            for (j = 0; j < this.arrow[i].data.length; j = j + 1) {
                
                this.arrow[i].data[j].ring = this.calculateRing({
                    x: this.convertTo.px.x(this.arrow[i].data[j].x, this.arrow[i].data[j].target),
                    y: this.convertTo.px.y(this.arrow[i].data[j].y, this.arrow[i].data[j].target),
                    target: this.arrow[i].data[j].target
                });
                
            }
            
        }
        
        return this.arrow;
        
    }
    
};