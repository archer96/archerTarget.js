jat.Target.prototype.setActive = function (arrowSetID, active) {
      
    if (active === 1) {
        
        this.arrow[arrowSetID].element.setAttribute('class', 'arrowSetCanvas');
    
    } else {
        
        this.arrow[arrowSetID].element.setAttribute('class', 'arrowSetCanvas hidden');
    
    }
            
};