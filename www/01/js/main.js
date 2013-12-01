var CanvasUtils;

CanvasUtils = (function() {
  function CanvasUtils() {}

  CanvasUtils.fromImage = function(image) {
    var canvas, context;
    canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    context = canvas.getContext('2d');
    context.width = image.width;
    context.height = image.height;
    context.drawImage(image, 0, 0);
    return canvas;
  };

  CanvasUtils.dataFromImage = function(image) {
    return CanvasUtils.fromImage(image).getContext('2d').getImageData(0, 0, image.width, image.height);
  };

  return CanvasUtils;

})();

var M_2PI, M_PI, M_PI2, M_PI4, M_PI8;

M_PI = Math.PI;

M_2PI = Math.PI * 2;

M_PI2 = Math.PI / 2;

M_PI4 = Math.PI / 4;

M_PI8 = Math.PI / 8;

var HitTest;

HitTest = (function() {
  function HitTest() {
    return;
  }

  HitTest.testCircle = function(position, object, radius) {
    var dist, dx, dy;
    if (radius == null) {
      radius = object.radius;
    }
    dx = object.position.x - position.x;
    dy = object.position.y - position.y;
    dist = Math.sqrt(dx * dx + dy * dy);
    return dist <= radius;
  };

  HitTest.testElipse = function(position, object, width, height) {
    var dx, dy;
    dx = object.position.x - position.x;
    dy = object.position.y - position.y;
    return ((dx * dx) / (width * width)) + ((dy * dy) / (height * height)) <= 1.0;
  };

  HitTest.testRect = function(position, object) {
    return position.x >= object.position.x && position.y >= object.position.y && position.x <= object.position.x + object.width && position.y <= object.position.y + object.height;
  };

  HitTest.testRect = function(position, object, centred) {
    position.x += object.width / 2;
    position.y += object.height / 2;
    return HitTest.testRect(position, object);
  };

  return HitTest;

})();

var NumberUtils;

NumberUtils = (function() {
  function NumberUtils() {
    throw new Error("you can t create an instance of NumberUtils");
  }

  NumberUtils.addZero = function(string, minLenght) {
    string += "";
    while (string.length < minLenght) {
      string = "0" + string;
    }
    return string;
  };

  return NumberUtils;

})();

var ObjectPool;

ObjectPool = (function() {
  function ObjectPool(create, minSize, maxSize) {
    var _i, _ref;
    this.create = create;
    this.minSize = minSize;
    this.maxSize = maxSize;
    this.list = [];
    for (_i = 0, _ref = this.minSize; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
      this.add();
    }
    return;
  }

  ObjectPool.prototype.add = function() {
    return this.list.push(this.create());
  };

  ObjectPool.prototype.checkOut = function() {
    var i;
    if (this.list.length === 0) {
      return i = this.create();
    } else {
      return i = this.list.pop();
    }
  };

  ObjectPool.prototype.checkIn = function(item) {
    if (this.list.length < this.maxSize) {
      return this.list.push(item);
    }
  };

  return ObjectPool;

})();

/*
# @author Makio64 / David Ronai / Makiopolis.com
#
# Usage :
# SndFX.load(urls,onComplete)
# SndFX.addFilter(id, filter)
# SndFX.getFilter(id)
#
# snd.onComplete = onSndEnd
# 
# snd = new Snd(id)
# snd.play()
# snd.stop()
# snd.connectTo(filter)
# 
# source => panner => gain => filters => masterGain
*/

var Snd;

Function.prototype.property = function(prop, desc) {
  return Object.defineProperty(this.prototype, prop, desc);
};

Snd = (function() {
  Snd.prototype.id = null;

  Snd.prototype.source = null;

  Snd.prototype.gain = null;

  Snd.prototype.destination = null;

  Snd.prototype.panner = null;

  Snd.prototype.domAudio = null;

  Snd.prototype._volume = 0;

  Snd.property('volume', {
    get: function() {
      return this._volume;
    },
    set: function(vol) {
      if (vol <= 1) {
        vol = parseFloat(vol);
        if (SndFX.instance.webAudio) {
          this.gainNode.gain.value = vol;
        } else {
          this.domAudio.volume = vol;
        }
        return this._volume = vol;
      }
    }
  });

  Snd.prototype.onComplete = null;

  function Snd(id, options) {
    if (options == null) {
      options = {};
    }
    this.id = id = SndFX.instance.replaceSuffix(id);
    options.autoplay = options.autoplay || false;
    if (options.loop === void 0) {
      options.loop = false;
    }
    if (SndFX.instance.webAudio) {
      if (options.volume === void 0) {
        options.volume = 1.0;
      }
    } else {
      if (options.volume === void 0) {
        options.volume = SndFX.instance.volume;
      }
    }
    options.destination = options.destination || SndFX.instance.fxGain;
    if (SndFX.instance.webAudio) {
      this.source = SndFX.instance.context.createBufferSource();
      this.source.buffer = SndFX.instance.buffers[id];
      this.gainNode = SndFX.instance.createGain();
      this.gainNode.connect(options.destination);
      this.panner = SndFX.instance.createPanner();
      this.panner.setPosition(0, 0, 0);
      this.panner.connect(this.gainNode);
      this.source.connect(this.panner);
      if (options.autoplay) {
        this.play(0, options.loop);
      }
    } else {
      this.domAudio = new Audio();
      this.domAudio.autoplay = options.autoplay;
      this.domAudio.src = id;
      this.domAudio.loop = options.loop;
      this.domAudio.load();
    }
    this.volume = options.volume;
    return this;
  }

  Snd.prototype.play = function(_when, _loop) {
    if (_when == null) {
      _when = 0;
    }
    if (_loop == null) {
      _loop = false;
    }
    if (SndFX.instance.webAudio) {
      this.source.loop = _loop;
      if (!this.source.start) {
        this.source.noteOn(_when);
      } else {
        this.source.start(_when);
      }
    } else {
      this.domAudio.loop = _loop;
      this.domAudio.play();
    }
    return this;
  };

  Snd.prototype.stop = function(delay) {
    if (delay == null) {
      delay = 0;
    }
    if (SndFX.instance.webAudio) {
      if (!this.source.stop) {
        this.source.noteOff(delay);
      } else {
        this.source.stop(delay);
      }
    } else {
      this.domAudio.pause();
    }
    return this;
  };

  Snd.prototype.setPosition = function(x, y, z) {
    if (y == null) {
      y = 0;
    }
    if (z == null) {
      z = 0;
    }
    this.panner.setPosition(x, y, z);
  };

  Snd.prototype.connectTo = function(destination, autoConnectDestination, disconnect) {
    if (autoConnectDestination == null) {
      autoConnectDestination = false;
    }
    if (disconnect == null) {
      disconnect = true;
    }
    if (!SndFX.instance.webAudio) {
      return;
    }
    if (disconnect) {
      this.gainNode.disconnect(0);
    }
    this.gainNode.connect(destination);
    if (autoConnectDestination) {
      destination.connect(SndFX.instance.fxGain);
    }
    return this;
  };

  Snd.prototype.connectToMaster = function() {
    this.connectTo(SndFX.instance.masterGain);
  };

  Snd.prototype.connectToFX = function() {
    this.connectTo(SndFX.instance.fxGain);
  };

  Snd.prototype.connectToMusicGain = function() {
    this.connectTo(SndFX.instance.musicGain);
  };

  Snd.prototype.update = function(dt) {};

  Snd.prototype.dispose = function() {
    var id;
    if (SndFX.instance.webAudio) {
      this.panner.disconnect(0);
      this.gainNode.disconnect(0);
      this.source.disconnect(0);
      this.source.stop(0);
      this.panner = null;
      this.gainNode = null;
      this.source.buffer = null;
      this.source = null;
    } else {
      this.domAudio.pause();
      this.domAudio = null;
    }
    SndFX.remove(this);
    id = null;
  };

  return Snd;

})();

