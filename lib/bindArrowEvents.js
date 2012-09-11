jat.Target.prototype.bindArrowEvents = function (touch) {
    
    var self = this,
        i,
        mouseDown = false,
        oldPageX,
        oldPageY,
        arrowTempElement,
        arrowTemp,
        arrowTempID,
        arrowSetTemp,
        arrowSetTempID,
        arrowRingTemp,
        tempID,
        x,
        y,
        dragHeight = 0;
            
    
    this.container.on('mousemove', function (e) {
                    
        if (mouseDown && arrowSetTemp.draggable) {
                        
            x = e.pageX - this.offsetLeft;
            y = e.pageY - this.offsetTop;
                        
                        
            arrowTempElement.setPosition({
                x: x,
                y: y
            });
                
            
            if (arrowSetTemp.draggable instanceof Object) {
                
                self.setArrowPointer({
                    x: x,
                    y: y,
                    drag: arrowSetTemp.draggable,
                    arrowRadius: arrowSetTemp.radius
                });
                
            }
            
            
            arrowRingTemp = self.calculateRing({
                x: x,
                y: y - dragHeight,
                target: arrowTemp.target
            });
                      
                        
            arrowTemp.x = self.convertTo.pc.x(x, arrowTemp.target);
            arrowTemp.y = self.convertTo.pc.y(y - dragHeight, arrowTemp.target);
            arrowTemp.ring = arrowRingTemp;
                        

            if (self.checkOnTarget(arrowTemp, {x: x, y: y})) {
                                                    
                tempID = self.checkClosestTarget(arrowTemp.target, {x: x, y: y});
                            
                if (arrowTemp.target !== tempID) {
                                
                    arrowTemp.target = tempID;
                                
                    self.setTargetStyle("arrow", { active: arrowTemp.target });
                    
                }
            }
                        
            oldPageX = e.pageX;
            oldPageY = e.pageY;
            
            
            /* Save temp data into arrow array */
            self.arrow[arrowSetTempID] = arrowSetTemp;
            self.arrow[arrowSetTempID].data[arrowTempID] = arrowTemp;
            
                        
            $(arrowTempElement).trigger('arrowMove.jArcherTarget', [arrowSetTempID, arrowTempID, self.arrow]);
                                        
        }
                    
        return false;
                    
                    
    });
	
	$('#' + this.container.attr('id') + ' .arrowSetCanvas').on('mousedown mouseover', 'circle', function (e) {
                 
        if (!mouseDown) {
              
            arrowTempElement = this;
                    
            arrowSetTempID = parseInt(arrowTempElement.parentNode.id.substr(arrowTempElement.parentNode.id.indexOf('_') + 1), 10);
            arrowSetTemp = self.arrow[arrowSetTempID];
                        
            if ($(this).attr('class').indexOf(' ') === -1) {

                arrowTempID = parseInt($(this).attr('class'), 10);

            } else {

                arrowTempID = parseInt($(this).attr('class').substr(0, $(this).attr('class').indexOf(' ')), 10);

            }

            arrowTemp = arrowSetTemp.data[arrowTempID]; 

        }
                    
        if (e.type === 'mousedown') {
                    
            
            var x = e.pageX,
                y = e.pageY;
        
            
            mouseDown = self.arrowDrag = true;
                            
            
            self.setTargetStyle("arrow", { active: arrowTemp.target });
                    
            $(self.container).css({ cursor: 'move' });
                        
            arrowTempElement.setAttribute('fill', arrowSetTemp.style.selected.color);

            $(arrowTempElement).css({
                opacity: arrowSetTemp.style.selected.opacity
            }).trigger('arrowSelect.jArcherTarget', [arrowSetTempID, arrowTempID, self.arrow]);
    
            
            
            if (arrowSetTemp.draggable instanceof Object) {
                
                self.createArrowPointer({
                    x: self.convertTo.px.x(arrowTemp.x, arrowTemp.target),
                    y: self.convertTo.px.y(arrowTemp.y, arrowTemp.target),
                    drag: arrowSetTemp.draggable,
                    color: arrowSetTemp.style.selected.color,
                    arrowRadius: arrowSetTemp.radius
                });
                
                dragHeight = arrowSetTemp.draggable.height + arrowSetTemp.radius;
                
                
            } else {
                
                dragHeight = 0;
                
            }
            
                    
            oldPageX = e.pageX;
            oldPageY = e.pageY;
                    
                               
        } else if (e.type === 'mouseover') {
                    
            if (!mouseDown) {
                
                arrowTempElement.setAttribute('fill', arrowSetTemp.style.hover.color);
                        
                $(arrowTempElement).css({
                    opacity: arrowSetTemp.style.hover.opacity
                }).trigger('arrowOver.jArcherTarget', [arrowSetTempID, arrowTempID]);
                
            }
                                        
        }
                    
        return false;
                    
                    
    }).on('mouseup mouseout click', 'circle', function (e) {
                    
                    
        if (e.type === 'mouseup') {
                        
            self.setTargetStyle("initial");
                        
            arrowTempElement.setAttribute('fill', arrowSetTemp.style.hover.color);
                    
            
            if (arrowSetTemp.draggable instanceof Object) {
                
                self.removeArrowPointer();
                
                arrowTempElement.setPosition({
                    x: self.convertTo.px.x(arrowTemp.x, arrowTemp.target),
                    y: self.convertTo.px.y(arrowTemp.y, arrowTemp.target)
                });
                
            }
            

            $(self.container).css({
                cursor: 'default'
            }).trigger('arrowClick.jArcherTarget', [arrowSetTempID, arrowTempID, self.arrow]).trigger('arrowDeselect.jArcherTarget', [arrowSetTempID, arrowTempID, self.arrow]);
                        
                        
            mouseDown = self.arrowDrag = false;
    
                            
        } else if (e.type === 'mouseout') {
                        
            if (!mouseDown || !arrowSetTemp.draggable) {
                        
                arrowTempElement.setAttribute('fill', arrowSetTemp.style.initial.color);
                            

                $(arrowTempElement).css({
                    opacity: arrowSetTemp.style.initial.opacity
                }).trigger('arrowOut.jArcherTarget', [arrowSetTempID, arrowTempID]);
                        

                mouseDown = self.arrowDrag = arrowTempElement = arrowSetTempID = arrowSetTemp = arrowTempID = arrowTemp = false;

            }
                            
        }
                    
        return false;
                    
                    
    });
            
};