jat.Target.prototype.setSize = function () {
    
    this.width = this.container.width();
    
    this.height = this.container.height() ? this.container.height() : this.container.width();
    
};