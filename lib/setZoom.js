jat.Target.prototype.setZoom = function (newZoom) {
            
    this.container.trigger('zoom.jArcherTarget', [newZoom, this.zoom]);
                    
    this.zoom = newZoom;
            
    this.setTransform();

    this.clearConverterCache();
            
};