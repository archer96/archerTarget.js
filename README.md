# jArcherTarget
jArcherTarget is a jQuery plugin to display archery targets and arrows on an easy way on websites.
Source avaiable on [GitHub](https://github.com/archer96/jarchertarget).


## About

### About the programmer
Well, my name is Andre Meyering, I'm 16 years old and come from Germany. Of course some of my hobbies are archery and and programming. I love archery and currently I am learning JavaScript heavily because m javascript knowledge isn't that large.

### About the script
jArcherTarget is a simple [jQuery](http://jquery.com) plugin and it's really easy to use. It was created for use in [Archer'sTargetFriend](http://archery.andremeyering.de) but can be used on websites, too.


##License
jArcherTarget is licensed unter the of MIT MIT license (see LICENSE).


## Issues
When [submitting issues on github](https://github.com/archer96/jarchertarget/issues) please include following:

1. Issue description
2. If necessary create an example page using [JSFiddle](http://jsfiddle.net/) or [JSBin](http://jsbin.com)
3. jArcherTarget version
4. Browsers/platforms tested

Also please check your grammar and spelling and don't use shortened forms, because that could be hard to understand for other people (like me).

## Build
It's simple to build a minified version of jArcherTarget. First you need to download the [closure compiler](https://developers.google.com/closure/compiler/) because it's not included in the project. Save the file into the project folder and rename the file to 'closure-compiler.jar'. Then run the following command in your terminal (note that you have to be in the project directory)

(Mac & Linux)

> ./build.sh

It will create two files:

* jarchertarget.min.js
* targets/targets.min.js


##Changelog

###0.2

* Fixed bug #1, #2
* added VERSION file
* edited README
* deleted autoloader.js and added script tags in index.html
* changed the .data parameter. Now arrowset[i].data[j] is no more an array. Instead it is an object now.
 * { x: 50, y: 50, ring: X, target: 1, element: node}
* added getTargetParams


###0.1

* First version


## Other Notes

This project uses the vector script from [jvectormap.com](http://jvectormap.com) to create SVG nodes.
