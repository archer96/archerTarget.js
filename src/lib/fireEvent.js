ArcherTarget.fireEvent = function (target, name, params) {

	var evt = document.createEvent('Event');

	evt.initEvent(name, true, true); //true for can bubble, true for cancelable

	if (params) {
		for (var param in params) {
			if (params.hasOwnProperty(param)) {
				evt[param] = params[param];
			}
		}
	}

	target.dispatchEvent(evt);

};
