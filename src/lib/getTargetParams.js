/**
 * Returns the target parameters (rings, colors, etc.)
 *
 * @param  {String} targetName Name of the target
 * @return {Object}            Object containing the parameters of the target
 */

var getTargetParams = ArcherTarget.getTarget = function (targetName) {

	return AT.Targets[targetName] || {};

};
