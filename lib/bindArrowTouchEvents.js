jat.Target.prototype.bindArrowTouchEvents = function () {

    var self = this,
        i,
        arrowTmp = {},
        arrowsetTmp = {},
        touchX,
        touchY,
        pointerHeight = 0;
            
    
    this.container.on('touchmove', function (e) {

        if (e.originalEvent.touches.length == 1 && touchX && touchY && self.arrowMoving && arrowsetTmp.data.draggable) {
                        
            var touch = e.originalEvent.touches[0];

            touchX = touch.pageX - this.offsetLeft;
            touchY = touch.pageY - this.offsetTop;
            
                       
            arrowTmp.element.setPosition({
                x: touchX,
                y: touchY
            });
                
            
            if (arrowsetTmp.data.draggable instanceof Object) {
                
                self.setArrowPointer({
                    x: touchX,
                    y: touchY,
                    drag: arrowsetTmp.data.draggable,
                    arrowRadius: arrowsetTmp.data.radius
                });
                
            }
            
            
            arrowTmp.ring = self.calculateRing({
                x: touchX,
                y: touchY - pointerHeight,
                target: arrowTmp.data.target
            });
                      
                        
            arrowTmp.data.x = self.convertTo.pc.x(touchX, arrowTmp.data.target);
            arrowTmp.data.y = self.convertTo.pc.y(touchY - pointerHeight, arrowTmp.data.target);
            arrowTmp.data.ring = arrowTmp.ring;
                        

            if (self.checkOnTarget(arrowTmp.data, {x: touchX, y: touchY})) {
                                                    
                arrowTmp.target = self.checkClosestTarget(arrowTmp.data.target, {x: touchX, y: touchY});
                            
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
    
    this.container.find('.arrowSetCanvas').on('touchstart', 'circle', function (e) {

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
        
        DEVMODE && console.log('jAT ' + DEVNAME + ':: touchstart on arrow ', arrowTmp);

        if (!e.originalEvent && arguments[1]) {
            e.originalEvent = arguments[1].originalEvent;
        }

        var touches = e.originalEvent.touches;

        touchX = e.originalEvent.touches[0].pageX - this.offsetLeft;
        touchY = e.originalEvent.touches[0].pageY - this.offsetTop;


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
            
               
        return false;
                    
                    
    });

    this.container.on('touchend', function (e) {

        if (self.arrowMoving) {

            DEVMODE && console.log('jAT ' + DEVNAME + ':: touchend on arrow ', arrowTmp);

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
        
            return false;

        }

    });

};