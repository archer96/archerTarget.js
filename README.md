# jArcherTarget
jArcherTarget is a jQuery plugin to display archery targets and arrows on an easy way on websites.
Source avaiable on [GitHub](https://github.com/archer96/jarchertarget).


## About
jArcherTarget is a simple and easy to use [jQuery](http://jquery.com) plugin create by [Andre Meyering](http://andremeyering.de). It was created for use in [Archer'sTargetFriend](http://archery.andremeyering.de) but can be used on websites, too.


##License
jArcherTarget is licensed unter the of MIT license (see LICENSE).


## Issues
When [submitting issues on github](https://github.com/archer96/jarchertarget/issues) please include following:

1. Issue description
2. If necessary create an example page using [JSFiddle](http://jsfiddle.net/) or [JSBin](http://jsbin.com)
3. jArcherTarget version
4. Browsers/platforms tested

Also please check your grammar and spelling and don't use shortened forms, because that could be hard to understand for other people (like me).

## Build
It's simple to build a minified version of jArcherTarget. First you need to install [UglifyJS](https://github.com/mishoo/UglifyJS) and run the following command to create the minified jArcherTarget file:

(Mac & Linux)

> ./build.sh

It will create the minified file.

If you want a new minified version of the targets, go into the 'targets' folder and run this command:

(Mac & Linux)

> ./build.sh


##Changelog

###0.2

* Fixed bug #1, #2
* added VERSION file
* deleted autoloader.js and added script tags in index.html
* changed the .data parameter. Now arrowset[i].data[j] is no more an array. Instead it is an object now.
 * { x: 50, y: 50, ring: X, target: 1, element: node}
* added getTargetParams
* added setArrowStyle
* renamed setArrows to setArrowPosition
* renamed setActive to setArrowActive
* added setArrowOptions
* removed a bug (arrow position was changed wrong, everytime the user only clicked on an arrow; only appeard if 'draggable' was an object)
* changed from Google Closure Compiler to UglifyJS

###0.1

* First version


## Other Notes

This project uses the vector script from [jvectormap.com](http://jvectormap.com) to create SVG nodes.
