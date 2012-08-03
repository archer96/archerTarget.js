jat.Target.prototype.setArrows = function () {
            
    var i, j;
            
    for (i = 0; i < this.arrow.length; i = i + 1) {

        for (j = 0; j < this.arrow[i].data.length; j = j + 1) {

            this.arrow[i].data[j].element.setPosition({
                x: (this.convertTo.px.x(this.arrow[i].data[j].x, this.arrow[i].data[j].target)),
                y: (this.convertTo.px.y(this.arrow[i].data[j].y, this.arrow[i].data[j].target))
            });
        }
    }
};