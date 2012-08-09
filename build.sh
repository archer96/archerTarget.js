# Using Google Closure Compiler (https://developers.google.com/closure/compiler/)

# Compile jarchertarget scripts to a minified version
java -jar ./closure-compiler.jar \
--js=jarchertarget.js \
--js=lib/applyTransform.js \
--js=lib/bindArrowEvents.js \
--js=lib/bindContainerEvents.js \
--js=lib/bindTargetEvents.js \
--js=lib/bindZoomEvents.js \
--js=lib/checkClosestTarget.js \
--js=lib/checkOnTarget.js \
--js=lib/createArrowDrag.js \
--js=lib/createArrows.js \
--js=lib/createTargets.js \
--js=lib/calculateRing.js \
--js=lib/getRing.js \
--js=lib/getTargetParams.js \
--js=lib/removeArrowDrag.js \
--js=lib/setArrowActive.js \
--js=lib/setArrowDrag.js \
--js=lib/setArrowPosition.js \
--js=lib/setArrowOptions.js \
--js=lib/setBackgroundColor.js \
--js=lib/setGap.js \
--js=lib/setSize.js \
--js=lib/setArrowStyle.js \
--js=lib/setTargetStyle.js \
--js=lib/setZoom.js \
--js=lib/vectorCanvas.js \
--js_output_file=jarchertarget.min.js


# Compile JS-file with all targets to a minified version
java -jar ./closure-compiler.jar \
--js=targets/targets.js \
--js_output_file=targets/targets.min.js