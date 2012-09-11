/**
 * Sets arrows or arrowsets active or inactive
 * 
 * @param {Object}  arrow
 * @param {Integer} arrow.arrowsetID ID of the arrowset
 * @param {Integer} [arrow.arrowID]  ID of the arrow.
 * @param {Boolean} [arrow.active]   Active-state of the arrow(set). If true the arrow(set) will shown. Default is true.
 */
jat.Target.prototype.setArrowActive = function (arrow) {
      
    var self = this,
        i,
        j,
        defaultConfig = {
            active: true
        },
        /**
         * Sets an arrow active or inactive
         *
         * @param {Integer} arrowSetID Id of the arrowset
         * @param {Integer} arrowID    Id of the arrow
         * @param {Boolean} active     Active-state. True or false.
         */
        setArrow = function (arrowSetID, arrowID, active) {

            var domEle = self.arrow[arrowSetID].data[arrowID].element,
                elClass = active ? '' : ' hidden';

            self.arrow[arrowSetID].data[arrowID].active = active;

            domEle.setAttribute('class', arrowID + elClass);
            
        },
        /**
         * Sets all arrows of an arrowset active or inactive
         *
         * @param {Integer} arrowSetID Id of the arrowset
         * @param {Boolean} active     Active-state. True or false.
         */
        setArrowset = function (arrowSetID, active) {

            self.arrow[arrowSetID].active = active;

            for (j = 0; j < self.arrow[arrowSetID].data.length; j++) {

                setArrow(arrowSetID, j, active);

            }

        };

    /*
     * Merge default and given config
     */
    arrow = $.extend({}, defaultConfig, arrow);

    /*
     * Check if the ID of an arrow is given.
     */
    if (typeof(arrow.arrowID) !== 'undefined') {

        setArrow(arrow.arrowsetID, arrow.arrowID, arrow.active);
    
    /*
     * Otherwise set all arrows of an end acitve/inactive
     */
    } else {

        setArrowset(arrow.arrowsetID, arrow.active);

    }
            
};

