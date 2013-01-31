ArcherTarget.prototype.bindTargetTouchEvents = function () {

	var self = this;

	$(this.target).each(function (index, domEle) {

		domEle.$el.on('mouseover', function () {

			if (self.arrowMoving) {
				return false;
			}

			domEle.$el.css({

				opacity: domEle.style.hover.opacity

			}).trigger('targetOver.archerTarget', [index]);

			return false;

		}).on('mouseout', function () {

			if (self.arrowMoving) {
				return false;
			}

			domEle.$el.css({

				opacity: domEle.style.initial.opacity

			}).trigger('targetOut.archerTarget', [index]);

			return false;

		}).on('click', function () {

			domEle.$el.trigger('targetClick.archerTarget', [index]);

		});

	});

};
