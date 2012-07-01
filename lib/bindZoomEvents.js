jat.Target.prototype.bindZoomEvents = function () {
        
    var self = this,
        newZoom = 0;
            
    this.container.on('click', '.archerTarget-zoomin', function () {
                    
        if (self.zoom <= self.maxZoom) {
            newZoom = self.zoom + self.zoomStep;
        }
                    
        self.setZoom(newZoom);
                
    }).on('click', '.archerTarget-zoomout', function () {
                    
        if (self.zoom >= self.minZoom + self.zoomStep) {
            newZoom = self.zoom - self.zoomStep;
        }
                    
        self.setZoom(newZoom);

    });
            
};