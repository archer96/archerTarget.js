jat.Target.prototype.transX = 0;
jat.Target.prototype.transY = 0;

jat.Target.prototype.applyTransform = function () {
            
    this.canvas.applyTransformParams(this.zoom, this.transX, this.transY);
            
    this.setArrows();

};