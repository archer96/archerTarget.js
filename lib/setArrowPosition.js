/**
 * Sets the position of an arrow or arrows in an arrowset. Position has to be saved in 'this.arrow[i].data[j]'.
 * 
 * @param {Object} [arrow] Should be an object containing the ID's of arrows and arrowsets. If arrow is no given, we'll set the position of all arrows and arrowsets.
 * @param {Integer|Array} arrow.arrowsetID  ID of the arrowset or an array containing the ID's of the the arrowsets
 * @param {Integer|Array} [arrow.arrowID]   ID of the arrow. If given, the arrow.arrowsetID has to be an integer and not an array
 */
 jat.Target.prototype.setArrowPosition = function (arrow) {
            
    var i,
        j,
        self = this,
        defaultConfig = {
            
        },
        /**
         * Sets the position of an arrow
         * @param {[type]} arrowsetID Id of the arrowsets
         * @param {[type]} arrowID    ID of the arrow
         */
        setPosition = function (arrowsetID, arrowID) {

            self.arrow[arrowsetID].data[arrowID].element.setPosition({
                x: (self.convertTo.px.x(self.arrow[arrowsetID].data[arrowID].x, self.arrow[arrowsetID].data[arrowID].target)),
                y: (self.convertTo.px.y(self.arrow[arrowsetID].data[arrowID].y, self.arrow[arrowsetID].data[arrowID].target))
            });

        };


    if (typeof(arrow) === 'undefined') {

        /*
         * Set the position of all arrows
         */
        for (i = 0; i < self.arrow.length; i++) {

            for (j = 0; j < self.arrow[i].data.length; j++) {

                setPosition(i, j);
                
            }
        }


    } else {

        /*
         * Merge default and given config
         */
        arrow = $.extend({}, defaultConfig, arrow);


        /*
         * Check if arrow.arrowsetID is an array. If true we have to set the position of
         * all arrows in the given arrowsets
         */
        if (arrow.arrowsetID instanceof Array) {

            for (i = 0; i < arrow.arrowsetID.length; i++) {

                for (j = 0; j < self.arrow[arrow.arrowsetID[i]].data.length; j++) {

                    setPosition(arrow.arrowsetID[i], j);
                    
                }
            }

        } else if (typeof(arrow.arrowID) !== 'undefined') {

            /*
             * If arrow.arrowsetID is not an array we'll check if arrow.arrowID is an array.
             * If true, we'll reset the position of all given arrows in the arrowset
             */
             if (arrow.arrowID instanceof Array) {
        
                for (i = 0; i < arrow.arrowID.length; i++) {

                    setPosition(arrow.arrowsetID, arrow.arrowID[i]);

                }

            } else {

                setPosition(arrow.arrowsetID, arrow.arrowID);

            }
        
        /*
         * If no arrow id is given and arrow.arrowsetID is not an array, we only reset one arrowset
         */
        } else {

            setPosition(arrow.arrowsetID, arrow.active);

            for (i = 0; i < self.arrow[arrow.arrowsetID].data.length; i++) {

                setPosition(arrow.arrowsetID, i);
                    
            }

        }
    }  

};