var SndFX;

SndFX = (function() {
  SndFX.prototype.cache = {};

  SndFX.prototype.context = null;

  SndFX.prototype.masterGain = null;

  SndFX.prototype.fxGain = null;

  SndFX.prototype.musicGain = null;

  SndFX.prototype._volume = 1;

  SndFX.prototype.buffers = null;

  SndFX.prototype.snds = null;

  SndFX.prototype.codecs = null;

  SndFX.prototype.onload = null;

  SndFX.prototype.urls = null;

  SndFX.prototype.loadCount = 0;

  SndFX.prototype.webAudio = false;

  function SndFX() {
    var audioTest;
    if (SndFX.instance) {
      throw new Error("You can't create an instance of SndFX");
    }
    if (window.AudioContext) {
      this.webAudio = true;
      this.context = new AudioContext();
    } else if (window.webkitAudioContext) {
      this.webAudio = true;
      this.context = new webkitAudioContext();
    } else {
      this.webAudio = false;
    }
    if (this.webAudio) {
      this.masterGain = this.createGain();
      this.masterGain.gain.value = 1;
      this.masterGain.connect(this.context.destination);
      this.fxGain = this.createGain();
      this.fxGain.gain.value = 1;
      this.fxGain.connect(this.masterGain);
      this.musicGain = this.createGain();
      this.musicGain.gain.value = 1;
      this.musicGain.connect(this.masterGain);
    }
    audioTest = new Audio();
    this.codecs = {
      mp3: !!audioTest.canPlayType('audio/mpeg;').replace(/^no$/, ''),
      opus: !!audioTest.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ''),
      ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
      wav: !!audioTest.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ''),
      m4a: !!(audioTest.canPlayType('audio/x-m4a;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
      webm: !!audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, '')
    };
    this.cache = {};
    this.buffers = {};
    this.snds = [];
    return;
  }

  SndFX.prototype.volume = function(vol) {
    var snd, _i, _len, _ref;
    vol = parseFloat(vol);
    if (vol && vol >= 0 && vol <= 1) {
      this._volume = vol;
      if (this.webAudio) {
        this.masterGain.gain.value = vol;
      } else {
        _ref = this.sounds;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          snd = _ref[_i];
          snd.volume(vol);
        }
      }
    }
    if (this.webAudio) {
      return this.masterGain.gain.value;
    } else {
      return this._volume;
    }
  };

  SndFX.prototype.load = function(urls, callback) {
    var i, loader, _i, _j, _k, _ref, _ref1, _ref2;
    this.urls = urls;
    if (callback == null) {
      callback = null;
    }
    for (i = _i = 0, _ref = urls.length; _i < _ref; i = _i += 1) {
      urls[i] = this.replaceSuffix(urls[i]);
    }
    this.onload = callback;
    this.loadCount = 0;
    loader = this;
    if (this.webAudio) {
      for (i = _j = 0, _ref1 = urls.length; _j < _ref1; i = _j += 1) {
        this.loadBuffer(urls[i], i);
      }
    } else {
      for (i = _k = 0, _ref2 = urls.length; _k < _ref2; i = _k += 1) {
        this.loadAudio(urls[i]);
      }
    }
  };

  SndFX.prototype.replaceSuffix = function(url) {
    var suffix;
    if (this.codecs.mp3) {
      return url;
    }
    suffix = "";
    if (this.codecs.ogg) {
      suffix = "ogg";
    } else if (this.codecs.wav) {
      suffix = "wav";
    } else {
      return url;
    }
    url = url.replace("mp3", suffix);
    return url;
  };

  SndFX.prototype.loadBuffer = function(url, index) {
    var loader, request;
    request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    loader = this;
    request.onload = function() {
      var _this = this;
      return loader.context.decodeAudioData(request.response, function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.buffers[loader.replaceSuffix(url)] = buffer;
        if (++loader.loadCount === loader.urls.length && loader.onload !== null) {
          return loader.onload();
        }
      }, function(error) {
        return console.error('decodeAudioData error', error);
      });
    };
    request.onerror = function() {
      return alert('BufferLoader: XHR error');
    };
    request.send();
  };

  SndFX.prototype.loadAudio = function(url) {
    var loader, sound,
      _this = this;
    loader = this;
    sound = new Audio();
    this.cache[url] = sound;
    sound.addEventListener("canplaythrough", function() {
      if (++loader.loadCount === loader.urls.length && loader.onload !== null) {
        return loader.onload();
      }
    }, false);
    sound.src = url;
    sound.load();
  };

  SndFX.prototype.getByID = function(id) {
    var snd, _i, _len, _ref;
    _ref = this.sounds;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      snd = _ref[_i];
      if (snd.id === id) {
        return snd;
      }
    }
    return null;
  };

  SndFX.prototype.createGain = function() {
    if (this.context.createGain) {
      return this.context.createGain();
    } else {
      return this.context.createGainNode();
    }
  };

  SndFX.prototype.createPanner = function() {
    if (this.context.createPanner) {
      return this.context.createPanner();
    } else {
      return this.context.createPannerNode();
    }
  };

  SndFX.prototype.createAnalyser = function() {
    var analyser;
    if (this.context.createAnalyser) {
      analyser = this.context.createAnalyser();
    } else {
      analyser = this.context.createAnalyserNode();
    }
    analyser.smoothingTimeConstant = 0;
    analyser.fftSize = 2048;
    return analyser;
  };

  SndFX.prototype.createJavaScript = function() {
    var jsNode;
    if (this.context.createJavaScript) {
      jsNode = this.context.createJavaScript(2048, 1, 1);
    } else {
      jsNode = this.context.createJavaScriptNode(2048, 1, 1);
    }
    jsNode.connect(this.fxGain);
    return jsNode;
  };

  SndFX.prototype.remove = function(snd) {
    var idx;
    idx = this.sounds.indexOf(snd);
    if (idx === -1) {
      return;
    }
    return this.sounds.splice(idx, 1);
  };

  SndFX.prototype.update = function(dt) {
    var snd, _i, _len, _ref, _results;
    _ref = this.sounds;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      snd = _ref[_i];
      _results.push(snd.update(dt));
    }
    return _results;
  };

  SndFX.instance = new SndFX();

  return SndFX;

})();

