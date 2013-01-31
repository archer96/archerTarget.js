ArcherTarget.prototype.bindArrowEvents = function () {

	var self = this,
		arrowTmp = {},
		arrowsetTmp = {},
		arrowTarget,
		curPageX,
		curPageY,
		offsetLeft = this.$container.offset().left,
		offsetTop = this.$container.offset().top,
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

		arrowTmp.$el.trigger('arrowMove.archerTarget',
			[arrowsetTmp.id, arrowTmp.id, self.arrowList]);

	};

	onMouseMove = function (e) {

		if (self.arrowMoving) {

			curPageX = e.pageX - offsetLeft;
			curPageY = e.pageY - offsetTop;

		}

		return false;

	};

	onMouseDown = function (e) {

		if (!self.arrowMoving) {

			var parentNode = this.parentNode,
				thisClass = $(this).attr('class'),
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
			arrowTmp.$el = $(this);
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

				self.$container[0].style.cursor = 'move';

			}

			arrowTmp.el.setAttribute('fill', arrowsetTmp.data.style.selected.color);

			arrowTmp.$el
				.css({
					opacity: arrowsetTmp.data.style.selected.opacity
				})
				.trigger(
					'arrowSelect.archerTarget',
					[arrowsetTmp.id, arrowTmp.id, self.arrowList]
				);


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

			arrowTmp.$el.css({
				opacity: arrowsetTmp.data.style.hover.opacity
			}).trigger('arrowOver.archerTarget', [arrowsetTmp.id, arrowTmp.id]);


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
					x: self.convertTo.pxX(arrowTmp.x, arrowTarget),
					y: self.convertTo.pxY(arrowTmp.y, arrowTarget)
				});

			}

			self.$container[0].style.cursor = 'default';

			$(self.$container).trigger('arrowDeselect.archerTarget',
				[arrowsetTmp.id, arrowTmp.id, self.arrowList]);


		}

		return false;

	};

	onMouseOut = function () {

		if (!self.arrowMoving || !arrowsetTmp.data.draggable) {

			arrowTmp.el.setAttribute('fill', arrowsetTmp.data.style.initial.color);

			arrowTmp.$el.css({
				opacity: arrowsetTmp.data.style.initial.opacity
			}).trigger('arrowOut.archerTarget', [arrowsetTmp.id, arrowTmp.id]);

		}

		return false;

	};


	this.$container
		.on('mousemove', onMouseMove)
		.on('mouseup click', onMouseUp)
		.find('.arrowSetCanvas')
		.on('mouseout', 'circle', onMouseOut)
		.on('mousedown mouseover', 'circle', onMouseDown);

};
