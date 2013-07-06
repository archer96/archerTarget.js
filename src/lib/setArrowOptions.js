/**
 * Merges the given options with the arrowset options (e.g. 'draggable', 'style').
 *
 * @param {Object}  arrowset
 * @param {Integer} arrowset.arrowsetID  ID of the arrowset
 * @param {Object}  [arrowset.options]   Options to merge
 */
AT.prototype.setArrowOptions = function (arrowset) {

	var self = this,
		field,
		methodName,
		options;

	options = {
		active: function (method) {
			self[method]({
				arrowsetID: arrowset.arrowsetID,
				active: arrowset.options.active
			});
		}
	};


	for (field in arrowset.options) {

		if (arrowset.options.hasOwnProperty(field)) {

			methodName = 'setArrow' + field.charAt(0).toUpperCase() + field.substr(1);

			if (arrowset.options[field] !== self.arrowList[arrowset.arrowsetID][field] &&
				options[field]) {

				options[field](methodName);

			}

		}

	}

	ArcherTarget.extend(true, self.arrowList[arrowset.arrowsetID], arrowset.options);

};
