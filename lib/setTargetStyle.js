jat.Target.prototype.setTargetStyle = function (state, config) {
            
    var i,
        targets = this.target;
            
    switch (state) {
                    
    case "initial":
                    
        for (i = 0; i < target.length; i++) {
                    
            $(targets[i].element).css({ opacity: targets[i].style.initial.opacity });
    
        }
        
        break;
                    
                  
    case "arrow":
                   
        for (i = 0; i < target.length; i++) {
                    
            if (i === config.active) {
                    
                $(targets[i].element).css({ opacity: targets[i].style.arrowOn.opacity });
            
            } else {
        
                $(targets[i].element).css({ opacity: targets[i].style.arrowOff.opacity });
            }
 
        }
                    
        break;
                     
    }
};
        