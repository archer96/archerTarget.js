AT.prototype.bindContainerEvents = function () {

	var self = this,
		hasMoved = false;

	if (this.options.draggable) {

		var oldPageX,
			oldPageY,
			curPageX,
			curPageY,
			mouseDown = false,
			svg = this.container.getElementsByTagName('svg')[0],
			move,
			onMouseMove,
			onMouseDown,
			onMouseUp;

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

		onMouseMove = function (e) {

			if (!mouseDown) {
				return;
			}

			curPageX = e.pageX;
			curPageY = e.pageY;

		};

		onMouseDown = function (e) {

			oldPageX = e.pageX - self.transX * self.scale;
			oldPageY = e.pageY - self.transY * self.scale;
			curPageX = e.pageX;
			curPageY = e.pageY;

			mouseDown = true;
			hasMoved  = false;

			svg.style.cursor = 'move';

			window.cancelAnimationFrame(move);
			/*
			 * request a new animation frame
			 */
			window.requestAnimationFrame(move);

		};

		onMouseUp = function () {

			mouseDown = hasMoved = false;

			svg.style.cursor = 'default';

		};


		var s = this.container.querySelectorAll('svg .targetCanvas');
		addEventListenerList(s, 'mousemove', onMouseMove);
		addEventListenerList(s, 'mousedown', onMouseDown);
		addEventListenerList(s, 'mouseup', onMouseUp);

		self.eventListeners.push(function () {
			removeEventListenerList(s, 'mousemove', onMouseMove);
			removeEventListenerList(s, 'mousedown', onMouseDown);
			removeEventListenerList(s, 'mouseup', onMouseUp);
		});

	}

	var touchFunction = function (e) {

		var className = typeof e.target.className.baseVal !== undefined ?
			e.target.className.baseVal : e.target.className,
			element = e.target;

		if (!hasMoved && className.match(/archerTarget-zoomin/g) === null &&
			className.match(/archerTarget-zoomout/g) === null) {

			var x = e.pageX - ArcherTarget.offset(self.container).left,
				y = e.pageY - ArcherTarget.offset(self.container).top,
				tapTarget = self.checkClosestTarget(0, {
					x: x,
					y: y
				}),
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
					}
				];


			if (e.type === 'mousedown') {

				ArcherTarget.fireEvent(self.container, 'containerMousedown.archerTarget',
					{canvasCoords:eventObject[0], targetCoords:eventObject[1]});

			} else {

				ArcherTarget.fireEvent(self.container, 'containerTap.archerTarget',
					{canvasCoords:eventObject[0], targetCoords:eventObject[1]});

			}

		}

	};

	self.container.addEventListener('mousedown', touchFunction);
	self.container.addEventListener('click', touchFunction);

	self.eventListeners.push(function () {
		self.container.removeEventListener('mousedown', touchFunction);
		self.container.removeEventListener('click', touchFunction);
	});

};
