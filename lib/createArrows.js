jat.Target.prototype.createArrows =  function (arrows) {
            
    var self = this,
        i,
        j,
        arrowClass,
        arrowsetClass,
        dragObjectDefaults = {
            height: 40,
            width: 5
        };
    
    arrows = arrows || [];

    this.arrowGroup = this.canvas.createGroup(false, {id: this.container.attr('id') + 'ArrowContainer' });

    this.canvas.canvas.appendChild(this.arrowGroup);
            
                        
    for (i = 0; i < arrows.length; i++) {
                
        arrows[i] = arrows[i] instanceof Array ? { data: arrows[i]} : arrows[i];
                
        arrows[i] = $.extend(true, {}, this.params.arrowDefaults, arrows[i]);
        
        
        if (arrows[i].draggable instanceof Object) {
            arrows[i].draggable = $.extend(true, {}, dragObjectDefaults, arrows[i].draggable);
        }
                
        
        arrows[i].element = this.canvas.createGroup(false, { id: $(this.container).attr('id') + 'ArrowSet_' + i, eleClass: 'arrowSetCanvas' });
                
        
        for (j = 0; j < arrows[i].data.length; j++) {
                    
            if (!this.target[arrows[i].target]) {
                arrows[i].target = 0;
            }
                    
            arrows[i].data[j].target = arrows[i].data[j].target ? arrows[i].data[j].target : arrows[i].target;
            
            if (!this.target[arrows[i].data[j].target]) {
                arrows[i].data[j].target = 0;
            }

            if (typeof(arrows[i].data[j].active) === 'undefined') {
                arrows[i].data[j].active = arrows[i].active;
            }

            arrowClass = arrows[i].data[j].active ? '' : ' hidden';
                    
            arrows[i].data[j].element = this.canvas.createCircle({
                x: this.convertTo.px.x(arrows[i].data[j].x, arrows[i].data[j].target),
                y: this.convertTo.px.y(arrows[i].data[j].y, arrows[i].data[j].target),
                radius: arrows[i].radius,
                fill: arrows[i].style.initial.color,
                stroke: arrows[i].style.initial.stroke,
                eleClass: j + arrowClass
            });
            
            $(arrows[i].data[j].element).css({
                opacity: arrows[i].style.initial.opacity
            });
            
            $(arrows[i].element).append(arrows[i].data[j].element);
                    
        }
        
        this.arrowGroup.appendChild(arrows[i].element);

    }
    
    DEVMODE && console.log('jAT ' + DEVNAME + ':: created arrowset(s) ', arrows);
    
    return arrows;
            
};