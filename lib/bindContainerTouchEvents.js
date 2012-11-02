jat.Target.prototype.bindContainerTouchEvents =  function () {
            
    var self = this,
        mouseDown = false,
        oldPageX,
        oldPageY,
        hasMoved = false,
        touch;
            
    if (this.draggable) {
                
        this.container.on('touchmove', 'svg, .targetCanvas', function (e) {
  
            if (mouseDown) {
                        
                self.transX -= (oldPageX - e.pageX) / self.zoom;
                self.transY -= (oldPageY - e.pageY) / self.zoom;

                hasMoved = true;
                
                self.setTransform();
                        
                touch = e.originalEvent.touches[0];

                oldPageX = touch.pageX;
                oldPageY = touch.pageY;
            

                self.container.trigger('targetMove.jArcherTarget', []);
            }
                    
                    
        }).on('touchstart', 'svg, .targetCanvas', function (e) {

            touch = e.originalEvent.touches[0];

            oldPageX = touch.pageX;
            oldPageY = touch.pageY;
            
            mouseDown = true;
            hasMoved = false;
                    
            $(this).css({ cursor: 'move' });
                    
        }).on('touchend', 'svg, .targetCanvas', function (e) {
                    
            mouseDown = false;
                                                            
            $(this).css({ cursor: 'default' });

        });
                

    }
    
    this.container.on('touchstart touchend', function (e) {
        
        if (!hasMoved && !$(e.target).hasClass('archerTarget-zoomin') && !$(e.target).hasClass('archerTarget-zoomout')) {

            var x,
                y;

            if (e.type === 'touchstart') {

                touch = e.originalEvent.touches[0];
                
                x = touch.pageX - this.offsetLeft;
                y = touch.pageY - this.offsetTop;

            } else {

                x = e.originalEvent.x;
                y = e.originalEvent.y;

            }

            var tapTarget = self.checkClosestTarget(0, {
                    x: x,
                    y: y
                }),
                eventObject = [
                    /*
                     * Container/Canvas coordinates in percent
                     */
                    {
                        x: x / self.width * 100,
                        y: y / self.height * 100,
                        xPx: x,
                        yPx: y
                    },
                    /*
                     * Target coordinates + clicked target
                     */
                    {
                        x: self.convertTo.pc.x(x, tapTarget),
                        y: self.convertTo.pc.y(y, tapTarget),
                        target: tapTarget
                    },
                    e
                ];


            if (e.type === 'touchstart') {

                self.container.trigger('containerMousedown.jArcherTarget', eventObject);

            } else {

                self.container.trigger('containerTap.jArcherTarget', eventObject);

            }

        }

    });

    
            
};