var AScene;

AScene = (function() {
  AScene.prototype.stage = null;

  AScene.prototype.callback = null;

  function AScene(stage) {
    this.stage = stage;
    return;
  }

  AScene.prototype.transitionIn = function(callback) {
    this.callback = callback;
    this.onTransitionInComplete();
  };

  AScene.prototype.transitionOut = function(callback) {
    this.callback = callback;
    this.onTransitionOutComplete();
  };

  AScene.prototype.onTransitionOutComplete = function() {
    this.callback();
  };

  AScene.prototype.onTransitionInComplete = function() {
    this.callback();
  };

  AScene.prototype.onEnter = function() {};

  AScene.prototype.onExit = function() {};

  AScene.prototype.update = function(dt) {};

  AScene.prototype.resize = function(width, height) {};

  AScene.prototype.dispose = function() {
    this.stage = null;
    this.callback = null;
  };

  return AScene;

})();

var LoadScene,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

LoadScene = (function(_super) {
  __extends(LoadScene, _super);

  function LoadScene(stage) {
    this.travel = __bind(this.travel, this);
    this.onClick = __bind(this.onClick, this);
    this.onSoundLoaded = __bind(this.onSoundLoaded, this);
    this.loadSound = __bind(this.loadSound, this);
    this.loadData = __bind(this.loadData, this);
    LoadScene.__super__.constructor.call(this, stage);
    return;
  }

  LoadScene.prototype.onEnter = function() {
    this.loadData();
  };

  LoadScene.prototype.loadData = function() {
    var loader;
    loader = new THREE.JSONLoader();
    loader.load("./img/model/Mario64.js", this.loadSound);
  };

  LoadScene.prototype.loadSound = function() {
    var urlList;
    urlList = ["./sfx/snow.mp3", "./sfx/machine.mp3", "./sfx/woohoo.mp3", "./sfx/ooh.mp3", "./sfx/clear.mp3"];
    SndFX.instance.load(urlList, this.onSoundLoaded);
  };

  LoadScene.prototype.onSoundLoaded = function() {
    $("#loading .t2").addClass("activate");
    $("#loading .t1").addClass("removed");
    document.addEventListener("click", this.onClick, false);
  };

  LoadScene.prototype.onClick = function() {
    document.removeEventListener("click", this.onClick, false);
    $("#loading").addClass("removed");
    $("#loading2").addClass("removed");
    setTimeout(this.travel, 350);
  };

  LoadScene.prototype.travel = function() {
    return SceneTraveler.getInstance().travelTo(new StartScene(this.stage));
  };

  return LoadScene;

})(AScene);

var SceneTraveler,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

SceneTraveler = (function() {
  var instance;

  function SceneTraveler() {
    this.onTransitionInComplete = __bind(this.onTransitionInComplete, this);
    this.onTransitionOutComplete = __bind(this.onTransitionOutComplete, this);
    this.travelTo = __bind(this.travelTo, this);
  }

  SceneTraveler.prototype.currentScene = null;

  SceneTraveler.prototype.nextScene = null;

  SceneTraveler.prototype.transitioning = false;

  instance = null;

  SceneTraveler.getInstance = function() {
    if (instance == null) {
      instance = new SceneTraveler();
    }
    return instance;
  };

  SceneTraveler.prototype.travelTo = function(scene) {
    this.nextScene = scene;
    if (this.currentScene !== null) {
      this.currentScene.transitionOut(this.onTransitionOutComplete);
    } else {
      this.onTransitionOutComplete();
    }
  };

  SceneTraveler.prototype.onTransitionOutComplete = function() {
    if (this.currentScene !== null) {
      this.currentScene.onExit();
      this.currentScene.dispose();
    }
    this.currentScene = this.nextScene;
    this.currentScene.onEnter();
    this.currentScene.transitionIn(this.onTransitionInComplete);
    this.nextScene = null;
  };

  SceneTraveler.prototype.onTransitionInComplete = function() {};

  return SceneTraveler;

})();

var StartScene,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

StartScene = (function(_super) {
  __extends(StartScene, _super);

  function StartScene(stage) {
    this.onaudioprocess = __bind(this.onaudioprocess, this);
    this.update = __bind(this.update, this);
    this.mouseMove = __bind(this.mouseMove, this);
    this.onHit = __bind(this.onHit, this);
    this.mouseDown = __bind(this.mouseDown, this);
    this.packGift = __bind(this.packGift, this);
    var ground, ground2, groundGeo, groundMat, v, _i, _len, _ref;
    StartScene.__super__.constructor.call(this, stage);
    this.state = 0;
    this.pause = true;
    this.camera = main.camera;
    this.renderer = main.renderer;
    this.scene = main.scene;
    this.focus = main.focus;
    this.vignette = main.vignette;
    this.vignette2 = main.vignette2;
    this.camera.position.y = 150;
    this.camera.position.x = 0;
    this.camera.lookAt(this.scene.position);
    this.pointLight = new THREE.PointLight(0xFFFFFF, .7, 200);
    this.pointLight.position.set(100, 30, 0);
    this.scene.add(this.pointLight);
    this.pointLight = new THREE.PointLight(0xFFFFFF, .7, 200);
    this.pointLight.position.set(-100, 30, 0);
    this.scene.add(this.pointLight);
    this.pointLight = new THREE.PointLight(0xFFFFFF, 1, 200);
    this.pointLight.position.set(0, 100, 140);
    this.scene.add(this.pointLight);
    groundGeo = new THREE.PlaneGeometry(10000, 10000, 100, 100);
    _ref = groundGeo.vertices;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      v = _ref[_i];
      v.z += Math.random() * 40;
      if (Math.random() < 0.04 && Math.abs(v.z) + Math.abs(v.x) + Math.abs(v.y) > 900) {
        v.z += 50 + Math.random() * 300;
      }
    }
    groundGeo.dynamic = true;
    groundGeo.verticesNeedUpdate = true;
    groundMat = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF
    });
    ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -150;
    this.scene.add(ground);
    this.ground = ground;
    ground2 = new THREE.Mesh(groundGeo, groundMat);
    ground2.rotation.x = -Math.PI / 2;
    ground2.position.y = -150;
    ground2.position.z = -5000;
    this.scene.add(ground2);
    this.ground2 = ground2;
    this.wind = new Wind();
    this.scene.add(this.wind);
    this.head = new Head();
    this.scene.add(this.head);
    this.hammer = new Hammer(this);
    this.scene.add(this.hammer);
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    this.camera.lookAt(this.scene.position);
    this.music = new Snd("./sfx/snow.mp3");
    this.music.volume = 0;
    this.music.play();
    TweenLite.to(this.music, 2, {
      volume: 0.3
    });
    this.analyser = SndFX.instance.createAnalyser();
    this.jsNode = SndFX.instance.createJavaScript();
    this.jsNode.onaudioprocess = this.onaudioprocess;
    this.analyser.connect(this.jsNode);
    this.music.connectTo(this.analyser, false, false);
    document.addEventListener("mousemove", this.mouseMove, false);
    document.addEventListener("mousedown", this.mouseDown, false);
    return;
  }

  StartScene.prototype.packGift = function() {
    var fx;
    this["package"] = new Package();
    this.scene.add(this["package"]);
    TweenLite.to(Constant, 1.3, {
      delay: .1,
      cameraZ: 200
    });
    Constant.vignette2Offset = 1.08;
    Constant.vignette2Darkness = 0;
    this.ready = false;
    TweenLite.to(this.music, .5, {
      volume: 0
    });
    $("#slogan").addClass("activate");
    fx = new Snd("./sfx/clear.mp3");
    fx.play();
  };

  StartScene.prototype.mouseDown = function(e) {
    this.hammer.hit(this.onHit);
  };

  StartScene.prototype.onHit = function() {
    this.head.hit(this.hammer);
    Constant.convexRatio = 0.325;
  };

  StartScene.prototype.mouseMove = function(e) {
    this.mouseX = e.pageX;
    this.mouseY = e.pageY;
  };

  StartScene.prototype.onEnter = function() {};

  StartScene.prototype.update = function(dt) {
    if (this.pause) {
      return;
    }
    this.vignette2.uniforms["offset"].value += (Constant.vignette2Offset - this.vignette2.uniforms["offset"].value) * .16;
    this.vignette2.uniforms["darkness"].value += (Constant.vignette2Darkness - this.vignette2.uniforms["darkness"].value) * .16;
    Constant.convexRatio += (0.00 - Constant.convexRatio) * 0.09;
    this.head.update(this.hammer);
    this.wind.update(dt);
    this.camera.position.x += ((this.mouseX / window.innerWidth) * 600 - 300 - this.camera.position.x) * 0.05;
    this.camera.position.y += ((this.mouseY / window.innerHeight) * 400 - this.camera.position.y) * 0.05;
    this.camera.position.z += (Constant.cameraZ - this.camera.position.z) * 0.05;
    this.camera.lookAt(this.scene.position);
  };

  StartScene.prototype.onaudioprocess = function() {
    var array, average;
    this.pause = false;
    array = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(array);
    average = this.getAverage(array);
    this.vignette.uniforms["darkness"].value += (average * .2 - this.vignette.uniforms["darkness"].value) * Constant.brightnessEase;
    this.focus.uniforms["waveFactor"].value += (average * Constant.convexRatio - this.focus.uniforms["waveFactor"].value) * Constant.convexEase;
    if (average > 0 && this.state === 0) {
      this.state = 1;
      this.hammer.open();
    }
  };

  StartScene.prototype.getAverage = function(array) {
    var i, values, _i, _ref;
    values = 0;
    for (i = _i = 0, _ref = array.length; _i < _ref; i = _i += 1) {
      values += array[i];
    }
    return values / array.length;
  };

  return StartScene;

})(AScene);

