Acko.preload = function (files, callback) {
  // Only callback passed.
  if (files instanceof Function) {
    callback = files;
    files = [];
  }

  // Allow single file.
  files = typeof files == 'string' ? [files] : files;

  // Completion counter
  var remaining = files.length;
  var accumulate = {};
  var ping = function (data) {
    // Collect objects
    _.extend(accumulate, data || {});

    // Call callback if done.
    if (--remaining == 0) {
      callback(accumulate);
    };
  }

  // Prepare extensions
  var l = Acko.preload;
  var regexps = {},
      exts = {
        'html': l.html,
        'jpg': l.image,
        'png': l.image,
        'gif': l.image,
        'mp3': l.audio,
      };
  _.each(exts, function (handler, ext) {
    regexps[ext] = new RegExp('\\.' + ext + '$');
  });

  // Load individual file
  _.each(files, function (file) {
    var alias;

    // Alias
    if (_.isArray(file)) {
      alias = file[1];
      file = file[0];
    }

    // Use appropriate handler based on extension
    _.each(exts, function (handler, ext) {
      if (file.match(regexps[ext])) {
        var path = file.split(/\//g);
        var name = alias || path.pop().replace(/\.[A-Za-z0-9]+$/, '');

        handler(file, name, ping);
      }
    });
  });

  if (remaining == 0) callback({});
};

Acko.preload.html = function (file, name, callback) {
  new microAjax(file, function (res) {
    var match;

    // Insert javascript directly
    if (match = res.match(/^<script[^>]*type=['"]text\/javascript['"][^>]*>([\s\S]+?)<\/script>$/m)) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = match[1];
      document.body.appendChild(script);
    }
    // Insert HTML via div
    else {
      var div = document.createElement('div');
      div.innerHTML = res;
      document.body.appendChild(div);
    }

    console.log('[Load] HTML', file);
    callback();
  });
};

Acko.preload.image = function (file, name, callback) {
  THREE.ImageUtils.loadTexture(file, null, function (texture) {
    var ret = {};
    ret[name] = texture;

    console.log('[Load] texture', file);
    callback(ret);
  });
};

Acko.preload.audio = function (file, name, callback) {

  // New audio element
  var audio = this.audio = new Audio();
  var url;

  // Assume MP3 with Ogg fallback
  if (audio.canPlayType('audio/mpeg')) {
    url = file;
  }
  else if (audio.canPlayType('audio/ogg')) {
    url = file.replace(/\.mp3/, '.ogg');
  }
  else {
    throw "MP3 or OGG Playback not supported";
  }

  // Inject audio into body
  audio.preload = 'auto';
  audio.style.display = 'none';
  audio.src = url;
  document.body.appendChild(audio);

  // Wait until audio is buffered long enough
  audio.addEventListener('canplaythrough', function () {
    var ret = {};
    ret[name] = audio;
    callback(ret);

    console.log('[Load] audio', file);
  });
}
