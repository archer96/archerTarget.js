AT.prototype.bindArrowEvents = function () {

	var self = this,
		arrowTmp = {},
		arrowsetTmp = {},
		offsetLeft = ArcherTarget.offset(self.container).left,
		offsetTop = ArcherTarget.offset(self.container).top,
		isTouch = self.options.isTouch,
		pointerHeight = 0,
		arrowTarget,
		curPageX,
		curPageY,
		move,
		onMove,
		onStart,
		onEnd,
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


		if (!self.checkOnTarget(arrowTmp)) {

			var tmpTarget = self.checkClosestTarget(arrowTarget, {x: curPageX, y: curPageY});

			if (arrowTarget !== tmpTarget) {

				arrowTmp.target = arrowTarget = tmpTarget;

				self.setTargetStyle('arrow', {active: arrowTarget});

			}
		}

		/* Save temp data to arrow array */
		self.arrowList[arrowsetTmp.id] = arrowsetTmp.data;
		self.arrowList[arrowsetTmp.id].data[arrowTmp.id] = arrowTmp;

		window.requestAnimationFrame(move);

		ArcherTarget.fireEvent(arrowTmp.el, 'arrowMove.archerTarget',
			{arrowset: arrowsetTmp.id, arrow: arrowTmp.id, arrows: self.arrowList});

	};

	onMove = function (e) {

		if (!self.arrowMoving) {

			return false;

		}

		if (isTouch) {

			var touch = e.touches[0];

			curPageX = touch.pageX - offsetLeft;
			curPageY = touch.pageY - offsetTop;

		} else {

			curPageX = e.pageX - offsetLeft;
			curPageY = e.pageY - offsetTop;

		}

		return false;

	};

	onStart = function (e) {

		var element = e.target;

		if (!self.arrowMoving) {

			var parentNode = element.parentNode,
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
			arrowTmp.el = element;
			arrowTmp.id = id;

		}

		DEVMODE && console.log('archerTarget :: touchstart on arrow ', arrowTmp);

		if (isTouch) {

			var touch = e.touches[0];

			if (touch.noOffset) {
				curPageX = touch.pageX || self.convertTo.pxX(arrowTmp.x || 0, arrowTarget);
				curPageY = touch.pageY || self.convertTo.pxY(arrowTmp.y || 0, arrowTarget);
			} else {
				curPageX = touch.pageX - offsetLeft || self.convertTo.pxX(arrowTmp.x || 0,
					arrowTarget);
				curPageY = touch.pageY - offsetTop || self.convertTo.pxY(arrowTmp.y || 0,
					arrowTarget);
			}

		} else if (e.type === 'mousedown') {

			/*
			 * Self triggered mousedown events don't have the pageX and pageY attribute,
			 * so we use the old arrow-position.
			 */
			curPageX = e.pageX - offsetLeft || self.convertTo.pxX(arrowTmp.x, arrowTarget);
			curPageY = e.pageY - offsetTop || self.convertTo.pxY(arrowTmp.y, arrowTarget);


		} else if (e.type === 'mouseover' && !self.arrowMoving) {

			arrowTmp.el.setAttribute('fill', arrowsetTmp.data.style.hover.color);
			arrowTmp.el.style.opacity = arrowsetTmp.data.style.hover.opacity;

			ArcherTarget.fireEvent(arrowTmp.el, 'arrowOver.archerTarget',
				{arrowset: arrowsetTmp.id, arrow: arrowTmp.id, arrows: self.arrowList});

			return false;

		} else {

			return false;

		}

		self.arrowMoving = true;

		if (arrowsetTmp.data.draggable) {

			self.setTargetStyle('arrow', {active: arrowTarget});

			// Changing style is not neccessary when using touch
			if (!isTouch) {
				self.container.style.cursor = 'move';
			}

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


		if ((!isTouch || e.touches.length === 1) && arrowsetTmp.data.draggable) {

			window.cancelAnimationFrame(move);
			/*
			 * request a new animation frame
			 */
			window.requestAnimationFrame(move);

		}

		return false;

	};

	onEnd = function () {

		if (!self.arrowMoving) {
			return false;
		}

		DEVMODE && console.log('archerTarget :: touchend on arrow ', arrowTmp);

		self.arrowMoving = false;

		self.setTargetStyle('initial');

		if (!isTouch) {
			arrowTmp.el.setAttribute('fill', arrowsetTmp.data.style.hover.color);
		} else {
			arrowTmp.el.setAttribute('fill', arrowsetTmp.data.style.initial.color);
		}

		if (arrowsetTmp.data.draggable instanceof Object) {

			self.removeArrowPointer();

			arrowTmp.el.setPosition({
				x: self.convertTo.pxX(arrowTmp.x, arrowTarget),
				y: self.convertTo.pxY(arrowTmp.y, arrowTarget)
			});

		}

		if (!isTouch) {
			self.container.style.cursor = 'default';
		}

		ArcherTarget.fireEvent(self.container, 'arrowDeselect.archerTarget',
			{arrowset: arrowsetTmp.id, arrow: arrowTmp.id, arrows: self.arrowList});

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

	self.container.addEventListener(isTouch ? 'touchmove' : 'mousemove', onMove);
	self.container.addEventListener(isTouch ? 'touchend' : 'mouseup', onEnd);

	var c = self.container.querySelectorAll('.arrowSetCanvas circle');

	addEventListenerList(c, isTouch ? 'touchstart' : 'mousedown', onStart);

	if (!isTouch) {
		addEventListenerList(c, 'mouseout', onMouseOut);
		addEventListenerList(c, 'mouseover', onStart);
	}

	self.eventListeners.push(function () {

		self.container.removeEventListener(isTouch ? 'touchmove' : 'mousemove', onMove);
		self.container.removeEventListener(isTouch ? 'touchend' : 'mouseup', onEnd);

		removeEventListenerList(c, isTouch ? 'touchstart' : 'mousedown', onStart);

		if (!isTouch) {
			removeEventListenerList(c, 'mouseout', onMouseOut);
			removeEventListenerList(c, 'mouseover', onStart);
		}

	});

};
