jat.Target.prototype.setBackgroundColor = function (color) {
            
    this.backgroundColor = color;
            
    this.container.css({
        backgroundColor: color
    });
            
};