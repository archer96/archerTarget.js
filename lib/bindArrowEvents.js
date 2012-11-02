jat.Target.prototype.bindArrowEvents = function () {
    
    var self = this,
        i,
        arrowTmp = {},
        arrowsetTmp = {},
        x,
        y,
        pointerHeight = 0;
            
    
    this.container.on('mousemove', function (e) {
                    
        if (self.arrowMoving && arrowsetTmp.data.draggable) {
                        
            x = e.pageX - this.offsetLeft;
            y = e.pageY - this.offsetTop;
                        
                       
            arrowTmp.element.setPosition({
                x: x,
                y: y
            });
                
            
            if (arrowsetTmp.data.draggable instanceof Object) {
                
                self.setArrowPointer({
                    x: x,
                    y: y,
                    drag: arrowsetTmp.data.draggable,
                    arrowRadius: arrowsetTmp.data.radius
                });
                
            }
            
            
            arrowTmp.ring = self.calculateRing({
                x: x,
                y: y - pointerHeight,
                target: arrowTmp.data.target
            });
                      
                        
            arrowTmp.data.x = self.convertTo.pc.x(x, arrowTmp.data.target);
            arrowTmp.data.y = self.convertTo.pc.y(y - pointerHeight, arrowTmp.data.target);
            arrowTmp.data.ring = arrowTmp.ring;
                        

            if (self.checkOnTarget(arrowTmp.data, {x: x, y: y})) {
                                                    
                arrowTmp.target = self.checkClosestTarget(arrowTmp.data.target, {x: x, y: y});
                            
                if (arrowTmp.data.target !== arrowTmp.target) {
                                
                    arrowTmp.data.target = arrowTmp.target;
                                
                    self.setTargetStyle("arrow", { active: arrowTmp.data.target });
                    
                }
            }
                        
            
            /* Save temp data to arrow array */
            self.arrow[arrowsetTmp.id] = arrowsetTmp.data;
            self.arrow[arrowsetTmp.id].data[arrowTmp.id] = arrowTmp.data;
            
                        
            $(arrowTmp.element).trigger('arrowMove.jArcherTarget', [arrowsetTmp.id, arrowTmp.id, self.arrow]);
                                        
        }
                    
        return false;
                    
                    
    });
    
    this.container.find('.arrowSetCanvas').on('mousedown mouseover', 'circle', function (e) {

        if (!self.arrowMoving) {
              
            arrowTmp.element = this;
                    
            arrowsetTmp.id = parseInt(arrowTmp.element.parentNode.id.substr(arrowTmp.element.parentNode.id.indexOf('_') + 1), 10);
            arrowsetTmp.data = self.arrow[arrowsetTmp.id];
                        
            if ($(this).attr('class').indexOf(' ') === -1) {

                arrowTmp.id = parseInt($(this).attr('class'), 10);

            } else {

                arrowTmp.id = parseInt($(this).attr('class').substr(0, $(this).attr('class').indexOf(' ')), 10);

            }

            arrowTmp.data = arrowsetTmp.data.data[arrowTmp.id];

        }
                    
        if (e.type === 'mousedown') {
                    
            
            x = e.pageX - this.offsetLeft;
            y = e.pageY - this.offsetTop;
            
            self.arrowMoving = true;
                            
            if (arrowsetTmp.data.draggable) {

                self.setTargetStyle("arrow", { active: arrowTmp.data.target });
                
                $(self.container).css({ cursor: 'move' });
                      
            }

            arrowTmp.element.setAttribute('fill', arrowsetTmp.data.style.selected.color);

            $(arrowTmp.element).css({
                opacity: arrowsetTmp.data.style.selected.opacity
            }).trigger('arrowSelect.jArcherTarget', [arrowsetTmp.id, arrowTmp.id, self.arrow]);
    
            
            
            if (arrowsetTmp.data.draggable instanceof Object && arrowsetTmp.data.draggable) {
                
                self.createArrowPointer({
                    x: self.convertTo.px.x(arrowTmp.data.x, arrowTmp.data.target),
                    y: self.convertTo.px.y(arrowTmp.data.y, arrowTmp.data.target),
                    drag: arrowsetTmp.data.draggable,
                    color: arrowsetTmp.data.style.selected.color,
                    arrowRadius: arrowsetTmp.data.radius
                });
                
                pointerHeight = arrowsetTmp.data.draggable.height + arrowsetTmp.data.radius;
                
                
            } else {
                
                pointerHeight = 0;
                
            }
            
                               
        } else if (e.type === 'mouseover') {
                    
            if (!self.arrowMoving) {
                
                arrowTmp.element.setAttribute('fill', arrowsetTmp.data.style.hover.color);
                        
                $(arrowTmp.element).css({
                    opacity: arrowsetTmp.data.style.hover.opacity
                }).trigger('arrowOver.jArcherTarget', [arrowsetTmp.id, arrowTmp.id]);
                
            }
                                        
        }
                    
        return false;
                    
                    
    }).on('mouseup mouseout click', 'circle', function (e) {
                    
                    
        if (e.type === 'mouseup') {
                        
            self.setTargetStyle("initial");
                        
            arrowTmp.element.setAttribute('fill', arrowsetTmp.data.style.hover.color);
                    
            
            if (arrowsetTmp.data.draggable instanceof Object) {
                
                self.removeArrowPointer();
                
                arrowTmp.element.setPosition({
                    x: self.convertTo.px.x(arrowTmp.data.x, arrowTmp.data.target),
                    y: self.convertTo.px.y(arrowTmp.data.y, arrowTmp.data.target)
                });
                
            }
            

            $(self.container).css({
                cursor: 'default'
            }).trigger('arrowClick.jArcherTarget', [arrowsetTmp.id, arrowTmp.id, self.arrow])
              .trigger('arrowDeselect.jArcherTarget', [arrowsetTmp.id, arrowTmp.id, self.arrow]);
                        
                        
            self.arrowMoving = false;
    
                            
        } else if (e.type === 'mouseout') {
                        
            if (!self.arrowMoving || !arrowsetTmp.data.draggable) {
                        
                arrowTmp.element.setAttribute('fill', arrowsetTmp.data.style.initial.color);
                            

                $(arrowTmp.element).css({
                    opacity: arrowsetTmp.data.style.initial.opacity
                }).trigger('arrowOut.jArcherTarget', [arrowsetTmp.id, arrowTmp.id]);


                self.arrowMoving = false;

            }

        }

        return false;


    });

};