#!/bin/bash

files=( \
  jarchertarget.js \
  lib/bindArrowEvents.js \
  lib/bindContainerEvents.js \
  lib/bindTargetEvents.js \
  lib/bindZoomEvents.js \
  lib/checkClosestTarget.js \
  lib/checkOnTarget.js \
  lib/createArrowPointer.js \
  lib/createArrows.js \
  lib/createTargets.js \
  lib/calculateRing.js \
  lib/getRing.js \
  lib/getTargetParams.js \
  lib/getTransform.js \
  lib/removeArrowPointer.js \
  lib/setArrowActive.js \
  lib/setArrowOptions.js \
  lib/setArrowPointer.js \
  lib/setArrowPosition.js \
  lib/setArrowStyle.js \
  lib/setBackgroundColor.js \
  lib/setGap.js \
  lib/setSize.js \
  lib/setTargetStyle.js \
  lib/setTransform.js \
  lib/setZoom.js \
  lib/vectorCanvas.js \
)

baseDir=`dirname $0`

counter=0
while [ $counter -lt ${#files[@]} ]; do
files[$counter]="$baseDir/${files[$counter]}"
  let counter=counter+1
done

if [ -z "$1" ]
  then
minified=jarchertarget.min.js
  else
minified=$1
fi

if [ -a $minified ]
  then
rm $minified
fi

cat ${files[*]} >> $minified

uglifyjs --overwrite $minified