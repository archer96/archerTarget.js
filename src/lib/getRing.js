AT.prototype.getRing = function (arrow) {

	var self = this;

	if (arrow) {

		return self.calculateRing({
			x:self.convertTo.pxX(arrow.x, arrow.target),
			y:self.convertTo.pxY(arrow.y, arrow.target),
			target: arrow.target
		});


	} else {

		var i, j,
			data;

		for (i = 0; i < this.arrow.length; i++) {

			for (j = 0; j < this.arrow[i].data.length; j++) {

				data = this.arrow[i].data[j];

				data.ring = self.calculateRing({
					x:self.convertTo.pxX(data.x, data.target),
					y:self.convertTo.pxY(data.y, data.target),
					target: data.target
				});

			}

		}

		return this.arrow;

	}

};
