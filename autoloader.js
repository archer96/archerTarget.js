/* very simple autoloader */

(function () {
    var autoloader = function () {
        var filesJS = [
        
            'jarchertarget.js',
            'lib/applyTransform.js',
            'lib/bindArrowEvents.js',
            'lib/bindContainerEvents.js',
            'lib/bindTargetEvents.js',
            'lib/bindZoomEvents.js',
            'lib/checkClosestTarget.js',
            'lib/checkOnTarget.js',
            'lib/createArrowDrag.js',
            'lib/createArrows.js',
            'lib/createTargets.js',
            'lib/calculateRing.js',
            'lib/getRing.js',
            'lib/removeArrowDrag.js',
            'lib/setArrowDrag.js',
            'lib/setArrows.js',
            'lib/setBackgroundColor.js',
            'lib/setGap.js',
            'lib/setSize.js',
            'lib/setTargetStyle.js',
            'lib/setZoom.js',
            'lib/vectorCanvas.js',
            'targets/targets.js'
        ],
            
            filesCSS = [
                'jarchertarget.css'
            ],
            i,
            script,
            style,
            body = document.getElementsByTagName("head")[0];
        
        
        var include = function (type, path) {
            
            if (type === 'js') {
                
                script = document.createElement('script');
                script.type = 'text/javascript';
                script.language = 'javascript';
                script.src = path;
    
                body.appendChild(script);
    
                
            } else if (type === 'css') {
                
                
                style = document.createElement('link');
                style.type = 'text/css';
                style.rel = 'stylesheet';
                style.href = path;
    
                body.appendChild(style);
    
            }
             
        };
        
        
        for (i = 0; i < filesJS.length; i = i + 1) {
            include('js', filesJS[i]);
            
        }
        
        
        for (i = 0; i < filesCSS.length; i = i + 1) {
            include('css', filesCSS[i]);
        }
        
        
    };
    
    autoloader();

})();