/*
# Bezier
# Quadratic bezier ( curve define by 3 points )
# @author David Ronai aka Makio64 // makiopolis.com
*/

var Bezier;

Bezier = (function() {
  var _this = this;

  Bezier.prototype.p0 = null;

  Bezier.prototype.p1 = null;

  Bezier.prototype.p2 = null;

  function Bezier(p0, p1, p2) {
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
  }

  Bezier.prototype.dispose = function() {
    this.p0.dispose();
    this.p1.dispose();
    this.p2.dispose();
    this.p2 = null;
    this.p1 = null;
    return this.p0 = null;
  };

  Bezier.prototype.getBezierPoint = function(t) {
    var x, y;
    if (t == null) {
      t = 0.0;
    }
    x = Math.pow(1 - t, 2) * this.p0.x + 2 * t * (1 - t) * this.p1.x + Math.pow(t, 2) * this.p2.x;
    y = Math.pow(1 - t, 2) * this.p0.y + 2 * t * (1 - t) * this.p1.y + Math.pow(t, 2) * this.p2.y;
    return new Point(x, y);
  };

  Bezier.prototype.toCubic = function() {
    var new1, new2, points;
    points = [];
    new1 = new Point((this.p1.x + this.p0.x) * .5, (this.p1.y + this.p0.y) * .5);
    new2 = new Point((this.p2.x + this.p1.x) * .5, (this.p2.y + this.p1.y) * .5);
    points[0] = new Point(this.p0.x, this.p0.y);
    points[1] = new1;
    points[2] = new2;
    points[3] = new Point(this.p2.x, this.p2.y);
    return points;
  };

  Bezier.toBezier = function(points, division) {
    var b, c, cubic, finalPoints, i, p1, p2, p3, t, _i, _j, _k, _ref, _ref1, _ref2;
    if (division == null) {
      division = 10;
    }
    cubic = [];
    finalPoints = [];
    for (i = _i = 0, _ref = points.length - 1; _i < _ref; i = _i += 1) {
      p1 = points[i];
      p2 = points[(i + 1) % points.length];
      p3 = points[(i + 2) % points.length];
      b = new Bezier(p1, p2, p3);
      c = b.toCubic();
      cubic.push(p1);
      cubic.push(c[1]);
    }
    for (i = _j = 1, _ref1 = cubic.length - 3; _j < _ref1; i = _j += 2) {
      p1 = cubic[i];
      p2 = cubic[i + 1];
      p3 = cubic[i + 2];
      b = new Bezier(p1, p2, p3);
      for (t = _k = 0.0, _ref2 = 1.0 / division; _ref2 > 0 ? _k < 1.0 : _k > 1.0; t = _k += _ref2) {
        finalPoints.push(b.getBezierPoint(t));
      }
    }
    return finalPoints;
  };

  return Bezier;

}).call(this);

/*
# CubicBezier - Bezier
# Simple class for cubic bezier ( curve define by 4 points )
# @author David Ronai aka Makio64 // makiopolis.com
*/

var CubicBezier;

CubicBezier = (function() {
  CubicBezier.prototype.p0 = null;

  CubicBezier.prototype.p1 = null;

  CubicBezier.prototype.p2 = null;

  CubicBezier.prototype.p3 = null;

  function CubicBezier(p0, p1, p2, p3) {
    this.p3 = p3;
    this.p2 = p2;
    this.p1 = p1;
    this.p0 = p0;
  }

  CubicBezier.prototype.dispose = function() {
    this.p0.dispose();
    this.p1.dispose();
    this.p2.dispose();
    this.p3.dispose();
    this.p3 = null;
    this.p2 = null;
    this.p1 = null;
    return this.p0 = null;
  };

  CubicBezier.prototype.getBezierPoint = function(t) {
    if (t == null) {
      t = 0.0;
    }
    return new Point(Math.pow(1 - t, 3) * this.p0.x + 3 * t * Math.pow(1 - t, 2) * this.p1.x + 3 * t * t * (1 - t) * this.p2.x + t * t * t * this.p3.x, Math.pow(1 - t, 3) * this.p0.y + 3 * t * Math.pow(1 - t, 2) * this.p1.y + 3 * t * t * (1 - t) * this.p2.y + t * t * t * this.p3.y);
  };

  return CubicBezier;

})();

