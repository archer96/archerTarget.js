jat.Target.prototype.bindContainerEvents =  function (touch) {
            
    var self = this,
        mouseDown = false,
        oldPageX,
        oldPageY;
            
    if (!touch && this.draggable) {
                
        this.container.on('mousemove', 'svg, .targetCanvas', function (e) {
                    
            if (mouseDown) {
                        
                self.transX -= (oldPageX - e.pageX) / self.zoom;
                self.transY -= (oldPageY - e.pageY) / self.zoom;
                        
                self.applyTransform();
                        
                oldPageX = e.pageX;
                oldPageY = e.pageY;
                        
                self.container.trigger('targetMove.jArcherTarget', []);
            }
                    
                    
        }).on('mousedown', 'svg, .targetCanvas', function (e) {
                    
            mouseDown = true;
            oldPageX = e.pageX;
            oldPageY = e.pageY;
                    
            $(this).css({ cursor: 'move' });
                    
            return false;
                    
        }).on('mouseup', 'svg, .targetCanvas', function (e) {
                    
            mouseDown = false;
                                                            
            $(this).css({ cursor: 'default' });
                    
            return false;
        });
                
    }
            
};