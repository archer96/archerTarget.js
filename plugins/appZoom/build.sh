#!/bin/bash

files=( \
  appZoom.js
)

baseDir=`dirname $0`

counter=0
while [ $counter -lt ${#files[@]} ]; do
files[$counter]="$baseDir/${files[$counter]}"
  let counter=counter+1
done

if [ -z "$1" ]
  then
minified=appZoom.min.js
  else
minified=$1
fi

if [ -a $minified ]
  then
rm $minified
fi

cat ${files[*]} >> $minified

uglifyjs --overwrite $minified