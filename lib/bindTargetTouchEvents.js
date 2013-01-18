jat.Target.prototype.bindTargetTouchEvents = function () {
            
    var self = this;
            
    $(this.target).each(function (index, domEle) {
        
        $(this.element).on('mouseover', function (e) {

            if (!self.arrowMoving) {
                
                $(domEle.element).css({
                    
                    opacity: domEle.style.hover.opacity
                    
                }).trigger('targetOver.jArcherTarget', [index]);
            }
                    
            return false;
                                
        }).on('mouseout', function (e) {

            if (!self.arrowMoving) {
                
                $(domEle.element).css({
                    
                    opacity: domEle.style.initial.opacity
                    
                }).trigger('targetOut.jArcherTarget', [index]);
            }
                    
            return false;
            
        }).on('click', function (e) {
            
            $(domEle.element).trigger('targetClick.jArcherTarget', [index]);
                    
        });
                            
    });

};