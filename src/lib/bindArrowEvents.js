AT.prototype.bindArrowEvents =  function () {

	var self = this,
		arrowTmp = {},
		arrowsetTmp = {},
		arrowTarget,
		curPageX,
		curPageY,
		offsetLeft = ArcherTarget.offset(self.container).left,
		offsetTop = ArcherTarget.offset(self.container).top,
		pointerHeight = 0,
		move,
		onMouseMove,
		onMouseDown,
		onMouseUp,
		onMouseOut;

	self.arrowMoving = false;

	move = function () {

		if (!self.arrowMoving || !arrowsetTmp.data.draggable) {
			return false;
		}

		arrowTmp.el.setPosition({
			x: curPageX,
			y: curPageY
		});

		if (arrowsetTmp.data.draggable instanceof Object) {

			self.setArrowPointer({
				x: curPageX,
				y: curPageY,
				drag: arrowsetTmp.data.draggable,
				arrowRadius: arrowsetTmp.data.radius
			});

		}

		arrowTmp.ring = self.calculateRing({
			x: curPageX,
			y: curPageY - pointerHeight,
			target: arrowTarget
		});


		arrowTmp.x = self.convertTo.pcX(curPageX, arrowTarget);
		arrowTmp.y = self.convertTo.pcY(curPageY - pointerHeight, arrowTarget);
		arrowTmp.ring = arrowTmp.ring;


		if (!self.checkOnTarget(arrowTmp)) {

			var tmpTarget = self.checkClosestTarget(arrowTarget, {x: curPageX, y: curPageY});

			if (arrowTarget !== tmpTarget) {

				arrowTmp.target = arrowTarget = tmpTarget;

				self.setTargetStyle('arrow', { active: arrowTarget });

			}
		}


		/* Save temp data to arrow array */
		self.arrowList[arrowsetTmp.id] = arrowsetTmp.data;
		self.arrowList[arrowsetTmp.id].data[arrowTmp.id] = arrowTmp;

		window.requestAnimationFrame(move);

		ArcherTarget.fireEvent(arrowTmp.el, 'arrowMove.archerTarget',
			{arrowset: arrowsetTmp.id, arrow: arrowTmp.id, arrows: self.arrowList});

	};

	onMouseMove = function (e) {

		if (self.arrowMoving) {

			curPageX = e.pageX - offsetLeft;
			curPageY = e.pageY - offsetTop;

		}

		return false;

	};

	onMouseDown = function (e) {

		var element = e.target;

		if (!self.arrowMoving) {

			var parentNode = this.parentNode,
				thisClass = element.className.baseVal,
				id;

			arrowsetTmp.id = parseInt(parentNode.id.substr(parentNode.id.indexOf('_') + 1), 10);
			arrowsetTmp.data = self.arrowList[arrowsetTmp.id];
			arrowTarget = arrowsetTmp.data.target;

			if (thisClass.indexOf(' ') === -1) {

				id = parseInt(thisClass, 10);

			} else {

				id = parseInt(thisClass.substr(0, thisClass.indexOf(' ')), 10);

			}

			arrowTmp = arrowsetTmp.data.data[id];
			arrowTmp.el = this;
			arrowTmp.id = id;
		}

		if (e.type === 'mousedown') {

			/*
			 * Self triggered mousedown events don't have the pageX and pageY attribute,
			 * so we use the old arrow-position.
			 */
			curPageX = e.pageX - offsetLeft || self.convertTo.pxX(arrowTmp.x, arrowTarget);
			curPageY = e.pageY - offsetTop || self.convertTo.pxY(arrowTmp.y, arrowTarget);

			self.arrowMoving = true;


			if (arrowsetTmp.data.draggable) {

				self.setTargetStyle('arrow', { active: arrowTarget });

				self.container.style.cursor = 'move';

			}

			arrowTmp.el.setAttribute('fill', arrowsetTmp.data.style.selected.color);
			arrowTmp.el.style.opacity = arrowsetTmp.data.style.selected.opacity;

			ArcherTarget.fireEvent(arrowTmp.el, 'arrowSelect.archerTarget',
				{arrowset: arrowsetTmp.id, arrow: arrowTmp.id, arrows: self.arrowList});

			if (arrowsetTmp.data.draggable instanceof Object && arrowsetTmp.data.draggable) {

				self.createArrowPointer({
					x: self.convertTo.pxX(arrowTmp.x, arrowTarget),
					y: self.convertTo.pxY(arrowTmp.y, arrowTarget),
					drag: arrowsetTmp.data.draggable,
					color: arrowsetTmp.data.style.selected.color,
					arrowRadius: arrowsetTmp.data.radius
				});

				pointerHeight = arrowsetTmp.data.draggable.height + arrowsetTmp.data.radius;


			} else {

				pointerHeight = 0;

			}


			window.cancelAnimationFrame(move);
			/*
			 * request a new animation frame
			 */
			window.requestAnimationFrame(move);


		} else if (e.type === 'mouseover' && !self.arrowMoving) {

			arrowTmp.el.setAttribute('fill', arrowsetTmp.data.style.hover.color);
			arrowTmp.el.style.opacity = arrowsetTmp.data.style.hover.opacity;

			ArcherTarget.fireEvent(arrowTmp.el, 'arrowOver.archerTarget',
				{arrowset: arrowsetTmp.id, arrow: arrowTmp.id, arrows: self.arrowList});

		}

		return false;

	};

	onMouseUp = function () {

		if (self.arrowMoving) {

			self.arrowMoving = false;

			self.setTargetStyle('initial');

			arrowTmp.el.setAttribute('fill', arrowsetTmp.data.style.hover.color);

			if (arrowsetTmp.data.draggable instanceof Object) {

				self.removeArrowPointer();

				arrowTmp.el.setPosition({
					x:self.convertTo.pxX(arrowTmp.x, arrowTarget),
					y:self.convertTo.pxY(arrowTmp.y, arrowTarget)
				});

			}

			self.container.style.cursor = 'default';

			ArcherTarget.fireEvent(self.container, 'arrowDeselect.archerTarget',
				{arrowset: arrowsetTmp.id, arrow: arrowTmp.id, arrows: self.arrowList});

		}

		return false;

	};

	onMouseOut = function () {

		if (!self.arrowMoving || !arrowsetTmp.data.draggable) {

			arrowTmp.el.setAttribute('fill', arrowsetTmp.data.style.initial.color);
			arrowTmp.el.style.opacity = arrowsetTmp.data.style.initial.opacity;

			ArcherTarget.fireEvent(arrowTmp.el, 'arrowOut.archerTarget',
				{arrowset: arrowsetTmp.id, arrow: arrowTmp.id, arrows: self.arrowList});

		}

		return false;

	};

	this.container.addEventListener('mousemove', onMouseMove);
	this.container.addEventListener('mouseup', onMouseUp);
	this.container.addEventListener('click', onMouseUp);

	var c = this.container.querySelectorAll('.arrowSetCanvas circle');
	addEventListenerList(c, 'mouseout', onMouseOut);
	addEventListenerList(c, 'mousedown', onMouseDown);
	addEventListenerList(c, 'mouseover', onMouseDown);

};
