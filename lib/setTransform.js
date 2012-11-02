jat.Target.prototype.setTransform = function (x, y, zoom) {

    if (!x && x !== 0) { x = this.transX; } else { this.transX = x; }
    if (!y && y !== 0) { y = this.transY; } else { this.transY = y; }
    if (!zoom) { zoom = this.zoom; } else { this.zoom = zoom; }

    this.canvas.applyTransformParams(zoom, x, y);

    this.setArrowPosition();

};