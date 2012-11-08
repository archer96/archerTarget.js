jat.Target.prototype.bindContainerEvents =  function () {
            
    var self = this,
        hasMoved = false;

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

            onMouseMove = function (e) {
                            
                if (mouseDown) {
                                
                    curPageX = e.pageX;
                    curPageY = e.pageY;

                }        
                            
            },

            onMouseDown = function (e) {

                oldPageX = e.pageX - self.transX * self.zoom;
                oldPageY = e.pageY - self.transY * self.zoom;
                curPageX = e.pageX;
                curPageY = e.pageY;
                
                mouseDown = true;
                hasMoved  = false;
                      
                svg.style.cursor = 'move';

                cancelAnimationFrame(move);
                /*
                 * request a new animation frame
                 */
                requestAnimationFrame(move);

            },

            onMouseUp = function (e) {
                            
                mouseDown = hasMoved = false;
                    
                svg.style.cursor = 'default';

            };


        this.container.on('mousemove', 'svg', onMouseMove)
            .on('mousedown', 'svg', onMouseDown)
            .on('mouseup', onMouseUp);  

    }

    this.container.on('mousedown click', function (e) {
        
        if (!hasMoved && !$(e.target).hasClass('archerTarget-zoomin') && !$(e.target).hasClass('archerTarget-zoomout')) {

            var x = e.pageX - this.offsetLeft,
                y = e.pageY - this.offsetTop,
                tapTarget = self.checkClosestTarget(0, {
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
                        x: self.convertTo.pcX(x, tapTarget),
                        y: self.convertTo.pcY(y, tapTarget),
                        target: tapTarget
                    }
                ];


            if (e.type === 'mousedown') {

                self.container.trigger('containerMousedown.jArcherTarget', eventObject);

            } else {

                self.container.trigger('containerTap.jArcherTarget', eventObject);

            }

        }

    });

    
            
};