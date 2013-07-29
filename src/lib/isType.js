// http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-
// if-a-javascript-object-is-a-dom-object

// Returns true if it is a DOM node
function isNode(o) {
	return (
		typeof Node === 'object' ? o instanceof Node :
		o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName==='string'
	);
}

// Returns true if it is a DOM element
function isElement(o) {
	return (
		typeof HTMLElement === 'object' ? o instanceof HTMLElement : //DOM2
		o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName==='string'
	);
}



function isFunction(functionToCheck) {
	return functionToCheck &&
		Object.prototype.toString.call(functionToCheck) === '[object Function]';
}
function isArray(arrayToCheck) {
	return arrayToCheck && Object.prototype.toString.call(arrayToCheck) === '[object Array]';
}
function isObject(objectToCheck) {
	return objectToCheck && Object.prototype.toString.call(objectToCheck) === '[object Object]';
}
function isPlainObject(objectToCheck) {
	return !(objectToCheck instanceof Array) && (typeof objectToCheck !== 'number') &&
		(typeof objectToCheck !== 'string') && (typeof objectToCheck !== 'boolean') &&
		!isNode(objectToCheck) && !isElement(objectToCheck);
}