var Point;

Point = (function() {
  var euclidean;

  Point.prototype.x = 0.0;

  Point.prototype.y = 0.0;

  function Point(x, y) {
    this.x = x;
    this.y = y;
    return;
  }

  euclidean = function(p1, p2) {
    var a, b;
    a = (p1 != null ? p1.x : void 0) - (p2 != null ? p2.x : void 0);
    b = (p1 != null ? p1.y : void 0) - (p2 != null ? p2.y : void 0);
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
  };

  Point.prototype.add = function(p) {
    this.x += p.x;
    return this.y += p.y;
  };

  Point.prototype.sub = function(p) {
    this.x -= p.x;
    return this.y -= p.y;
  };

  Point.prototype.scale = function(value) {
    this.x *= value;
    return this.y *= value;
  };

  Point.prototype.draw = function(ctx) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(this.x, this.y, 1, 1);
  };

  Point.prototype.toString = function() {
    return "(" + this.x + ", " + this.y + ")";
  };

  Point.prototype.dispose = function() {};

  return Point;

})();

var Gift,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Gift = (function(_super) {
  __extends(Gift, _super);

  function Gift() {
    this.dispose = __bind(this.dispose, this);
    var shader;
    this.geometry = new THREE.SphereGeometry(30, 20, 20);
    shader = THREE.SpiritShader;
    console.log(shader);
    this.uniforms = THREE.UniformsUtils.clone(shader.uniforms);
    this.uniforms["tDiffuse"].value = THREE.ImageUtils.loadTexture("./img/textures/crystal-13.jpg");
    this.material = new THREE.ShaderMaterial({
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: this.uniforms,
      transparent: true
    });
    THREE.Mesh.call(this, this.geometry, this.material);
    return;
  }

  Gift.prototype.update = function() {
    this.uniforms["iGlobalTime"].value++;
  };

  Gift.prototype.dispose = function() {
    this.geometry = null;
    this.material = null;
    Gift.__super__.dispose.apply(this, arguments);
  };

  return Gift;

})(THREE.Mesh);

var Moon,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Moon = (function(_super) {
  __extends(Moon, _super);

  function Moon() {
    this.dispose = __bind(this.dispose, this);
    this.geometry = new THREE.SphereGeometry(120, 30, 30);
    this.material = new THREE.MeshBasicMaterial({
      color: 0,
      opacity: 1
    });
    THREE.Mesh.call(this, this.geometry, this.material);
    return;
  }

  Moon.prototype.dispose = function() {
    this.geometry = null;
    this.material = null;
    Moon.__super__.dispose.apply(this, arguments);
  };

  return Moon;

})(THREE.Mesh);

var Triangle,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Triangle = (function(_super) {
  __extends(Triangle, _super);

  Triangle.initGeometry3D = function() {
    var geometry, geometry2, m;
    geometry = new THREE.CylinderGeometry(0, 100, 100, 4, false);
    geometry.elementsNeedUpdate = true;
    geometry.uvsNeedUpdate = true;
    m = new THREE.Matrix4();
    m.makeTranslation(1, 100, 1);
    geometry.applyMatrix(m);
    geometry2 = new THREE.CylinderGeometry(0, 100, -100, 4, false);
    THREE.GeometryUtils.merge(geometry, geometry2);
    geometry.computeCentroids();
    geometry.mergeVertices();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    geometry.computeMorphNormals();
    geometry.computeTangents();
    geometry.computeBoundingSphere();
    return geometry;
  };

  Triangle.initGeometry2D = function() {
    var face, geometry;
    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(100, 0, 0));
    geometry.vertices.push(new THREE.Vector3(-100, 0, 0));
    geometry.vertices.push(new THREE.Vector3(0, 100, 0));
    face = new THREE.Face3(0, 2, 1);
    geometry.faces.push(face);
    geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(0, 1)]);
    geometry.computeCentroids();
    geometry.mergeVertices();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    geometry.computeMorphNormals();
    geometry.computeTangents();
    geometry.computeBoundingSphere();
    return geometry;
  };

  Triangle.geometry2D = Triangle.initGeometry2D();

  Triangle.geometry3D = Triangle.initGeometry3D();

  Triangle.materials = {};

  function Triangle(color, opacity, is3D, f1, f2, f3, f4) {
    var geometry;
    if (color == null) {
      color = 0xff0000 * Math.random();
    }
    if (opacity == null) {
      opacity = .3;
    }
    if (is3D == null) {
      is3D = null;
    }
    if (f1 == null) {
      f1 = 100;
    }
    if (f2 == null) {
      f2 = -100;
    }
    if (f3 == null) {
      f3 = 100;
    }
    if (f4 == null) {
      f4 = 0;
    }
    if (is3D == null) {
      is3D = Math.random() > .5;
    }
    if (!is3D) {
      geometry = Triangle.geometry2D;
    } else {
      geometry = Triangle.geometry3D;
    }
    this.material = new THREE.MeshBasicMaterial({
      color: color,
      opacity: opacity
    });
    this.material.blending = THREE["CustomBlending"];
    this.material.blendSrc = THREE["SrcAlphaFactor"];
    this.material.blendDst = THREE["OneFactor"];
    this.material.transparent = true;
    THREE.Mesh.call(this, geometry, this.material);
  }

  return Triangle;

})(THREE.Mesh);

var Fire, FireParticle,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Fire = (function(_super) {
  __extends(Fire, _super);

  function Fire() {
    this.tick = 0;
    this.tickDuration = 130;
    this.particles = [];
    THREE.Object3D.call(this);
    this.k = 0;
    return;
  }

  Fire.prototype.update = function(dt) {
    var i, p, _i, _ref;
    this.tick += dt;
    if (this.tick >= this.tickDuration) {
      this.tick = 0;
      this.onTick();
    }
    for (i = _i = _ref = this.particles.length - 1; _i >= 0; i = _i += -1) {
      p = this.particles[i];
      p.update();
      if (p.isDie()) {
        this.remove(this.particles.splice(i, 1)[0]);
      }
    }
  };

  Fire.prototype.onTick = function() {
    this.addParticle();
  };

  Fire.prototype.addParticle = function() {
    var p;
    this.k += M_2PI / 20;
    p = new FireParticle();
    p.position.set(Math.cos(this.k) * 50 - 150, 0, -1000);
    this.add(p);
    this.particles.push(p);
    p = new FireParticle();
    p.position.set(Math.sin(this.k) * 50 + 150, 0, -1000);
    this.add(p);
    this.particles.push(p);
  };

  return Fire;

})(THREE.Object3D);

