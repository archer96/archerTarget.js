jat.Target.prototype.createTarget = function (targets) {
            
    var self = this,
        i, j;

    targets = targets || [];
                        
    var len = targets.length;
    for (i = 0; i < len; i++) {

        targets[i] = $.extend(true, {}, this.params.targetDefaults, targets[i]);

        var target = targets[i];
                
        target.originalCenter = target.center;
                
        target.element = this.canvas.createGroup(false, { id: self.containerId + 'Target_' + i, eleClass: 'targetCanvas' });
                
        target.rings = [];
                
        for (j = 0; j < jat.Target.targets[target.name].numberRings; j++) {
                    
            target.rings[j] = {};

            target.rings[j].element = this.canvas.createCircle({
                x: this.convertTo.canvasX(target.center[0]),
                y: this.convertTo.canvasY(target.center[1]),
                radius: this.convertTo.canvasX(jat.Target.targets[target.name].diameters[j], target.diameter) / 2,
                fill: jat.Target.targets[target.name].colors[j],
                stroke: jat.Target.targets[target.name].strokeColors[j],
                eleClass: j
            });
            $(target.element).append(target.rings[j].element);
                    
        }
        this.rootGroup.appendChild(target.element);
                
        $(target.element).css({
            opacity: target.style.initial.opacity
        });
                
    }
            
    DEVMODE && console.log('jAT ' + DEVNAME + ':: created target(s) ', targets);

    return targets;
            
};