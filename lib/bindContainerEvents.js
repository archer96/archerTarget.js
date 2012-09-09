jat.Target.prototype.bindContainerEvents =  function (touch) {
            
    var self = this,
        mouseDown = false,
        oldPageX,
        oldPageY,
        hasMoved = false;
            
    if (!touch && this.draggable) {
                
        this.container.on('mousemove', 'svg, .targetCanvas', function (e) {
                    
            if (mouseDown) {
                        
                self.transX -= (oldPageX - e.pageX) / self.zoom;
                self.transY -= (oldPageY - e.pageY) / self.zoom;

                hasMoved = true;
                
                self.applyTransform();
                        
                oldPageX = e.pageX;
                oldPageY = e.pageY;
                        
                self.container.trigger('targetMove.jArcherTarget', []);
            }
                    
                    
        }).on('mousedown', 'svg, .targetCanvas', function (e) {

            mouseDown = true;
            oldPageX = e.pageX;
            oldPageY = e.pageY;
            hasMoved = false;
                    
            $(this).css({ cursor: 'move' });
                    
        }).on('mouseup', 'svg, .targetCanvas', function (e) {
                    
            mouseDown = false;
                                                            
            $(this).css({ cursor: 'default' });

        });
                

    }
    
    this.container.on('click', function (e) {
        
        if (!hasMoved && !$(e.target).hasClass('archerTarget-zoomin') && !$(e.target).hasClass('archerTarget-zoomout')) {

            var x = e.pageX - this.offsetLeft,
                y = e.pageY - this.offsetTop,
                tapTarget = self.checkClosestTarget(0, {
                    x: x,
                    y: y
                });

            self.container.trigger('containerTap.jArcherTarget', [{
                x: self.convertTo.pc.x(x, tapTarget),
                y: self.convertTo.pc.y(y, tapTarget)
            }]);

        }

    });

    
            
};