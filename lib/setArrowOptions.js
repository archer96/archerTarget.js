/**
 * Merges the given options with the arrow options (e.g. 'draggable', 'style').
 * 
 * @param {Object}        arrow
 * @param {Integer|Array} arrow.arrowsetID  ID of the arrowset(s)
 * @param {Object}        [arrow.options]   Options to merge
 */
jat.Target.prototype.setArrowOptions = function (arrow) {
      
    var self = this,
        i;

    if (arrow.arrowsetID instanceof Array) {

        for (i = 0; i < arrow.arrowsetID.length; i++) {

            $.extend(self.arrow[arrow.arrowsetID[i]], arrow.options);

        }

    } else {

        $.extend(self.arrow[arrow.arrowsetID], arrow.options);
        
    }
            
};

