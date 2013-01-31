ArcherTarget.prototype.getRing = function (arrow) {

	if (arrow) {

		return this.calculateRing({
			x: this.convertTo.pxX(arrow.x, arrow.target),
			y: this.convertTo.pxY(arrow.y, arrow.target),
			target: arrow.target
		});


	} else {

		var i, j,
			data;

		for (i = 0; i < this.arrow.length; i++) {

			for (j = 0; j < this.arrow[i].data.length; j++) {

				data = this.arrow[i].data[j];

				data.ring = this.calculateRing({
					x: this.convertTo.pxX(data.x, data.target),
					y: this.convertTo.pxY(data.y, data.target),
					target: data.target
				});

			}

		}

		return this.arrow;

	}

};
