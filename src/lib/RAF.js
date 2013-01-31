/**
 * Simple check for requestAnimationFrame and cancelAnimationFrame.
 */
ArcherTarget.prototype.RAF = function () {

    /*
     * requestAnimationFrame - browser check
     * see: http://paulirish.com/2011/requestanimationframe-for-smart-animating/
     */
    var lastTime = 0,
        vendors = ['ms', 'moz', 'webkit', 'o'],
        i;

    for (i = 0; i < vendors.length && !window.requestAnimationFrame; i++) {

        window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'] ||
            window[vendors[i] + 'CancelRequestAnimationFrame'];

    }

    if (!window.requestAnimationFrame) {

        window.requestAnimationFrame = function (callback) {

            var currTime = new Date().getTime(),
                timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                }, timeToCall);

            lastTime = currTime + timeToCall;

            return id;

        };

    }

    if (!window.cancelAnimationFrame) {

        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };

    }

};
