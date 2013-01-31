ArcherTarget.prototype.bindTargetEvents = function () {

	var self = this;

	$(self.targetList).each(function (index, domEle) {

		domEle.$el.parent().on('mouseenter', function () {

			if (self.arrowMoving) {
				return false;
			}

			domEle.$el.css({

				opacity: domEle.style.hover.opacity

			}).trigger('targetOver.archerTarget', [index]);

			return false;

		}).on('mouseleave', function () {

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
