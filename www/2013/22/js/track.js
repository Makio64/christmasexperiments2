Acko.Track = function (options) {
  if (options == undefined) return;

  this.keys = options.key && options.key.split(/\./g) || [];
  this.begin = options.begin || -Infinity;
  this.end = options.end || Infinity;
  this.stops = options.stops || [];
};

Acko.Track.prototype = {

  set: function (value) {
    var keys = this.keys;
    var n = keys.length;

    var o = exports;
    for (var i = 0; i < n - 1; ++i) {
      o = o[keys[i]];
    }

    var v = o[keys[i]];
    if (v.set) {
      v.set.apply(v, value);
    }
    else {
      o[keys[i]] = value;
    }
  },

};

Acko.Hold = function (options) {
  Acko.Track.apply(this, arguments);
  this.build();
}

Acko.Hold.prototype = _.extend(new Acko.Track(), {


  build: function () {
    var times = this.times = [];
    var values = this.values = [];

    // Split times from values
    _.each(this.stops, function (stop) {
      times.push(stop[0]);
      values.push(stop[1]);
    });

  },

  update: function (time) {
    var times = this.times;
    var values = this.values;

    var n = times.length - 1;
    var index, f;
    var max = n;
    var min = 0;
    var value;

    if (this.begin) {
      if (time < this.begin) return;
    }
    if (this.end) {
      if (time > this.end) return;
    }

    // Find right index in curve with binary search
    if (time < times[min]) {
      value = values[0];
    }
    else if (time > times[max]) {
      value = values[values.length - 1];
    }
    else {
      var mid;
      while (max > min) {
        mid = Math.ceil((max + min) / 2);

        if (time >= times[mid]) {
          min = mid;
        }
        else {
          max = mid - 1;
        }
      }

      value = values[min];
    }

    this.set(value);
  },

});

Acko.Path = function (options) {
  Acko.Track.apply(this, arguments);

  this.normalize = options.normalize || false;

  this.n = this.stops[0][1].length;
  this.div = 32;

  this.build();
}

Acko.Path.prototype = _.extend(new Acko.Track(), {

  build: function () {
    var times = this.times = [];
    var values = this.values = [];
    var distances = this.distances = [];

    if (this.stops.length < 2) throw "Insufficient stops on path";

    // Split times from values
    _.each(this.stops, function (stop) {
      times.push(stop[0]);
      values.push(stop[1]);
    });

    // Extend endpoints to get flat tangents
    this.extend();
    var m = values.length;

    // Build spline and measure length
    var spline = [];
    var n = this.n, div = this.div;
    for (var i = 1; i < m - 2; ++i) {
      for (var j = 0; j < div; ++j) {
        spline.push(this.get(values, i + j / div, this.normalize));
      }
    }
    spline.push(this.get(values, i));
    var lengthMap = this.lengthMap = new Acko.LengthMap(spline);

    // Map keyframes to distance
    for (var i = 0; i < m - 2; ++i) {
      distances.push(lengthMap.unmap(i * div));
    }
    distances.push(distances[m - 3]);
    distances.unshift(distances[0]);

    // Build time spline
    var timeSpline = [];
    var n = this.n, div = this.div;
    for (var i = 1; i < m - 2; ++i) {
      for (var j = 0; j < div; ++j) {
        var offset = i + j / div;
        timeSpline.push([this.get(times, offset), this.get(distances, offset)]);
      }
    }
    timeSpline.push([this.get(times, i), this.get(distances, i)]);

    this.timeMap = new Acko.MonotoneMap(timeSpline);
  },

  get: function (values, offset, normalize) {
    var index = clamp(Math.floor(offset), 1, values.length - 3);
    var frac = offset - index;

    var a = values[index - 1];
    var b = values[index];
    var c = values[index + 1];
    var d = values[index + 2];

    var f1 = catmullRom(frac + 3);
    var f2 = catmullRom(frac + 2);
    var f3 = catmullRom(frac + 1);
    var f4 = catmullRom(frac);

    if (typeof a == 'number') {
      return f1 * a + f2 * b + f3 * c + f4 * d;
    }

    var out = [];
    var n = this.n;
    var accum = 0;

    for (var i = 0; i < n; ++i) {
      var cm = f1 * a[i] + f2 * b[i] + f3 * c[i] + f4 * d[i];
      out.push(cm);

      accum += cm * cm;
    }

    if (normalize) {
      var inv = 1 / Math.sqrt(accum);
      for (var i = 0; i < n; ++i) {
        out[i] *= inv;
      }
    }

    return out;
  },

  extend: function () {
    var stops = this.times.length;
    var n = this.n;

    var ta = this.times[0];
    var tb = this.times[1];
    var a = this.values[0];
    var b = this.values[1];

    var tc = this.times[stops - 2];
    var td = this.times[stops - 1];
    var c = this.values[stops - 2];
    var d = this.values[stops - 1];

    var first = [], last = [];
    for (var i = 0; i < n; ++i) {
      first.push(2 * a[i] - b[i]);
      last.push(2 * d[i] - c[i]);
    }

    this.times.unshift(2 * ta - tb);
    this.times.push(2 * td - tc);

    this.values.unshift(first);
    this.values.push(last);
  },

  evaluate: function (time) {
    var distance = this.timeMap.map(time);
    var offset = this.lengthMap.map(distance) / this.div + 1;

    offset = clamp(offset, 0, this.values.length - 2);

    return this.get(this.values, offset, this.normalize);
  },

  update: function (time) {
    if (this.begin) {
      if (time < this.begin) return;
    }
    if (this.end) {
      if (time > this.end) return;
    }

    this.set(this.evaluate(time));
  },

});

// Linear remapping of a path
Acko.LengthMap = function (points) {

  var lengths = this.lengths = [];
  var accum = this.accum = [0];
  var n = points.length;

  var x = 0;
  for (var i = 1; i < n; ++i) {
    var l = this.measure(points[i - 1], points[i]);
    lengths.push(l);
    accum.push(x += l);
  }

}

Acko.LengthMap.prototype = {

  measure: function (a, b) {
    var n = Math.min(a.length, b.length);
    var accum = 0;
    for (var i = 0; i < n; ++i) {
      var d = a[i] - b[i];
      accum += d * d;
    }
    return Math.sqrt(accum);
  },

  getLength: function () {
    return this.accum[this.accum.length - 1];
  },

  unmap: function (offset) {
    var floor = Math.floor(Math.max(0, Math.min(this.accum.length - 2, offset)));
    var frac = offset - floor;
    var a = this.accum[floor];
    var b = this.accum[floor + 1]
    return a + (b - a) * frac;
  },

  map: function (distance) {
    var start = 0;
    var accum = this.accum;
    var end = accum.length - 2;

    do {
      var mid = Math.ceil((start + end)/2);
      if (distance < accum[mid]) {
        end = mid - 1;
      }
      else {
        start = mid;
      }
    } while (end - start > 0);

    var s = accum[start];
    var e = accum[start + 1];

    var f = (distance - s) / (e - s);
    return start + f;
  },

};


// Inverse mapping of a monotone function
Acko.MonotoneMap = function (values) {
  this.values = values;
}

Acko.MonotoneMap.prototype = {

  map: function (value) {
    var values = this.values;
    var start = 0;
    var end = values.length - 2;

    do {
      var mid = Math.ceil((start + end)/2);
      if (value < values[mid][0]) {
        end = mid - 1;
      }
      else {
        start = mid;
      }
    } while (end - start > 0);

    var s = values[start];
    var e = values[start + 1];

    var f = (value - s[0]) / (e[0] - s[0]);
    return lerp(s[1], e[1], f);
  },

};
