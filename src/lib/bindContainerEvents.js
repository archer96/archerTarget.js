ArcherTarget.prototype.bindContainerEvents =  function () {

	var self = this,
		hasMoved = false;

	if (this.draggable) {

		var oldPageX,
			oldPageY,
			curPageX,
			curPageY,
			mouseDown = false,
			svg = this.$container.find('svg')[0],
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

			self.$container.trigger('targetMove.archerTarget', []);


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


		this.$container
			.on('mousemove', 'svg', onMouseMove)
			.on('mousedown', 'svg', onMouseDown)
			.on('mouseup', onMouseUp);

	}

	this.$container.on('mousedown click', function (e) {

		if (!hasMoved && !$(e.target).hasClass('archerTarget-zoomin') &&
			!$(e.target).hasClass('archerTarget-zoomout')) {

			var x = e.pageX - $(this).offset().left,
				y = e.pageY - $(this).offset().top,
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

				self.$container.trigger('containerMousedown.archerTarget', eventObject);

			} else {

				self.$container.trigger('containerTap.archerTarget', eventObject);

			}

		}

	});



};
