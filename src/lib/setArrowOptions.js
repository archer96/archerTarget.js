/**
 * Merges the given options with the arrowset options (e.g. 'draggable', 'style').
 *
 * @param {Object}  arrowset
 * @param {Integer} arrowset.arrowsetID  ID of the arrowset
 * @param {Object}  [arrowset.options]   Options to merge
 */
ArcherTarget.prototype.setArrowOptions = function (arrowset) {

	var self = this,
		field,
		methodName;


	for (field in arrowset.options) {

		if (arrowset.options.hasOwnProperty(field)) {

			methodName = 'setArrow' + field.charAt(0).toUpperCase() + field.substr(1);

			if (arrowset.options[field] !== self.arrowList[arrowset.arrowsetID][field]) {

				/*
				 * TODO: Add more cases than just 'active'
				 */
				switch (field) {

					case 'active':

						self[methodName]({
							arrowsetID: arrowset.arrowsetID,
							active: arrowset.options[field]
						});

						break;

					default:

						break;

				}


			}

		}

	}

	$.extend(true, self.arrowList[arrowset.arrowsetID], arrowset.options);

};

