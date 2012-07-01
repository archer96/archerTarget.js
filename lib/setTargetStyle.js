jat.Target.prototype.setTargetStyle = function (state, config) {
            
    var i;
            
    switch (state) {
                    
    case "initial":
                    
        for (i = 0; i < this.target.length; i = i + 1) {
                    
            $(this.target[i].element).css({ opacity: this.target[i].style.initial.opacity });
    
        }
        
        break;
                    
                  
    case "arrow":
                   
        for (i = 0; i < this.target.length; i = i + 1) {
                    
            if (i === config.active) {
                    
                $(this.target[i].element).css({ opacity: this.target[i].style.arrowOn.opacity });
            
            } else {
        
                $(this.target[i].element).css({ opacity: this.target[i].style.arrowOff.opacity });
            }
 
        }
                    
        break;
                     
    }
};
        