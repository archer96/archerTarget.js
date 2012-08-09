jat.Target.prototype.createArrowDrag = function (config) {

    this.dragMark = {};
    
    this.dragMark.element = this.canvas.createGroup(false, { id: $(this.container).attr('id') + 'ArrowDrag' });
    
    
    this.dragMark.rect = this.canvas.createRect({
        x: config.x - config.drag.width / 2,
        y: config.y - config.drag.height - config.arrowRadius,
        width: config.drag.width,
        height: config.drag.height,
        fill: config.color
    });
    
    this.dragMark.element.appendChild(this.dragMark.rect);
    
    
    
    this.dragMark.circle = this.canvas.createCircle({
        x: config.x,
        y: config.y - config.drag.height - config.arrowRadius,
        radius: config.drag.width,
        fill: config.color,
        stroke: false,
        eleClass: false
    });

    this.dragMark.element.appendChild(this.dragMark.circle);
    
    
    this.canvas.canvas.appendChild(this.dragMark.element);
           
};