AT.prototype.bindContainerEvents = function () {

	var self = this,
		hasMoved = false,
		isTouch = self.options.isTouch;

	if (this.options.draggable) {

		var oldPageX,
			oldPageY,
			curPageX,
			curPageY,
			mouseDown = false,
			svg = this.container.getElementsByTagName('svg')[0],
			move,
			onMove,
			onStart,
			onEnd;


		move = function () {

			if (!mouseDown) {
				return;
			}

			self.transX = (curPageX - oldPageX) / self.scale;
			self.transY = (curPageY - oldPageY) / self.scale;

			hasMoved = true;

			self.setTransform();

			window.requestAnimationFrame(move);

			ArcherTarget.fireEvent(self.container, 'targetMove.archerTarget');

		};

		onMove = function (e) {

			if (!mouseDown || self.arrowMoving) {
				return;
			}

			if (isTouch) {

				var touch = e.touches[0];

				curPageX = touch.pageX;
				curPageY = touch.pageY;

			} else {

				curPageX = e.pageX;
				curPageY = e.pageY;

			}

		};

		onStart = function (e) {

			if (self.arrowMoving) {
				return;
			}

			var pointer = isTouch ? e.touches[0] : e;

			oldPageX = pointer.pageX - self.transX * self.scale;
			oldPageY = pointer.pageY - self.transY * self.scale;
			curPageX = pointer.pageX;
			curPageY = pointer.pageY;

			mouseDown = true;
			hasMoved  = false;

			if (!isTouch) {
				svg.style.cursor = 'move';
			}

			window.cancelAnimationFrame(move);
			/*
			 * request a new animation frame
			 */
			window.requestAnimationFrame(move);

		};

		onEnd = function () {

			if (self.arrowMoving) {
				return;
			}

			mouseDown = hasMoved = false;

			if (!isTouch) {
				svg.style.cursor = 'default';
			}

		};

		var t = self.canvas.rootGroup;

		// addEventListenerList(t, isTouch ? 'touchmove' : 'mousemove', onMove);
		// addEventListenerList(t, isTouch ? 'touchstart' : 'mousedown', onStart);
		// addEventListenerList(t, isTouch ? 'touchend' : 'mouseup', onEnd);

		t.addEventListener(isTouch ? 'touchstart' : 'mousedown', onStart);
		t.addEventListener(isTouch ? 'touchmove' : 'mousemove', onMove);
		t.addEventListener(isTouch ? 'touchend' : 'mouseup', onEnd);

		self.eventListeners.push(function () {
			t.removeEventListener(isTouch ? 'touchstart' : 'mousedown', onStart);
			t.removeEventListener(isTouch ? 'touchmove' : 'mousemove', onMove);
			t.removeEventListener(isTouch ? 'touchend' : 'mouseup', onEnd);
		});

	}

	var touchFunction = function (e) {

		if (self.arrowMoving) {
			return;
		}

		var className = typeof e.target.className.baseVal !== 'undefined' ?
				e.target.className.baseVal : e.target.className,
			element = e.target;

		if (!hasMoved && className.match(/archerTarget-zoomin/g) === null &&
			className.match(/archerTarget-zoomout/g) === null) {

			var x,
				y,
				tapTarget,
				eventObject,
				offsetLeft = ArcherTarget.offset(self.container).left,
				offsetTop = ArcherTarget.offset(self.container).top,
				pointer = !isTouch ? e : (e.type === 'touchstart' ?
						event.touches[0] : event.changedTouches[0]);

			x = pointer.pageX - offsetLeft;
			y = pointer.pageY - offsetTop;

			tapTarget = self.checkClosestTarget(0, {
				x: x,
				y: y
			});

			eventObject = [
				/*
				 * Container/Canvas coordinates in percent
				 */
				{
					x: x / self.width * 100,
					y: y / self.height * 100,
					xPx: x,
					yPx: y
				},
				/*
				 * Target coordinates + clicked target
				 */
				{
					x: self.convertTo.pcX(x, tapTarget),
					y: self.convertTo.pcY(y, tapTarget),
					target: tapTarget
				},
				e
			];

			if (e.type === 'touchstart' || e.type === 'mousedown') {

				ArcherTarget.fireEvent(self.container, 'containerMousedown.archerTarget',
					{canvasCoords:eventObject[0], targetCoords:eventObject[1], touches: e.touches});

			} else {

				ArcherTarget.fireEvent(self.container, 'containerTap.archerTarget',
					{canvasCoords:eventObject[0], targetCoords:eventObject[1], touches: e.touches});

			}

		}

	};

	self.container.addEventListener(isTouch ? 'touchstart' : 'mousedown', touchFunction);
	self.container.addEventListener(isTouch ? 'touchend' : 'click', touchFunction);

	self.eventListeners.push(function () {
		self.container.removeEventListener(isTouch ? 'touchstart' : 'mousedown', touchFunction);
		self.container.removeEventListener(isTouch ? 'touchend' : 'click', touchFunction);
	});

};
