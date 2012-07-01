jat.Target.prototype.createArrows =  function (arrows) {
            
    var i, j,
        arrowClass,
        dragObjectDefaults = {
            height: 30,
            width: 5
        };
    
    arrows = arrows || [];

    this.arrowGroup = this.canvas.createGroup(false, {id: this.container.attr('id') + 'ArrowContainer' });

    this.canvas.canvas.appendChild(this.arrowGroup);
            
                        
    for (i = 0; i < arrows.length; i = i + 1) {
                
        arrows[i] = arrows[i] instanceof Array ? { data: arrows[i]} : arrows[i];
                
        arrows[i] = $.extend(true, {}, this.params.arrowDefaults, arrows[i]);
        
        
        if (arrows[i].draggable instanceof Object) {
            arrows[i].draggable = $.extend(true, dragObjectDefaults, arrows[i].draggable);
        }
                
        arrowClass = arrows[i].active ? '' : 'hidden';
                    
        arrows[i].element = this.canvas.createGroup(false, { id: $(this.container).attr('id') + 'ArrowSet_' + i, eleClass: 'arrowSetCanvas' + ' ' + arrowClass });
                
        
        for (j = 0; j < arrows[i].data.length; j = j + 1) {
                    
            
            if (!this.target[arrows[i].target]) { arrows[i].target = 0; }
                    
            arrows[i].data[j][3] = arrows[i].data[j][3] ? arrows[i].data[j][3] : arrows[i].target;
            
            if (!this.target[arrows[i].data[j][3]]) { arrows[i].data[j][3] = 0; }
                        
                    
            arrows[i].data[j][4] = this.canvas.createCircle({
                x: this.convertTo.px.x(arrows[i].data[j][0], arrows[i].data[j][3]),
                y: this.convertTo.px.y(arrows[i].data[j][1], arrows[i].data[j][3]),
                radius: arrows[i].radius,
                fill: arrows[i].style.initial.color,
                stroke: arrows[i].style.initial.stroke,
                eleClass: j
            });
            
            $(arrows[i].data[j][4]).css({
                opacity: arrows[i].style.initial.opacity
            });
            
            $(arrows[i].element).append(arrows[i].data[j][4]);
                    
        }
        
        this.arrowGroup.appendChild(arrows[i].element);

    }
    
    return arrows;
            
};