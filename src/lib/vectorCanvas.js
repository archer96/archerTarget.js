var VectorCanvas = function (width, height) {

	if (!window.SVGAngle) {
		alert('No SVG supported!');
	}

	this.createSvgNode = function (nodeName) {
		return document.createElementNS('http://www.w3.org/2000/svg', nodeName);
	};

	this.canvas = this.createSvgNode('svg');

	this.setSize(width, height);

};

VectorCanvas.prototype = {

	width: 0,
	height: 0,
	canvas: null,

	setSize: function (width, height) {

		this.canvas.setAttribute('width', width);
		this.canvas.setAttribute('height', height);

		this.width = width;
		this.height = height;

	},

	createCircle: function (config) {

		var node = this.createSvgNode('circle');

		node.setAttribute('cx', config.x);
		node.setAttribute('cy', config.y);
		node.setAttribute('r', config.radius);
		node.setAttribute('fill', config.fill);
		node.setAttribute('stroke', config.stroke);
		node.setAttribute('stroke-width', config.strokeWidth);
		node.setAttribute('class', config.eleClass);

		node.setPosition = function (point) {
			node.setAttribute('cx', point.x);
			node.setAttribute('cy', point.y);
		};

		node.setStyle = function (style) {
			node.setAttribute('r', style.radius);
			node.setAttribute('fill', style.fill);
			node.setAttribute('stroke', style.stroke);
			node.setAttribute('stroke-width', style.strokeWidth);
		};

		return node;
	},

	createRect: function (config) {

		var node = this.createSvgNode('rect');
		node.setAttribute('x', config.x);
		node.setAttribute('y', config.y);
		node.setAttribute('width', config.width);
		node.setAttribute('height', config.height);
		node.setAttribute('fill', config.fill);
		node.setPosition = function (point) {
			node.setAttribute('x', point.x);
			node.setAttribute('y', point.y);
		};

		return node;

	},

	createGroup: function (groupConfig, isRoot) {

		var config = groupConfig || {},
			node = this.createSvgNode('g');

		if (config.id) {
			node.id = config.id;
		}

		if (config.eleClass) {
			node.setAttribute('class', config.eleClass);
		}

		if (isRoot) {
			this.rootGroup = node;
		}

		return node;

	},

	applyTransformParams: function (scale, transX, transY) {

		this.rootGroup.setAttribute(
			'transform', 'scale(' + scale + ') translate(' + transX + ', ' + transY + ')'
		);

	}
};
