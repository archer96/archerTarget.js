/**
 * Sets arrows or arrowsets active or inactive
 * 
 * @param {Object} arrow
 * @param {Integer|Array} arrow.arrowsetID  ID of the arrowset or an array containing the ID's of the the arrowsets
 * @param {Integer|Array} [arrow.arrowID]   ID of the arrow. If given, the arrow.arrowsetID has to be an integer and not an array
 * @param {Boolean|Array} [arrow.active]    Active-state of the arrow(set). If true the arrow(set) will be set to active. If arrow.active is 
 *                                          an array, the order has to be the same as arrow.arrowsetID or arrow.arrowID. Default is true
 */
jat.Target.prototype.setActive = function (arrow) {
      
    var self = this,
        i,
        defaultConfig = {
            active: true
        },
        /**
         * Sets and arrowset active or inactive
         *
         * @param {Integer} arrowSetID Id of the arrowset
         * @param {Boolean} active     Active-state. True or false.
         */
        setArrowset = function (arrowSetID, active) {

            self.arrow[arrowSetID].active = active;

            if (active) {
                
                self.arrow[arrowSetID].element.setAttribute('class', 'arrowSetCanvas');
            
            } else {
                
                self.arrow[arrowSetID].element.setAttribute('class', 'arrowSetCanvas hidden');
            
            }

        },
        /**
         * Sets and arrow active or inactive
         *
         * @param {Integer} arrowSetID   Id of the arrowset
         * @param {Integer} arrowID      Id of the arrow
         * @param {Boolean} active       Active-state. True or false.
         */
        setArrow = function (arrowSetID, arrowID, active) {

			var domEle = self.arrow[arrowSetID].data[arrowID].element;



            if (active) {
                
                domEle.setAttribute('class', 'arrowSetCanvas');
            
            } else {

                domEle.setAttribute('class', $(domEle).attr('class').substr(0, $(domEle).attr('class').indexOf(' ')) + ' hidden');
            
            }
        };

    /*
     * Merge default and given config
     */
    arrow = $.extend({}, defaultConfig, arrow);

    /*
     * Check if arrow.arrowsetID is an array. If true we have to set all arrowsets in the
     * array active or inactive.
     */
    if (arrow.arrowsetID instanceof Array) {

        if (arrow.active instanceof Array) {

            for (i = 0; i < arrow.arrowsetID.length; i++) {

                setArrowset(arrow.arrowsetID[i], arrow.active[i]);

            }

        } else {

            for (i = 0; i < arrow.arrowsetID.length; i++) {

                setArrowset(arrow.arrowsetID[i], arrow.active);

            }

        }

    
    } else if (typeof(arrow.arrowID) !== 'undefined') {

        /*
         * If arrow.arrowsetID is not an array we check if arrow.arrowID is an array.
         * If true, we'll set each arrow of the arrowset active or inactive.
         */
         if (arrow.arrowID instanceof Array) {
    
            if (arrow.active instanceof Array) {

                for (i = 0; i < arrow.arrowID.length; i++) {

                    setArrow(arrow.arrowsetID, arrow.arrowID[i], arrow.active[i]);

                }

            } else {

                for (i = 0; i < arrow.arrowID.length; i++) {

                    setArrow(arrow.arrowsetID, arrow.arrowID[i], arrow.active);

                }

            }

        } else {

            setArrow(arrow.arrowsetID, arrow.arrowID, arrow.active);

        }
    
    /*
     * If no arrow id is given and arrow.arrowsetID is not an array, we only set one arrowset active or inactive
     */
    } else {

        setArrowset(arrow.arrowsetID, arrow.active);

    }
            
};

