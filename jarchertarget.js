/**
 * jArcherTarget version 0.1.0
 *
 * Copyright 2012, Andre Meyering
 * Licensed under the MIT license.
 *
 */

var jat = {};

(function ($) {

    var apiEvents = {
        
            onTargetOver: 'targetOver',
            onTargetOut: 'targetOut',
            onTargetMove: 'targetMove',
            onTargetClick: 'targetClick',
            
            onArrowOver: 'arrowOver',
            onArrowOut: 'arrowOut',
            onArrowMove: 'arrowMove',
            onArrowClick: 'arrowClick',
            onArrowSelect: 'arrowSelect',
            onArrowDeselect: 'arrowDeselect',
    
            onZoom: 'zoom'
        },
        apiParams = {
            get: {
                ring: 1,
                targetParams: 1
            },
            set: {
                backgroundColor: 1,
                zoom: 1,
                arrowActive: 1,
                arrowStyle: 1,
                arrowOptions: 1
            }
        };
        
    $.fn.archerTarget = function (options) {
    
        var defaultParams = {
                target: 'wa_x',
                targetDefaults: {
                    center: [50, 50],
                    diameter: 90,
                    style: {
                        initial: {
                            opacity: 1
                        },
                        hover: {
                            opacity: 1
                        },
                        arrowOn: {
                            opacity: 1
                        },
                        arrowOff: {
                            opacity: 0.9
                        }
                    }
                },
                backgroundColor: 'transparent',
                draggable: 1,
                arrowDefaults: {
                    active: 1,
                    draggable: 1,
                    radius: 5,
                    style: {
                        initial: {
                            opacity: 0.9,
                            color: '#00ff00',
                            stroke: false
                        },
                        hover: {
                            opacity: 1
                        },
                        selected: {
                            opacity: 1
                        }
                    },
                    target: 0
                },
                zoom: 1,
                maxZoom: 6,
                minZoom: 0.6,
                zoomStep: 0.2,
                touch: false
            },
            targetObj,
            methodName,
            event,
            style;
            
            
        if (options === 'addTarget') {
            
            jat.Target.targets[arguments[1]] = arguments[2];
             
        } else if ((options === 'set' || options === 'get') && apiParams[options][arguments[1]]) {
            
            /* Example: ring -> Ring -> get + Ring -> getRing */
            methodName = options + arguments[1].charAt(0).toUpperCase() + arguments[1].substr(1);
       
            /* Note that arguments is not an Array, but we want to call the .slice() method on it. We do this with the .call() method.  */
            return this.data('targetObject')[methodName].apply(this.data('targetObject'), Array.prototype.slice.call(arguments, 2));
            
        } else {

            $.extend(true, defaultParams, options);
            
            
            for (style in defaultParams.targetDefaults.style) {
                if (defaultParams.targetDefaults.style.hasOwnProperty(style)) {
                    defaultParams.targetDefaults.style[style] = $.extend(true, {}, defaultParams.targetDefaults.style.initial, defaultParams.targetDefaults.style[style]);
                }
            }
            
            for (style in defaultParams.arrowDefaults.style) {
                if (defaultParams.arrowDefaults.style.hasOwnProperty(style)) {
                    defaultParams.arrowDefaults.style[style] = $.extend(true, {}, defaultParams.arrowDefaults.style.initial, defaultParams.arrowDefaults.style[style]);
                }
            }
            
            
            defaultParams.container = this;
            
            
            targetObj = new jat.Target(defaultParams);
            
            this.data('targetObject', targetObj);

            for (event in apiEvents) {
                if (apiEvents.hasOwnProperty(event)) {
                    if (defaultParams[event]) {
                        this.on(apiEvents[event] + '.jArcherTarget', defaultParams[event]);
                    }
                }
            }
        }
    };
    
    
    
    jat.Target = function (params) {
        
        var self = this;
        
        params = params || {};
        
        this.params = params;
        
        this.container = params.container.addClass('archerTargetContainer').css({
            position: 'relative',
            overflow: 'hidden'
        });

        this.arrowClass = 'arrow';
        
        this.zoom = params.zoom;
        
        this.maxZoom = params.maxZoom;
        
        this.minZoom = params.minZoom;
        
        this.zoomStep = params.zoomStep;
        
        this.draggable = params.draggable;
        
        this.arrowDrag = false;

        this.setSize();
                        
        this.convertTo = {

            pc: {
                x: function (arg, targetID) {
                    if (!targetID) { targetID = 0; }
                    
                    return (arg / self.zoom - self.gap[targetID].left - self.transX) / self.convertTo.canvas.x(self.target[targetID].diameter) * 100;
                },
                y: function (arg, targetID) {
                    if (!targetID) { targetID = 0; }
                    
                    return (arg / self.zoom - self.gap[targetID].top - self.transY) / self.convertTo.canvas.x(self.target[targetID].diameter) * 100;
                }
            },

            px: {

                x: function (arg, targetID) {
                    if (!targetID) { targetID = 0; }
                    
                    return ((self.convertTo.canvas.x(self.target[targetID].diameter) / 100) * arg + self.gap[targetID].left + self.transX) * self.zoom;
                },
                y: function (arg, targetID) {
                    if (!targetID) { targetID = 0; }
                    
					/* Attention: converting the target diameter using the x-axe; otherwise an error will occur */
                    return ((self.convertTo.canvas.x(self.target[targetID].diameter) / 100) * arg + self.gap[targetID].top + self.transY) * self.zoom;
                }
            },

            canvas: {
                x: function (arg, targetDiameter) {
                    if (!targetDiameter) { targetDiameter = 100; }
                    
                    return self.width / 100 * targetDiameter / 100 * arg;
                },
                y: function (arg, targetDiameter) {
                    if (!targetDiameter) { targetDiameter = 100; }
                
                    return self.height / 100 * targetDiameter / 100 * arg;
                }
            }
            
        };
        
        this.setBackgroundColor(params.backgroundColor);
        
        this.canvas = new jat.VectorCanvas(this.width, this.height);
        
        this.container.append(this.canvas.canvas);
        
        this.rootGroup = this.canvas.createGroup(true, {id: this.container.attr('id') + 'TargetContainer' });

        this.canvas.canvas.appendChild(this.rootGroup);
                
        this.target = params.target instanceof Array ? params.target : [{ name: params.target }];

        this.target = this.createTarget(this.target);
                
        this.setGap();
        
        this.arrow = this.createArrows(params.arrows);
        
        this.bindArrowEvents(params.touch);
        
        this.bindContainerEvents(params.touch);

        this.bindTargetEvents(params.touch);

        
        $('<div/>').addClass('archerTarget-zoomin').text('+').appendTo(params.container);
        $('<div/>').addClass('archerTarget-zoomout').html('&#x2212;').appendTo(params.container);
        
        this.bindZoomEvents(params.touch);
        
        /* Apply possible zoom */
        this.applyTransform();

        
    };
    
    
    jat.Target.targets = {};
    
    
}(jQuery));