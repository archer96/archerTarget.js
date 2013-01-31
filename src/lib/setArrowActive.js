/**
 * Sets arrows or arrowsets active or inactive.
 *
 * @param {Object}  arrow
 * @param {Integer} arrow.arrowsetID ID of the arrowset
 * @param {Integer} [arrow.arrowID]  ID of the arrow.
 * @param {Boolean} [arrow.active]   Active state of the arrow(set).
 *                                   If not given, we'll use the options from the arrows.
 */
ArcherTarget.prototype.setArrowActive = function (arrow) {

	var self = this,
		i,
		/**
		 * Sets an arrow active or inactive
		 *
		 * @param {Integer} arrowSetID Id of the arrowset
		 * @param {Integer} arrowID    Id of the arrow
		 * @param {Boolean} active
		 */
		setArrow = function (arrowSetID, arrowID, active) {

			/*
			 * If no active state is given, we'll use the saved value.
			 */
			if (typeof (active) === 'undefined') {

				active = self.arrowList[arrowSetID].data[arrowID].active;

			} else {

				self.arrowList[arrowSetID].data[arrowID].active = active;

			}


			var domEle = self.arrowList[arrowSetID].data[arrowID].el,
				elClass = active ? '' : ' hidden';

			domEle.setAttribute('class', arrowID + elClass);

		},

		/**
		 * Sets all arrows of an arrowset active or inactive
		 *
		 * @param {Integer} arrowSetID Id of the arrowset
		 * @param {Boolean} active
		 */
		setArrowset = function (arrowSetID, active) {

			/*
			 * If no active state is given, we'll use the saved value.
			 */
			if (typeof (active) !== 'undefined') {

				self.arrowList[arrowSetID].active = active;

			}

			var len = self.arrowList[arrowSetID].data.length;
			for (i = 0; i < len; i++) {

				setArrow(arrowSetID, i, active);

			}

		};



	/*
	 * Check if the ID of an arrow is given.
	 */
	if (typeof (arrow.arrowID) !== 'undefined') {

		setArrow(arrow.arrowsetID, arrow.arrowID, arrow.active);

	/*
	 * Otherwise set all arrows of an end acitve/inactive
	 */
	} else {

		setArrowset(arrow.arrowsetID, arrow.active);

	}

};

