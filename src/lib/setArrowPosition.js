/**
 * Sets the position of an arrow or arrows in an arrowset.
 * Position has to be saved in 'this.arrow[i].data[j]'.
 *
 * @param {Object} [arrow] Should be an object containing the ID's of arrows and arrowsets.
 *                         If arrow is no given, we'll set the position of all arrows and
 *                         arrowsets.
 * @param {Integer|Array} arrow.arrowsetID  ID of the arrowset or an array containing the
 *                                          ID's of the the arrowsets
 * @param {Integer|Array} [arrow.arrowID]   ID of the arrow. If given, the arrow.arrowsetID
 *                                          has to be an integer and not an array
 */
 ArcherTarget.prototype.setArrowPosition = function (arrow) {

	var i,
		j,
		self = this,
		toPxX = self.convertTo.pxX,
		toPxY = self.convertTo.pxY,
		defaultConfig = {},
		/**
		 * Sets the position of an arrow
		 * @param {[type]} arrowsetID Id of the arrowsets
		 * @param {[type]} arrowID    ID of the arrow
		 */
		setPosition = function (arrowsetID, arrowID) {

			var arrowData = self.arrowList[arrowsetID].data[arrowID];

			arrowData.el.setPosition({
				x: (toPxX(arrowData.x, arrowData.target)),
				y: (toPxY(arrowData.y, arrowData.target))
			});

		};



	if (typeof(arrow) === 'undefined') {

		DEVMODE > 8 && console.log('archerTarget :: setArrowPosition :: positioning all arrows');

		/*
		 * Set the position of all arrows
		 */
		for (i = 0; i < self.arrowList.length; i++) {

			for (j = 0; j < self.arrowList[i].data.length; j++) {

				setPosition(i, j);

			}
		}


	} else {

		/*
		 * Merge default and given config
		 */
		arrow = $.extend({}, defaultConfig, arrow);


		/*
		 * Check if arrow.arrowsetID is an array. If true we have to set the position of
		 * all arrows in the given arrowsets
		 */
		if (arrow.arrowsetID instanceof Array) {

			for (i = 0; i < arrow.arrowsetID.length; i++) {

				for (j = 0; j < self.arrowList[arrow.arrowsetID[i]].data.length; j++) {

					setPosition(arrow.arrowsetID[i], j);

				}
			}

		} else if (typeof(arrow.arrowID) !== 'undefined') {

			/*
			 * If arrow.arrowsetID is not an array we'll check if arrow.arrowID is an array.
			 * If true, we'll reset the position of all given arrows in the arrowset
			 */
			if (arrow.arrowID instanceof Array) {

				for (i = 0; i < arrow.arrowID.length; i++) {

					setPosition(arrow.arrowsetID, arrow.arrowID[i]);

				}

			} else {

				setPosition(arrow.arrowsetID, arrow.arrowID);

			}

		/*
		 * If no arrow id is given and arrow.arrowsetID is not an array, we only reset one arrowset
		 */
		} else {

			setPosition(arrow.arrowsetID, arrow.active);

			for (i = 0; i < self.arrowList[arrow.arrowsetID].data.length; i++) {

				setPosition(arrow.arrowsetID, i);

			}

		}
	}

};
