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
                
                this.arrow[i].data[j][2] = this.calculateRing({
                    x: this.convertTo.px.x(this.arrow[i].data[j][0], this.arrow[i].data[j][3]),
                    y: this.convertTo.px.y(this.arrow[i].data[j][1], this.arrow[i].data[j][3]),
                    target: this.arrow[i].data[j][3]
                });
                
            }
            
        }
        
        return this.arrow;
        
    }
    
};