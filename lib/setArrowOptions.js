/**
 * Merges the given options with the arrowset options (e.g. 'draggable', 'style').
 * 
 * @param {Object}  arrowset
 * @param {Integer} arrowset.arrowsetID  ID of the arrowset
 * @param {Object}  [arrowset.options]   Options to merge
 */
jat.Target.prototype.setArrowOptions = function (arrowset) {
      
    var self = this,
        field,
        methodName,
        i;


    for (field in arrowset.options) {

        if (arrowset.options.hasOwnProperty(field)) {

            methodName = 'setArrow' + field.charAt(0).toUpperCase() + field.substr(1);

            if (arrowset.options[field] !== self.arrow[arrowset.arrowsetID][field]) {

                switch (field) {

                    case 'active':

                        self[methodName]({
                            arrowsetID: arrowset.arrowsetID,
                            active: arrowset.options[field]
                        });

                        break;

                    default:

                        break;

                }
                

            }

        }

    }

    $.extend(true, self.arrow[arrowset.arrowsetID], arrowset.options);
            
};

