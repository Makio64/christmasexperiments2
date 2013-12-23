Acko.Effect.Director = function (script, beat) {
  this.script = script;
  this.beat = beat;
  this.tracks = [];

  this.last = 0;
  this.index = 0;
  this.active = true;

  this.order = -3;
}

Acko.Effect.Director.prototype = _.extend(new Acko.Effect(), {

  build: function (exports) {
    this.exports = exports;

    var scene = exports.render.scene;
    var tracks = this.tracks = [];
    var script = this.script;
    var beat = this.beat;

    function makeTrack(info) {
      beat.mapTrack(info);

      var klass = {
        'hold': Acko.Hold,
        'path': Acko.Path,
      }[info.type];

      if (klass) {
        return new klass(info);
      }
    }

    script.forEach(function (track) {
      track = makeTrack(track);
      track && tracks.push(track);
    });

    exports.director = {
      beat: {
        is: this.beat.is,
        was: this.beat.was,
      },
    };

    window.logCamera = function () {
      var c = exports.render.camera;
      var p = c.position;
      var q = c.quaternion;
      console.log('[' + [p.x, p.y, p.z].join(', ') + ']');
      console.log('[' + [q._x, q._y, q._z, q._w].join(', ') + ']');
    };

    //this.exportTracks(scene);
  },

  exportTracks: function (scene) {
    this.tracks.forEach(function (track) {
      var geometry1 = new THREE.Geometry();
      var geometry2 = new THREE.Geometry();
      var geometry3 = new THREE.Geometry();
      var linevs = geometry1.vertices = [];
      var pointvs = geometry2.vertices = [];
      var point2vs = geometry3.vertices = [];

      var fps = 15;
      var time = 270;

      for (var i = 0; i < fps * time; ++i) {
        var c = track.evaluate(i / fps);
        linevs.push(new THREE.Vector3(c[0], c[1], c[2]));
        pointvs.push(new THREE.Vector3(c[0], c[1], c[2]));
      }

      var n = track.values.length;
      for (var i = 0; i < n; ++i) {
        var c = track.values[i];
        point2vs.push(new THREE.Vector3(c[0], c[1], c[2]));
      }

      geometry1.computeBoundingSphere();
      geometry2.computeBoundingSphere();

      var line = new THREE.Line(geometry1, new THREE.LineBasicMaterial({ color: new THREE.Color(0xFFA000) }));
      var points = new THREE.ParticleSystem(geometry2, new THREE.ParticleSystemMaterial({ size: 3, sizeAttenuation: false, color: new THREE.Color(0xFFA000) }));
      var points2 = new THREE.ParticleSystem(geometry3, new THREE.ParticleSystemMaterial({ size: 5, sizeAttenuation: false, color: new THREE.Color(0xFFFF50) }));

      scene.add(line);
      scene.add(points);
      scene.add(points2);
    });
  },

  update: function (exports) {
    var time = exports.audio.now;

    this.beat.advance(time);

    if (!exports.camera.freeze) return;

    this.tracks.forEach(function (track) {
      track.update(time);
    })
  },

});

Acko.EffectList.push(new Acko.Effect.Director(Acko.Demo.Script, Acko.Demo.Beat));
