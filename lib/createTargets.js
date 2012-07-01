jat.Target.prototype.createTarget = function (targets) {
            
    var i, j,
        self = this;
    targets = targets || [];
                        
    for (i = 0; i < targets.length; i = i + 1) {
                
        targets[i] = $.extend(true, {}, this.params.targetDefaults, targets[i]);

        targets[i].originalCenter = targets[i].center;
                
        targets[i].element = this.canvas.createGroup(false, { id: $(this.container).attr('id') + 'Target_' + i, eleClass: 'targetCanvas' });
                
        targets[i].rings = [];
                
        for (j = 0; j < jat.Target.targets[targets[i].name].numberRings; j = j + 1) {
                    
            targets[i].rings[j] = {};

            targets[i].rings[j].element = this.canvas.createCircle({
                x: this.convertTo.canvas.x(targets[i].center[0]),
                y: this.convertTo.canvas.y(targets[i].center[1]),
                radius: this.convertTo.canvas.x(jat.Target.targets[targets[i].name].diameters[j], targets[i].diameter) / 2,
                fill: jat.Target.targets[targets[i].name].colors[j],
                stroke: jat.Target.targets[targets[i].name].strokeColors[j],
                eleClass: j
            });
            $(targets[i].element).append(targets[i].rings[j].element);
                    
        }
        this.rootGroup.appendChild(targets[i].element);
                
        $(targets[i].element).css({
            opacity: targets[i].style.initial.opacity
        });
                
    }
            
    return targets;
            
};