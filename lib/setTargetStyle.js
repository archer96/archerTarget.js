jat.Target.prototype.setTargetStyle = function (state, config) {
            
    var i;
            
    switch (state) {
                    
    case "initial":
                    
        for (i = 0; i < this.target.length; i++) {
                    
            $(this.target[i].element).css({ opacity: this.target[i].style.initial.opacity });
    
        }
        
        break;
                    
                  
    case "arrow":
                   
        for (i = 0; i < this.target.length; i++) {
                    
            if (i === config.active) {
                    
                $(this.target[i].element).css({ opacity: this.target[i].style.arrowOn.opacity });
            
            } else {
        
                $(this.target[i].element).css({ opacity: this.target[i].style.arrowOff.opacity });
            }
 
        }
                    
        break;
                     
    }
};
        