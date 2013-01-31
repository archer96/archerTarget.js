ArcherTarget.prototype.bindContainerTouchEvents =  function () {

	var self = this,
		hasMoved = false,
		touch;

	if (this.options.draggable) {

		var oldPageX,
			oldPageY,
			curPageX,
			curPageY,
			mouseDown = false,
			svg = this.$container.find('svg')[0],
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

			self.$container.trigger('targetMove.archerTarget', []);

		};

		onTouchMove = function (e) {

			if (!mouseDown) {
				return;
			}

			touch = e.originalEvent.touches[0];

			curPageX = touch.pageX;
			curPageY = touch.pageY;

		};

		onTouchStart = function (e) {

			touch = e.originalEvent.touches[0];

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

			mouseDown = hasMoved = false;

			svg.style.cursor = 'default';

		};


		this.$container
			.on('touchmove', 'svg, .targetCanvas', onTouchMove)
			.on('touchstart', 'svg, .targetCanvas', onTouchStart)
			.on('touchend', 'svg, .targetCanvas', onTouchEnd);

	}

	this.$container.on('touchstart touchend', function (e) {

		if (!hasMoved && !$(e.target).hasClass('archerTarget-zoomin') &&
			!$(e.target).hasClass('archerTarget-zoomout')) {

			var x,
				y,
				tapTarget,
				eventObject,
				offsetLeft = $(this).offset().left,
				offsetTop = $(this).offset().top;

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
					x: self.convertTo.pcX(x, tapTarget),
					y: self.convertTo.pcY(y, tapTarget),
					target: tapTarget
				},
				e
			];

			if (e.type === 'touchstart') {

				self.$container.trigger('containerMousedown.archerTarget', eventObject);

			} else {

				self.$container.trigger('containerTap.archerTarget', eventObject);

			}

		}

	});



};