FireParticle = (function(_super) {
  __extends(FireParticle, _super);

  function FireParticle() {
    FireParticle.__super__.constructor.call(this, 0xFFFFFF, .1);
    this.vx = 0;
    this.vy = 0;
    this.vz = 50;
    this.scale.set(.8, .8, .8);
    return;
  }

  FireParticle.prototype.update = function() {
    this.position.set(this.position.x + this.vx, this.position.y + this.vy, this.position.z + this.vz);
  };

  FireParticle.prototype.isDie = function() {
    return this.position.z > 1000;
  };

  return FireParticle;

})(Triangle);

var Hammer,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Hammer = (function(_super) {
  __extends(Hammer, _super);

  function Hammer(scene) {
    var geometry, geometry2, m;
    this.scene = scene;
    this.unlock = __bind(this.unlock, this);
    this.limit = 150;
    this.state = "x";
    THREE.Object3D.call(this);
    geometry = new THREE.CubeGeometry(180, 60, 60, 1, 1, 1);
    geometry2 = new THREE.CubeGeometry(20, 150, 150, 1, 1, 1);
    m = new THREE.Matrix4();
    m.makeTranslation(-100, 1, 1);
    geometry2.applyMatrix(m);
    THREE.GeometryUtils.merge(geometry, geometry2);
    this.material = new THREE.MeshBasicMaterial({
      color: 0,
      opacity: 0,
      transparent: true
    });
    this.left = new THREE.Mesh(geometry, this.material);
    this.left.position.x = -this.limit - 80;
    this.left.rotation.z = Math.PI;
    this.add(this.left);
    this.right = new THREE.Mesh(geometry, this.material);
    this.right.position.x = this.limit + 80;
    this.add(this.right);
    this.blocked = true;
    return;
  }

  Hammer.prototype.open = function() {
    var _this = this;
    TweenLite.to(this.material, .6, {
      delay: 1.6,
      opacity: .2,
      onComplete: function() {
        return _this.blocked = false;
      }
    });
    TweenLite.to(this.left.position, .7, {
      delay: 1.6,
      x: -this.limit - 30
    });
    return TweenLite.to(this.right.position, .7, {
      delay: 1.6,
      x: this.limit + 30
    });
  };

  Hammer.prototype.hit = function(callback) {
    if (this.blocked) {
      return;
    }
    this.fx = new Snd("./sfx/machine.mp3");
    this.fx.play();
    this.blocked = true;
    TweenLite.to(this.right.position, .3, {
      x: this.limit,
      onComplete: callback,
      ease: Quad.easeOut
    });
    TweenLite.to(this.right.position, .7, {
      x: this.limit + 30,
      delay: .3,
      onComplete: this.unlock,
      ease: Quad.easeOut
    });
    TweenLite.to(this.left.position, .3, {
      x: -this.limit,
      ease: Quad.easeOut
    });
    TweenLite.to(this.left.position, .7, {
      x: -this.limit - 30,
      delay: .3,
      ease: Quad.easeOut
    });
  };

  Hammer.prototype.unlock = function() {
    switch (this.state) {
      case "x":
        this.state = "y";
        TweenLite.to(this.rotation, .4, {
          z: Math.PI / 2
        });
        break;
      case "y":
        this.state = "z";
        TweenLite.to(this.rotation, .4, {
          z: 0,
          y: Math.PI / 2
        });
        break;
      case "z":
        this.state = "x";
        this.limit -= 10;
        TweenLite.to(this.rotation, .4, {
          y: 0
        });
    }
    if (this.limit <= 120) {
      this.scene.packGift();
      TweenLite.to(this.material, .6, {
        delay: .1,
        opacity: 0
      });
      TweenLite.to(this.left.position, .7, {
        x: -this.limit - 80
      });
      return TweenLite.to(this.right.position, .7, {
        x: this.limit + 80
      });
    } else {
      return this.blocked = false;
    }
  };

  return Hammer;

})(THREE.Object3D);

var Head,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Head = (function(_super) {
  __extends(Head, _super);

  function Head() {
    this.update = __bind(this.update, this);
    this.hit = __bind(this.hit, this);
    this.createScene = __bind(this.createScene, this);
    var callback, loader,
      _this = this;
    loader = new THREE.JSONLoader();
    callback = function(geometry, materials) {
      return _this.createScene(geometry, materials, 0, 0, 0);
    };
    loader.load("./img/model/Mario64.js", callback);
    THREE.Object3D.call(this);
    this.k = 0;
    this.ready = false;
    return;
  }

  Head.prototype.createScene = function(geometry, materials, x, y, z, b) {
    var colors, f, i, m, shader, _i, _ref,
      _this = this;
    colors = [0xbe0000, 0xFFFFFF, 0xfddfad, 0x6f4b33, 0xFFFFFF, 0xFF0000, 0x6d0000, 0x440000];
    for (i = _i = 0, _ref = geometry.faces.length; _i < _ref; i = _i += 1) {
      f = geometry.faces[i];
      f.color.setHex(colors[f.materialIndex]);
    }
    shader = THREE.MarioShader;
    this.uniforms = THREE.UniformsUtils.clone(shader.uniforms);
    this.material = new THREE.ShaderMaterial({
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: this.uniforms,
      transparent: true,
      vertexColors: THREE.FaceColors,
      color: 0xffffff,
      ambient: 0xffffff,
      lights: true,
      opacity: 0
    });
    m = new THREE.Matrix4();
    m.multiplyScalar(43);
    geometry.applyMatrix(m);
    this.head = new THREE.Mesh(geometry, this.material);
    this.head.geometry.colorsNeedUpdate = true;
    this.head.position.set(x, y - 40, z);
    this.head.scale.set(.01, .01, .01);
    this.add(this.head);
    TweenLite.to(this.head.rotation, 1.3, {
      delay: .85,
      y: Math.PI * 8,
      onComplete: function() {
        return _this.ready = true;
      }
    });
    TweenLite.to(this.head.position, 1.1, {
      delay: .85,
      y: y,
      ease: Back.easeOut,
      onStart: function() {
        return new Snd("./sfx/woohoo.mp3", {
          autoplay: true
        });
      }
    });
    TweenLite.to(this.material, .4, {
      delay: .85,
      opacity: 1
    });
    return TweenLite.to(this.head.scale, .6, {
      delay: .85,
      x: 1,
      y: 1,
      z: 1,
      ease: Back.easeOut
    });
  };

  Head.prototype.hit = function(hammer) {};

  Head.prototype.update = function(hammer) {
    var maxX, maxY, maxZ, minX, minY, minZ;
    this.k += .05;
    if (!this.ready) {
      return;
    }
    this.position.y += Math.sin(this.k) * .2;
    switch (hammer.state) {
      case "x":
        maxX = Math.min(hammer.right.position.x - 100, this.uniforms["maxX"].value);
        minX = Math.max(hammer.left.position.x + 100, this.uniforms["minX"].value);
        this.uniforms["maxX"].value = maxX;
        this.uniforms["minX"].value = minX;
        break;
      case "y":
        maxY = Math.min(hammer.right.position.x - 100, this.uniforms["maxY"].value);
        minY = Math.max(hammer.left.position.x + 100, this.uniforms["minY"].value);
        this.uniforms["maxY"].value = maxY;
        this.uniforms["minY"].value = minY;
        break;
      case "z":
        maxZ = Math.min(hammer.right.position.x - 100, this.uniforms["maxZ"].value);
        minZ = Math.max(hammer.left.position.x + 100, this.uniforms["minZ"].value);
        this.uniforms["maxZ"].value = maxZ;
        this.uniforms["minZ"].value = minZ;
        break;
    }
  };

  return Head;

})(THREE.Object3D);

