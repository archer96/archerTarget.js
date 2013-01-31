(function() {
  // Get any zepto=___ param from the query string.
  var zeptoversion = location.search.match(/[?&]zepto=(.*?)(?=&|$)/);
  var path;
  if (zeptoversion) {
    // A version was specified, load that version from cdnjs.cloudflare.com.
    path = 'cdnjs.cloudflare.com/ajax/libs/zepto/ ' + zeptoversion[1] + '/zepto.min.js';
  } else {
    // No version was specified, load the local version.
    path = '../libs/jquery/jquery.js';
  }
  // This is the only time I'll ever use document.write, I promise!
  document.write('<script src="' + path + '"></script>');
}());
