AT.prototype.bindContainerTouchEvents = function () {

	var self = this,
		hasMoved = false,
		touch;

	if (this.options.draggable) {

		var oldPageX,
			oldPageY,
			curPageX,
			curPageY,
			mouseDown = false,
			svg = this.container.getElementsByTagName('svg')[0],
			move,
			onTouchMove,
			onTouchStart,
			onTouchEnd;


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

		onTouchMove = function (e) {

			if (!mouseDown || self.arrowMoving) {
				return;
			}

			touch = e.touches[0];

			curPageX = touch.pageX;
			curPageY = touch.pageY;

		};

		onTouchStart = function (e) {

			if (self.arrowMoving) {
				return;
			}

			touch = e.touches[0];

			oldPageX = touch.pageX - self.transX * self.scale;
			oldPageY = touch.pageY - self.transY * self.scale;
			curPageX = touch.pageX;
			curPageY = touch.pageY;

			mouseDown = true;
			hasMoved  = false;

			svg.style.cursor = 'move';

			window.cancelAnimationFrame(move);
			/*
			 * request a new animation frame
			 */
			window.requestAnimationFrame(move);

		};

		onTouchEnd = function () {

			if (self.arrowMoving) {
				return;
			}

			mouseDown = hasMoved = false;

			svg.style.cursor = 'default';

		};

		var t = self.container.querySelectorAll('svg .targetCanvas');
		addEventListenerList(t, 'touchmove', onTouchMove);
		addEventListenerList(t, 'touchstart', onTouchStart);
		addEventListenerList(t, 'touchend', onTouchEnd);

	}

	var touchFunction = function (e) {

		if (self.arrowMoving) {
			return;
		}

		var className = typeof e.target.className.baseVal !== undefined ?
		e.target.className.baseVal : e.target.className,
			element = e.target;

		if (!hasMoved && className.match(/archerTarget-zoomin/g) === null &&
			className.match(/archerTarget-zoomout/g) === null) {

			var x,
				y,
				tapTarget,
				eventObject,
				offsetLeft = ArcherTarget.offset(self.container).left,
				offsetTop = ArcherTarget.offset(self.container).top;

			if (e.type === 'touchstart') {

				touch = event.touches[0];

				x = touch.pageX - offsetLeft;
				y = touch.pageY - offsetTop;

			} else {

				touch = event.changedTouches[0];

				x = touch.pageX - offsetLeft;
				y = touch.pageY - offsetTop;

			}

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
					x:self.convertTo.pcX(x, tapTarget),
					y:self.convertTo.pcY(y, tapTarget),
					target: tapTarget
				},
				e
			];

			if (e.type === 'touchstart') {

				ArcherTarget.fireEvent(self.container, 'containerMousedown.archerTarget',
					{canvasCoords:eventObject[0], targetCoords:eventObject[1], touches: e.touches});

			} else {

				ArcherTarget.fireEvent(self.container, 'containerTap.archerTarget',
					{canvasCoords:eventObject[0], targetCoords:eventObject[1], touches: e.touches});

			}

		}

	};

	self.container.addEventListener('touchstart', touchFunction);
	self.container.addEventListener('touchend', touchFunction);

};