var Package,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Package = (function(_super) {
  __extends(Package, _super);

  function Package() {
    var back, bottom, front, geometry, left, left2, material, right, right2, top;
    THREE.Object3D.call(this);
    geometry = new THREE.CubeGeometry(100, 10, 100, 1, 1, 1);
    material = new THREE.MeshBasicMaterial({
      color: 0xFF0000,
      opacity: 0,
      transparent: true
    });
    bottom = new THREE.Mesh(geometry, material);
    bottom.position.y = -200;
    top = new THREE.Mesh(geometry, material);
    top.position.y = 200;
    left = new THREE.Mesh(geometry, material);
    left.rotation.z = Math.PI / 2;
    left.position.x = -200;
    right = new THREE.Mesh(geometry, material);
    right.rotation.z = Math.PI / 2;
    right.position.x = 200;
    front = new THREE.Mesh(geometry, material);
    front.rotation.x = Math.PI / 2;
    front.position.z = -200;
    back = new THREE.Mesh(geometry, material);
    back.rotation.x = Math.PI / 2;
    back.position.z = 200;
    TweenLite.to(front.position, 1.1, {
      z: -45,
      ease: Sine.easeOut
    });
    TweenLite.to(back.position, 1.1, {
      z: 45,
      ease: Sine.easeOut
    });
    TweenLite.to(left.position, 1.1, {
      x: -45,
      ease: Sine.easeOut
    });
    TweenLite.to(right.position, 1.1, {
      x: 45,
      ease: Sine.easeOut
    });
    TweenLite.to(bottom.position, 1.1, {
      y: -45,
      ease: Sine.easeOut
    });
    TweenLite.to(top.position, 1.1, {
      y: 45,
      ease: Sine.easeOut
    });
    TweenLite.to(material, 1.1, {
      opacity: .75
    });
    this.add(bottom);
    this.add(top);
    this.add(front);
    this.add(back);
    this.add(left);
    this.add(right);
    geometry = new THREE.CubeGeometry(110, 10, 10, 1, 1, 1);
    material = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      opacity: 0,
      transparent: true
    });
    bottom = new THREE.Mesh(geometry, material);
    bottom.position.y = -210;
    top = new THREE.Mesh(geometry, material);
    top.position.y = 210;
    left = new THREE.Mesh(geometry, material);
    left.rotation.z = Math.PI / 2;
    left.position.x = -210;
    right = new THREE.Mesh(geometry, material);
    right.rotation.z = Math.PI / 2;
    right.position.x = 210;
    left2 = new THREE.Mesh(geometry, material);
    left2.rotation.y = Math.PI / 2;
    left2.position.x = -210;
    right2 = new THREE.Mesh(geometry, material);
    right2.rotation.y = Math.PI / 2;
    right2.position.x = 210;
    front = new THREE.Mesh(geometry, material);
    front.rotation.x = Math.PI / 2;
    front.position.z = -210;
    back = new THREE.Mesh(geometry, material);
    back.rotation.x = Math.PI / 2;
    back.position.z = 210;
    TweenLite.to(front.position, 1.2, {
      delay: .4,
      z: -50,
      ease: Quad.easeOut
    });
    TweenLite.to(back.position, 1.2, {
      delay: .4,
      z: 50,
      ease: Quad.easeOut
    });
    TweenLite.to(left.position, 1.2, {
      delay: .4,
      x: -50,
      ease: Quad.easeOut
    });
    TweenLite.to(right.position, 1.2, {
      delay: .4,
      x: 50,
      ease: Quad.easeOut
    });
    TweenLite.to(left2.position, 1.2, {
      delay: .4,
      x: -50,
      ease: Quad.easeOut
    });
    TweenLite.to(right2.position, 1.2, {
      delay: .4,
      x: 50,
      ease: Quad.easeOut
    });
    TweenLite.to(bottom.position, 1.2, {
      delay: .4,
      y: -50,
      ease: Quad.easeOut
    });
    TweenLite.to(top.position, 1.2, {
      delay: .4,
      y: 50,
      ease: Quad.easeOut
    });
    TweenLite.to(material, .7, {
      delay: .6,
      opacity: .75
    });
    this.add(bottom);
    this.add(top);
    this.add(front);
    this.add(back);
    this.add(left);
    this.add(right);
    this.add(left2);
    this.add(right2);
    this.rotation.z = Math.PI / 2;
    return;
  }

  return Package;

})(THREE.Object3D);

var Tree, TreeParticle,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Tree = (function(_super) {
  __extends(Tree, _super);

  function Tree() {
    var angle, i, radius, radiusStep, step, _i;
    this.particles = [];
    THREE.Object3D.call(this);
    angle = 0;
    step = M_2PI / 6;
    radius = 0;
    radiusStep = .3;
    this.height = 0;
    for (i = _i = 0; _i < 60; i = _i += 1) {
      this.addParticle(angle, radius);
      angle += step;
      radius += radiusStep * 6;
    }
    return;
  }

  Tree.prototype.update = function(dt) {
    var cHeight, i, k, p, stepHeight, _i, _ref;
    cHeight = 0;
    k = 0;
    stepHeight = this.height / 6;
    for (i = _i = _ref = this.particles.length - 1; _i >= 0; i = _i += -1) {
      p = this.particles[i];
      p.update();
      p.targetY = cHeight;
      k++;
      cHeight += stepHeight;
    }
  };

  Tree.prototype.restart = function() {
    var p, _i, _len, _ref, _results;
    _ref = this.particles;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      p = _ref[_i];
      _results.push(p.position.y = 0);
    }
    return _results;
  };

  Tree.prototype.onTick = function() {
    this.addParticle();
  };

  Tree.prototype.addParticle = function(angle, radius) {
    var p;
    p = new TreeParticle(angle, radius);
    this.add(p);
    this.particles.push(p);
  };

  return Tree;

})(THREE.Object3D);

TreeParticle = (function(_super) {
  __extends(TreeParticle, _super);

  function TreeParticle(angle, radius) {
    this.angle = angle;
    this.radius = radius;
    TreeParticle.__super__.constructor.call(this, 0xFFFFFF, 1);
    this.targetY = 0;
    this.scale.set(.01, .01, .01);
    this.update();
    return;
  }

  TreeParticle.prototype.update = function() {
    var y;
    this.angle += Math.PI / 120;
    y = this.position.y + (this.targetY - this.position.y) * .05;
    this.position.set(Math.cos(this.angle) * this.radius, y, Math.sin(this.angle) * this.radius);
  };

  TreeParticle.prototype.isDie = function() {
    return this.radius <= 0;
  };

  return TreeParticle;

})(Triangle);

