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
		(typeof objectToCheck !== 'string') && (typeof objectToCheck !== 'boolean');
}
