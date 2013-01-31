# jQuery.archerTarget

jQuery and Zepto plugin for archers.

##License
jQuery.archerTarget is licensed unter the of MIT license (see LICENSE-MIT).

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/archer96/jQuery.archerTarget/master/dist/jquery.archerTarget.min.js
[max]: https://raw.github.com/archer96/jQuery.archerTarget/master/dist/jquery.archerTarget.js

In your web page:

```html
<script src="jquery.js"></script>
<!--
    We support Zepto, too!
    <script src="jquery.js"></script>
-->
<script src="dist/jquery.archerTarget.min.js"></script>
<script src="dist/targets/jquery.archerTarget.targets.min.js"></script>
<script>
(function($) {
    $('#myTarget').archerTarget();
}(window.jQuery || window.Zepto));
</script>
```
## Build
requires latest grunt:
`npm install grunt@master`
More information in the [CONTRIBUTING](https://github.com/archer96/jQuery.archerTarget/master/CONTRIBUTING.md) file.

## Documentation
_(Coming soon)_

## Examples
Example are available in the `example` directory.
Please note that jQuery.archerTargets requires the latest Zepto or jQuery version.

## Release History ##

 - 2013/01/31 - v0.3pre - Rewritten. jQuery.archerTarget now uses nodejs and grunt. Some other bugfixes.