var Wind, WindParticle,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Wind = (function(_super) {
  __extends(Wind, _super);

  function Wind() {
    this.tick = 0;
    this.tickDuration = 30;
    this.particles = [];
    THREE.Object3D.call(this);
    return;
  }

  Wind.prototype.update = function(dt) {
    var i, p, _i, _ref;
    this.tick += dt;
    if (this.tick >= this.tickDuration) {
      this.tick = 0;
      this.onTick();
    }
    for (i = _i = _ref = this.particles.length - 1; _i >= 0; i = _i += -1) {
      p = this.particles[i];
      p.update();
      if (p.isDie()) {
        this.remove(this.particles.splice(i, 1)[0]);
      }
    }
  };

  Wind.prototype.onTick = function() {
    this.addParticle();
  };

  Wind.prototype.addParticle = function() {
    var p;
    p = new WindParticle();
    if (Constant.windVertical) {
      p.position.x = Math.random() * 900 - 450;
      p.position.y = Math.random() * 800 + 400;
      p.position.z = Math.random() * 900 - 350;
    } else {
      p.position.x = Math.random() * 700 - 350;
      p.position.y = Math.random() * 400;
      p.position.z = -1000;
    }
    this.add(p);
    this.particles.push(p);
  };

  return Wind;

})(THREE.Object3D);

WindParticle = (function(_super) {
  __extends(WindParticle, _super);

  function WindParticle() {
    WindParticle.__super__.constructor.call(this, 0xFFFFFF, .2);
    if (Constant.windVertical) {
      this.vx = Math.random() * .2;
      this.vy = -Constant.windSpeed;
      this.vz = 0;
    } else {
      this.vx = 0;
      this.vy = 0;
      this.vz = Constant.windSpeed;
    }
    this.scale.set(.07, .07, .07);
    return;
  }

  WindParticle.prototype.update = function() {
    this.position.set(this.position.x + this.vx, this.position.y + this.vy, this.position.z + this.vz);
  };

  WindParticle.prototype.isDie = function() {
    if (Constant.windVertical) {
      return this.position.y < -100;
    } else {
      return this.position.z > 1000;
    }
  };

  return WindParticle;

})(Triangle);

var Constant;

Constant = (function() {
  function Constant() {}

  Constant.convexRatio = .0;

  Constant.convexEase = .45;

  Constant.brightnessEase = .45;

  Constant.vignette2Offset = .22;

  Constant.vignette2Darkness = 3.3;

  Constant.smoothBall = false;

  Constant.cameraZ = 400;

  Constant.clearColor = 0x051b32;

  Constant.hemiColor = 0xffffff;

  Constant.groundColor = 0xffffff;

  Constant.windSpeed = 2;

  Constant.windVertical = true;

  Constant.addGui = function() {};

  return Constant;

})();

var Main, main,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

main = null;

Main = (function() {
  Main.prototype.scene = null;

  Main.prototype.camera = null;

  Main.prototype.renderer = null;

  Main.prototype.dt = 0;

  Main.prototype.lastTime = 0;

  Main.prototype.pause = false;

  function Main() {
    this.resize = __bind(this.resize, this);
    this.animate = __bind(this.animate, this);
    var film, focus, fxaa, rtParams, vignette, vignette2;
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.set(0, 0, 300);
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x051b32, 0.0001, 1000);
    this.scene.add(this.camera);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      precision: "highp",
      maxLights: 10,
      stencil: false,
      preserveDrawingBuffer: false
    });
    this.renderer.autoClear = true;
    this.renderer.setClearColor(0x051b32);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMapEnabled = false;
    this.renderer.shadowMapSoft = false;
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    $("#main").append(this.renderer.domElement);
    this.ambient = new THREE.AmbientLight(0x1b2a38);
    this.scene.add(this.ambient);
    vignette = new THREE.ShaderPass(THREE.VignetteShader);
    vignette.uniforms["offset"].value = 0.09;
    vignette.uniforms["darkness"].value = 8.4;
    vignette2 = new THREE.ShaderPass(THREE.VignetteShader);
    vignette2.uniforms["offset"].value = 100;
    vignette2.uniforms["darkness"].value = 10;
    focus = new THREE.ShaderPass(THREE.FocusShader);
    focus.uniforms["screenWidth"].value = window.innerWidth;
    focus.uniforms["screenHeight"].value = window.innerHeight;
    focus.uniforms["waveFactor"].value = 0.001;
    focus.uniforms["sampleDistance"].value = 0.6;
    fxaa = new THREE.ShaderPass(THREE.FXAAShader);
    fxaa.uniforms["resolution"].value.set(1 / (window.innerWidth / 1), 1 / (window.innerHeight / 1));
    film = new THREE.FilmPass(0.55, 0.015, 648, false);
    this.focus = focus;
    this.film = film;
    this.vignette = vignette;
    this.vignette2 = vignette2;
    this.fxaa = fxaa;
    rtParams = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat,
      stencilBuffer: true
    };
    this.renderPass = new THREE.RenderPass(this.scene, this.camera);
    this.rendererTarget = new THREE.WebGLRenderTarget(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, this.composer = new THREE.EffectComposer(this.renderer, this.rendererTarget, rtParams));
    this.composer.addPass(this.renderPass);
    this.composer.addPass(this.fxaa);
    this.composer.addPass(this.vignette);
    this.composer.addPass(this.focus);
    this.composer.addPass(this.vignette2);
    this.composer.addPass(this.film);
    film.renderToScreen = true;
    SceneTraveler.getInstance().travelTo(new LoadScene(this.stage));
    this.lastTime = Date.now();
    window.focus();
    Constant.addGui();
    requestAnimationFrame(this.animate);
    return;
  }

  Main.prototype.animate = function() {
    var dt, t;
    if (this.pause) {
      t = Date.now();
      this.lastTime = t;
      return;
    }
    t = Date.now();
    dt = t - this.lastTime;
    requestAnimationFrame(this.animate);
    SceneTraveler.getInstance().currentScene.update(dt);
    this.renderer.setClearColor(Constant.setClearColor);
    this.composer.render(0.01);
    this.ambient.color.setHex(Constant.setClearColor);
    this.lastTime = t;
  };

  Main.prototype.resize = function() {
    if (this.camera) {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.composer.setSize(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.focus.uniforms["screenWidth"].value = window.innerWidth * window.devicePixelRatio;
      this.focus.uniforms["screenHeight"].value = window.innerHeight * window.devicePixelRatio;
      this.fxaa.uniforms["resolution"].value.set(1 / (window.innerWidth / 1), 1 / (window.innerHeight / 1));
    }
  };

  return Main;

})();

$(document).ready(function() {
  var _this = this;
  main = new Main();
  $(window).blur(function() {
    main.pause = true;
    return cancelAnimationFrame(main.animate);
  });
  $(window).focus(function() {
    requestAnimationFrame(main.animate);
    main.lastTime = Date.now();
    return main.pause = false;
  });
  $(window).resize(function() {
    return main.resize();
  });
});
