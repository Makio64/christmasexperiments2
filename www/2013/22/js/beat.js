Acko.Beat = function (beat, scale) {
  this.beat = beat;
  this.scale = scale;

  this.time = 0;
  this.index = 0;
  this.n = this.beat.length;
  this.log = true;

  this.is = [0, 0, 0, 0, 0];
  this.intra = [0, 0, 0, 0, 0];
  this.was = [0, 0, 0, 0, 0];

  //var div = this.display = document.createElement('div');
  //div.id = 'beat';
  //document.body.appendChild(div);
};

Acko.Beat.prototype = {

  advance: function (t) {
    var beat = false;
    var n = this.n;

    if (this.index > 0 && this.beat[this.index - 1] > t) {
      this.index = 0;
    }

    while (this.index < n && this.beat[this.index] < t) {
      beat = true;

      if (this.display) this.display.innerHTML = [
          Math.floor(this.index / this.scale / this.scale),
          Math.floor(this.index / this.scale) % this.scale,
          this.index % this.scale ].join('.');

      this.is[0] = !(this.index % 16);
      this.is[1] = !(this.index % 8);
      this.is[2] = !(this.index % 4);
      this.is[3] = !(this.index % 2);
      this.is[4] = true;

      this.index++;
    }

    if (!beat) {
      for (var i = 0; i < 5; ++i) {
        this.is[i] = false;
      }
    }

    var f = .4;

    for (var i = 0; i < 5; ++i) {
      this.was[i] = this.was[i] + (this.intra[i] * (1 + 1/f) - this.was[i]) * f;
      this.intra[i] = this.intra[i] + (this.is[i] * (1 + 1/f) - this.intra[i]) * f;
    }

  },

  mapTrack: function (trackInfo) {
    var map = this.map.bind(this);

    trackInfo.begin = map(trackInfo.begin);
    trackInfo.end = map(trackInfo.end);

    trackInfo.stops.forEach(function (stop) {
      stop[0] = map(stop[0]);
    });
  },

  map: function (timecode) {
    if (typeof timecode == 'number') return timecode;

    timecode = timecode.split(/\./g);
    timecode.reverse();

    var scale = this.scale;

    var index = timecode.reduce(function (a, b, i) {
      return a + parseInt(b, 10) * Math.pow(scale, i);
    }, 0);

    if (index < 0) {
      return -this.beat[-index];
    }

    return this.beat[index];
  },
};

(function () {
  var beat = [];

  var delta = 0.35287499999999995;
  var offset = 0.00860850000000148;

  var n = 300 / delta;
  var t = offset;
  for (var i = 0; i < n; ++i) {
    beat[i] = t;
    t += delta;
  }
  Acko.Demo.Beat = new Acko.Beat(beat, 4);
  Acko.Demo.Beat.measure = delta * 4;
})();

