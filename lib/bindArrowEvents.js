jat.Target.prototype.bindArrowEvents = function () {
    
    var self = this,
        i,
        arrowTmp = {},
        arrowsetTmp = {},
        arrowTarget,
        curPageX,
        curPageY,
        offsetLeft = this.container.offset().left,
        offsetTop = this.container.offset().top,
        pointerHeight = 0;

    self.arrowMoving = false;

    var move = function () {

            if (self.arrowMoving && arrowsetTmp.data.draggable) {
                            
                arrowTmp.element.setPosition({
                    x: curPageX,
                    y: curPageY
                });
                        
                if (arrowsetTmp.data.draggable instanceof Object) {
                    
                    self.setArrowPointer({
                        x: curPageX,
                        y: curPageY,
                        drag: arrowsetTmp.data.draggable,
                        arrowRadius: arrowsetTmp.data.radius
                    });
                    
                }
                
                arrowTmp.ring = self.calculateRing({
                    x: curPageX,
                    y: curPageY - pointerHeight,
                    target: arrowTarget
                });
                          
                            
                arrowTmp.data.x = self.convertTo.pcX(curPageX, arrowTarget);
                arrowTmp.data.y = self.convertTo.pcY(curPageY - pointerHeight, arrowTarget);
                arrowTmp.data.ring = arrowTmp.ring;
                            

                if (self.checkOnTarget(arrowTmp.data, {x: curPageX, y: curPageY})) {
                                                        
                    var tmpTarget = self.checkClosestTarget(arrowTarget, {x: curPageX, y: curPageY});
                                
                    if (arrowTarget !== tmpTarget) {
                                    
                        arrowTmp.data.target = arrowTarget = tmpTarget;
                        
                        self.setTargetStyle("arrow", { active: arrowTarget });
                        
                    }
                }
                            
                
                /* Save temp data to arrow array */
                self.arrow[arrowsetTmp.id] = arrowsetTmp.data;
                self.arrow[arrowsetTmp.id].data[arrowTmp.id] = arrowTmp.data;
                
                requestAnimationFrame(move);

                $(arrowTmp.element).trigger('arrowMove.jArcherTarget', [arrowsetTmp.id, arrowTmp.id, self.arrow]);
                                  
            }

        },

        onMouseMove = function (e) {

            if (self.arrowMoving) {

                curPageX = e.pageX - offsetLeft;
                curPageY = e.pageY - offsetTop;

            }

            return false;

        },

        onMouseDown = function (e) {

            if (!self.arrowMoving) {
                  
                arrowTmp.element = this;
                        
                arrowsetTmp.id = parseInt(arrowTmp.element.parentNode.id.substr(arrowTmp.element.parentNode.id.indexOf('_') + 1), 10);
                arrowsetTmp.data = self.arrow[arrowsetTmp.id];
                arrowTarget = arrowsetTmp.data.target;
                            
                if ($(this).attr('class').indexOf(' ') === -1) {

                    arrowTmp.id = parseInt($(this).attr('class'), 10);

                } else {

                    arrowTmp.id = parseInt($(this).attr('class').substr(0, $(this).attr('class').indexOf(' ')), 10);

                }

                arrowTmp.data = arrowsetTmp.data.data[arrowTmp.id];

            }
                        
            if (e.type === 'mousedown') {
                
                /*
                 * Self triggered mousedown events don't have the pageX and pageY attribute, so we use the old arrow-position.
                 */
                curPageX = e.pageX - offsetLeft || self.convertTo.pxX(arrowTmp.data.x, arrowTarget);
                curPageY = e.pageY - offsetTop || self.convertTo.pxY(arrowTmp.data.y, arrowTarget);
                
                self.arrowMoving = true;

                                
                if (arrowsetTmp.data.draggable) {

                    self.setTargetStyle("arrow", { active: arrowTarget });
                    
                    self.container[0].style.cursor = 'move';
                          
                }

                arrowTmp.element.setAttribute('fill', arrowsetTmp.data.style.selected.color);

                $(arrowTmp.element).css({
                    opacity: arrowsetTmp.data.style.selected.opacity
                }).trigger('arrowSelect.jArcherTarget', [arrowsetTmp.id, arrowTmp.id, self.arrow]);
        
                
                
                if (arrowsetTmp.data.draggable instanceof Object && arrowsetTmp.data.draggable) {
                    
                    self.createArrowPointer({
                        x: self.convertTo.pxX(arrowTmp.data.x, arrowTarget),
                        y: self.convertTo.pxY(arrowTmp.data.y, arrowTarget),
                        drag: arrowsetTmp.data.draggable,
                        color: arrowsetTmp.data.style.selected.color,
                        arrowRadius: arrowsetTmp.data.radius
                    });
                    
                    pointerHeight = arrowsetTmp.data.draggable.height + arrowsetTmp.data.radius;
                    
                    
                } else {
                    
                    pointerHeight = 0;
                    
                }


                cancelAnimationFrame(move);
                /*
                 * request a new animation frame
                 */
                requestAnimationFrame(move);

                
                                   
            } else if (e.type === 'mouseover' && !self.arrowMoving) {
                        
                arrowTmp.element.setAttribute('fill', arrowsetTmp.data.style.hover.color);
                            
                $(arrowTmp.element).css({
                    opacity: arrowsetTmp.data.style.hover.opacity
                }).trigger('arrowOver.jArcherTarget', [arrowsetTmp.id, arrowTmp.id]);

                                            
            }
                        
            return false;
           

        },

        onMouseUp = function (e) {

            if (self.arrowMoving) {
                
                self.arrowMoving = false;
        
                self.setTargetStyle("initial");
                            
                arrowTmp.element.setAttribute('fill', arrowsetTmp.data.style.hover.color);
                        
                
                if (arrowsetTmp.data.draggable instanceof Object) {
                    
                    self.removeArrowPointer();
                    
                    arrowTmp.element.setPosition({
                        x: self.convertTo.pxX(arrowTmp.data.x, arrowTarget),
                        y: self.convertTo.pxY(arrowTmp.data.y, arrowTarget)
                    });
                    
                }
            
                self.container[0].style.cursor = 'default';

                $(self.container).trigger('arrowDeselect.jArcherTarget', [arrowsetTmp.id, arrowTmp.id, self.arrow]);
                            
                                
            }

            return false;

        },

        onMouseOut = function (e) {

            if (!self.arrowMoving || !arrowsetTmp.data.draggable) {
                            
                arrowTmp.element.setAttribute('fill', arrowsetTmp.data.style.initial.color);
                              
                $(arrowTmp.element).css({
                    opacity: arrowsetTmp.data.style.initial.opacity
                }).trigger('arrowOut.jArcherTarget', [arrowsetTmp.id, arrowTmp.id]);

            }

            return false;

        };
            
    
    this.container.on('mousemove', onMouseMove)
        .on('mouseup click', onMouseUp)
        .find('.arrowSetCanvas')
        .on('mouseout', 'circle', onMouseOut)
        .on('mousedown mouseover', 'circle', onMouseDown);



};