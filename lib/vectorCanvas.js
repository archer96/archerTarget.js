/*
 * adopted from jVectorMap version 0.2.3 (https://github.com/bjornd/jvectormap | http://jvectormap.com/)
 *
 * Copyright 2011-2012, Kirill Lebedev
 * licensed under the terms of MIT license
 *
 * modified version
 */

jat.VectorCanvas = function (width, height) {
        
    this.mode = window.SVGAngle ? 'svg' : 'vml';
        
    if (this.mode === 'svg') {
        this.createSvgNode = function (nodeName) {
            return document.createElementNS(this.svgns, nodeName);
        };
    } else {
        try {
            if (!document.namespaces.rvml) {
                document.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
            }
            this.createVmlNode = function (tagName) {
                return document.createElement('<rvml:' + tagName + ' class="rvml">');
            };
        } catch (e) {
            this.createVmlNode = function (tagName) {
                return document.createElement('<' + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
            };
        }
        document.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
    }
        
    if (this.mode === 'svg') {
        this.canvas = this.createSvgNode('svg');
    } else {
        this.canvas = this.createVmlNode('group');
        this.canvas.style.position = 'absolute';
    }
        
    this.setSize(width, height);
};
    
jat.VectorCanvas.prototype = {
    svgns: "http://www.w3.org/2000/svg",
    mode: 'svg',
    width: 0,
    height: 0,
    canvas: null,

    setSize: function (width, height) {
        var i, l,
            paths;
            
        if (this.mode === 'svg') {
            this.canvas.setAttribute('width', width);
            this.canvas.setAttribute('height', height);
        } else {
            this.canvas.style.width = width + "px";
            this.canvas.style.height = height + "px";
            this.canvas.coordsize = width + ' ' + height;
            this.canvas.coordorigin = "0 0";
            if (this.rootGroup) {
                paths = this.rootGroup.getElementsByTagName('shape');
                for (i = 0, l = paths.length; i < l; i++) {
                    paths[i].coordsize = width + ' ' + height;
                    paths[i].style.width = width + 'px';
                    paths[i].style.height = height + 'px';
                }
                this.rootGroup.coordsize = width + ' ' + height;
                this.rootGroup.style.width = width + 'px';
                this.rootGroup.style.height = height + 'px';
            }
        }
        this.width = width;
        this.height = height;
    },
                
    createCircle: function (config) {

        var node;

        if (this.mode === 'svg') {

            node = this.createSvgNode('circle');
            node.setAttribute('cx', config.x);
            node.setAttribute('cy', config.y);
            node.setAttribute('r', config.radius);
            node.setAttribute('fill', config.fill);
            node.setAttribute('stroke', config.stroke);
            node.setAttribute('class', config.eleClass);
            node.setPosition = function (point) {
                node.setAttribute('cx', point.x);
                node.setAttribute('cy', point.y);
            };
            node.setStyle = function (style) {
                node.setAttribute('r', style.radius);
                node.setAttribute('fill', style.fill);
                node.setAttribute('stroke', style.stroke);
            };

        } else {

            node = this.createVmlNode('oval');
            node.style.width = config.radius * 2 + 'px';
            node.style.height = config.radius * 2 + 'px';
            node.style.left = config.x - config.radius + 'px';
            node.style.top = config.y - config.radius  + 'px';
            node.fillcolor = config.fill;
            $(node).addClass('config.eleClass');
            node.stroke = true;
            node.strokecolor = config.stroke;
            node.setPosition = function (point) {
                node.style.left = point.x - config.radius + 'px';
                node.style.top = point.y - config.radius + 'px';
            };
            node.setStyle = function (style) {
                node.style.width = style.radius * 2 + 'px';
                node.style.height = style.radius * 2 + 'px';
                node.fillcolor = style.fill;
                node.stroke = true;
                node.strokecolor = style.stroke;
            };
        }

        return node;
    },
        
    createRect: function (config) {
        var node;
        if (this.mode === 'svg') {
            node = this.createSvgNode('rect');
            node.setAttribute('x', config.x);
            node.setAttribute('y', config.y);
            node.setAttribute('width', config.width);
            node.setAttribute('height', config.height);
            node.setAttribute('fill', config.fill);
            node.setPosition = function (point) {
                node.setAttribute('x', point.x);
                node.setAttribute('y', point.y);
            };
        } else {
            node = this.createVmlNode('rect');
            node.style.width = config.width + 'px';
            node.style.height = config.width + 'px';
            node.style.left = config.x + 'px';
            node.style.top = config.y + 'px';
            node.fillcolor = config.fill;
            node.setPosition = function (point) {
                node.style.left = point.x + 'px';
                node.style.top = point.y + 'px';
            };
        }
        return node;
    },
        
    createGroup: function (isRoot, config) {
        var node;
        config = config || {};
        if (this.mode === 'svg') {
            node = this.createSvgNode('g');
            if (config.id) { node.id = config.id; }
            if (config.eleClass) { node.setAttribute('class', config.eleClass); }
        } else {
            node = this.createVmlNode('group');
            node.style.width = this.width + 'px';
            node.style.height = this.height + 'px';
            node.style.left = '0px';
            node.style.top = '0px';
            node.coordorigin = "0 0";
            if (config.id) { node.id = config.id; }
            if (config.eleClass) { $(node).addClass('config.eleClass'); }
            node.coordsize = this.width + ' ' + this.height;
        }
        if (isRoot) {
            this.rootGroup = node;
        }
            
        return node;
            
    },
            
    applyTransformParams: function (scale, transX, transY) {
        if (this.mode === 'svg') {
            this.rootGroup.setAttribute('transform', 'scale(' + scale + ') translate(' + transX + ', ' + transY + ')');
        } else {
            this.rootGroup.coordorigin = (this.width - transX - this.width / 100) + ',' + (this.height - transY - this.height / 100);
            this.rootGroup.coordsize = this.width / scale + ',' + this.height / scale;
        }
    }
};