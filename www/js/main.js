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
    this.onSoundLoaded = __bind(this.onSoundLoaded, this);
    this.loadSound = __bind(this.loadSound, this);
    this.loadPixiAsset = __bind(this.loadPixiAsset, this);
    this.loadData = __bind(this.loadData, this);
    LoadScene.__super__.constructor.call(this, stage);
    return;
  }

  LoadScene.prototype.onEnter = function() {
    this.loadData();
    SceneTraveler.getInstance().travelTo(new StartScene(this.stage));
  };

  LoadScene.prototype.loadData = function() {};

  LoadScene.prototype.loadPixiAsset = function() {};

  LoadScene.prototype.loadSound = function() {};

  LoadScene.prototype.onSoundLoaded = function() {
    SceneTraveler.getInstance().travelTo(new GameScene(this.stage));
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
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

StartScene = (function(_super) {
  __extends(StartScene, _super);

  function StartScene(stage) {
    StartScene.__super__.constructor.call(this, stage);
    return;
  }

  StartScene.prototype.onEnter = function() {};

  StartScene.prototype.update = function(dt) {};

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

var iframe, resize;

iframe = null;

resize = function() {
  iframe.width(window.innerWidth);
  iframe.height(window.innerHeight - 50);
  return null;
};

$(function() {
  var _this = this;
  iframe = $('iframe');
  $(window).on('resize', resize);
  $('.more').on('click', function() {
    if ($('.calendar').hasClass('show')) {
      $('.more').removeClass('opened');
      return $('.calendar').removeClass('show');
    } else {
      $('.more').addClass('opened');
      return $('.calendar').addClass('show');
    }
  });
  return resize();
});

var _this = this;

window.XMAS = {
  width: 0,
  height: 0,
  body: null,
  thumbs: null,
  timer: null,
  init: function() {
    var _this = this;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.body = document.body;
    this.thumbs = [];
    $('.experiment').each(function(idx, obj) {
      return _this.thumbs.push(obj);
    });
    this.initEvents();
    this.showThumbs();
    return null;
  },
  showThumbs: function(evt) {
    var i, idx, thumb, _i, _ref;
    idx = -1;
    if (_this.XMAS.thumbs.length === 0) {
      $(window).off('scroll');
    }
    for (i = _i = 0, _ref = _this.XMAS.thumbs.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      thumb = _this.XMAS.thumbs[i];
      if ((thumb.offsetTop > document.body.scrollTop && (thumb.offsetTop + 200) <= document.body.scrollTop + window.innerHeight) || $('.experiment-24').hasClass('show')) {
        if (thumb.className !== "experiment show") {
          $(thumb).addClass('show');
        }
        idx = i;
      }
    }
    if (idx !== -1) {
      _this.XMAS.thumbs.splice(idx, 1);
      idx = -1;
    }
    return null;
  },
  initEvents: function() {
    $(window).on('scroll', _this.XMAS.showThumbs);
    return null;
  }
};

$(function() {
  XMAS.init();
  (function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s); js.id = id;
          js.src = "//connect.facebook.net/fr_FR/all.js#xfbml=1&appId=220813356385";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));;
  !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');;
  return null;
});
