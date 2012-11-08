jat.Target.prototype.createArrows =  function (arrows) {
            
    var self = this,
        i, j,
        arrowClass,
        arrowsetClass,
        dragObjectDefaults = {
            height: 40,
            width: 5
        };
    
    if (!arrows) { arrows = []; }

    self.arrowGroup = self.canvas.createGroup(false, {id: self.container.attr('id') + 'ArrowContainer' });

    self.canvas.canvas.appendChild(self.arrowGroup);
            
                        
    var arrowLength = arrows.length;

    for (i = 0; i < arrowLength; i++) {

        arrows[i] = arrow instanceof Array ? { data: arrows[i]} : arrows[i];
                
        arrows[i] = $.extend(true, {}, self.params.arrowDefaults, arrows[i]);
        
        var arrow = arrows[i];
                
        
        if (arrow.draggable instanceof Object) {
            arrow.draggable = $.extend(true, {}, dragObjectDefaults, arrow.draggable);
        }
                
        
        arrow.element = self.canvas.createGroup(false, { id: $(self.container).attr('id') + 'ArrowSet_' + i, eleClass: 'arrowSetCanvas' });
                

        var dataLength = arrow.data.length;

        for (j = 0; j < dataLength; j++) {

            var arrowData = arrow.data[j];
                    
            if (!self.target[arrow.target]) {
                arrow.target = 0;
            }
                    
            arrowData.target = arrowData.target ? arrowData.target : arrow.target;
            
            if (!self.target[arrowData.target]) {
                arrowData.target = 0;
            }

            if (typeof(arrowData.active) === 'undefined') {
                arrowData.active = arrow.active;
            }

            arrowClass = arrowData.active ? '' : ' hidden';
                    
            arrowData.element = self.canvas.createCircle({
                x: self.convertTo.pxX(arrowData.x, arrowData.target),
                y: self.convertTo.pxY(arrowData.y, arrowData.target),
                radius: arrow.radius,
                fill: arrow.style.initial.color,
                stroke: arrow.style.initial.stroke,
                eleClass: j + arrowClass
            });
            
            $(arrowData.element).css({
                opacity: arrow.style.initial.opacity
            });
            
            $(arrow.element).append(arrowData.element);
                    
        }
        
        self.arrowGroup.appendChild(arrow.element);

    }
    
    DEVMODE && console.log('jAT ' + DEVNAME + ':: created arrowset(s) ', arrows);
    
    return arrows;
            
};