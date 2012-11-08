jat.Target.prototype.bindArrowTouchEvents = function () {

    var self = this,
        i,
        arrowTmp = {},
        arrowsetTmp = {},
        arrowTarget,
        curPageX,
        curPageY,
        offsetLeft = this.container[0].offsetLeft,
        offsetTop = this.container[0].offsetTop,
        pointerHeight = 0,
        touches,
        touch;

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

        onTouchMove = function (e) {

            if (self.arrowMoving) {

                touch = e.originalEvent.touches[0];

                curPageX = touch.pageX - offsetLeft;
                curPageY = touch.pageY - offsetTop;

            }

            return false;

        },

        onTouchStart = function (e) {

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

            DEVMODE && console.log('jAT ' + DEVNAME + ':: touchstart on arrow ', arrowTmp);
         
            if (!e.originalEvent && arguments[1]) {
                e.originalEvent = arguments[1].originalEvent;
            }


            touches = e.originalEvent.touches;

            curPageX = touches[0].pageX - offsetLeft;
            curPageY = touches[0].pageY - offsetTop;


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


            if (touches.length == 1 && arrowsetTmp.data.draggable) {
    
                cancelAnimationFrame(move);
                /*
                 * request a new animation frame
                 */
                requestAnimationFrame(move);

            }
            
            return false;
           
        },

        onTouchEnd = function (e) {

            if (self.arrowMoving) {
                            
                DEVMODE && console.log('jAT ' + DEVNAME + ':: touchend on arrow ', arrowTmp);


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

                self.container.trigger('arrowClick.jArcherTarget', [arrowsetTmp.id, arrowTmp.id, self.arrow])
                  .trigger('arrowDeselect.jArcherTarget', [arrowsetTmp.id, arrowTmp.id, self.arrow]);
                            
                                
            }

            return false;

        };

            
    
    this.container.on('touchmove', onTouchMove)
        .on('touchend', onTouchEnd)
        .find('.arrowSetCanvas').on('touchstart', 'circle', onTouchStart);


};