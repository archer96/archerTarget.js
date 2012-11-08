jat.Target.prototype.bindContainerTouchEvents =  function () {
            
    var self = this,
        hasMoved = false,
        touch;
            
    if (this.draggable) {

        var oldPageX,
            oldPageY,
            curPageX,
            curPageY,
            mouseDown = false,
            svg = this.container.find('svg')[0],

            move = function () {

                if (mouseDown) {
                                
                    self.transX = (curPageX - oldPageX) / self.zoom;
                    self.transY = (curPageY - oldPageY) / self.zoom;

                    hasMoved = true;
                        
                    self.setTransform();
                                
                    requestAnimationFrame(move);

                    self.container.trigger('targetMove.jArcherTarget', []);
                    
                }

            },

            onTouchMove = function (e) {
                            
                if (mouseDown) {

                    touch = e.originalEvent.touches[0];

                    curPageX = touch.pageX;
                    curPageY = touch.pageY;

                }        
                            
            },

            onTouchStart = function (e) {

                touch = e.originalEvent.touches[0];

                oldPageX = touch.pageX - self.transX * self.zoom;
                oldPageY = touch.pageY - self.transY * self.zoom;
                curPageX = touch.pageX;
                curPageY = touch.pageY;
                
                mouseDown = true;
                hasMoved  = false;
                      
                svg.style.cursor = 'move';

                cancelAnimationFrame(move);
                /*
                 * request a new animation frame
                 */
                requestAnimationFrame(move);

            },

            onTouchEnd = function (e) {
                            
                mouseDown = hasMoved = false;
                    
                svg.style.cursor = 'default';

            };



                
        this.container.on('touchmove', 'svg, .targetCanvas', onTouchMove)
            .on('touchstart', 'svg, .targetCanvas', onTouchStart)
            .on('touchend', 'svg, .targetCanvas', onTouchEnd);
                

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