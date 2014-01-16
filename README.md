# archerTarget.js

Script to create archery targets.

##License
archerTarget.js is licensed under the of MIT license (see LICENSE-MIT).

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/archer96/archerTarget.js/master/dist/archerTarget.min.js
[max]: https://raw.github.com/archer96/archerTarget.js/master/dist/archerTarget.js

In your web page:

```html
<script src="dist/archerTarget.min.js"></script>
<script src="dist/targets/archerTarget.targets.min.js"></script>
<script>new ArcherTarget(document.getElementById('myTarget'));</script>
```
## Build
requires grunt >=4.0:
`npm install grunt`

then run:
`grunt`

More information in the [CONTRIBUTING](https://github.com/archer96/archerTarget.js/master/CONTRIBUTING.md) file.

## Documentation
_(Coming soon)_

## Examples
Example are available in the `example` directory.

## Release History ##

- 2014/01/16 - v0.3.8
	- Change: using tabs instead of spaces
	- Fix: not giving error anymore when arrow x or y is NaN

- 2014/01/03 - v0.3.7
	- fix hover style with touch enabled
	- add strokeWidth
	- fix getRing() with no arguments
	- add `statistic` plugin

- 2013/12/30 - v0.3.6
	- merge touch and non touch files
	- merge get() files
	- remove some events
	- add some get() functions

- 2013/11/29 - v0.3.5 - add possibility of removing event listeners (helpful for reinitializing)

- 2013/09/29 - v0.3.4 - fixed event unbinding: when reinitializing ArcherTarget.js on an element, we now unbind the events without cloning an replacing the element.

- 2013/07/30 - v0.3.3
	- fixe container mouse events
	- fixe bug where events are fired twice if the element was used before for a target

- 2013/07/29 - v0.3.2 - add some functions in `isType.js` to check whether an object is an element or a node object. This fixes a bug with `setArrowOptions`.

- 2013/07/06 - v0.3.1 - Rewritten. New name: archerTarget.js. Doesn't use jQuery or Zepto anymore. Some other bugfixes.

- 2013/01/31 - v0.3pre - Rewritten. jQuery.archerTarget now uses nodejs and grunt. Some other bugfixes.

