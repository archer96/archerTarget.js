/**
 * Returns the target parameters (rings, colors, etc.)
 *
 * @param  {String} targetName Name of the target
 * @return {Object}            Object containing the parameters of the target
 */
ArcherTarget.prototype.getTargetParams = function (targetName) {

	return ArcherTarget.Targets[targetName];

};
