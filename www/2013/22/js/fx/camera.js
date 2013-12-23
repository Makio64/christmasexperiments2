Acko.Effect.Camera = function () {
  this.order = -2;

  this.q1 = new THREE.Quaternion();
  this.q2 = new THREE.Quaternion();
  this.q3 = new THREE.Quaternion();

  this.v1 = new THREE.Vector3(-1, 0, 1);
  this.v2 = new THREE.Vector3(-1, 0, 1);
  this.v3 = new THREE.Vector3(-1, 0, 1);

  this.f = .1;
  this.lastFreeze = -1;
  this.release = 0;
}

Acko.Effect.Camera.prototype = _.extend(new Acko.Effect(), {

  build: function (exports) {
    this.camera = Acko.Camera;
    this.camera.rotation.order = 'YXZ';
    this.camera.position.set(-1, 0, 1);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.controls = new THREE.FirstPersonControls(this.camera, exports.render.renderer.domElement);
    this.controls.freeze = true;

    exports.camera = {
      quaternion: new THREE.Quaternion(),
      position: new THREE.Vector3(0, 0, 1),
      freeze: this.controls.freeze,
    };

    this.canvas = document.querySelector('canvas');
  },

  update: function (exports) {
    var c = exports.camera;

    c.freeze = this.controls.freeze;

    var delta = exports.time.delta;

    if (this.controls.freeze) {
      if (!this.lastFreeze) {
        this.q1.copy(this.camera.quaternion);
        this.q2.copy(this.camera.quaternion);
        this.q3.copy(this.camera.quaternion);

        this.v1.copy(this.camera.position);
        this.v2.copy(this.camera.position);
        this.v3.copy(this.camera.position);
      }

      while (delta > 1/120) {
        c.quaternion.normalize();
        this.q1.slerp(c.quaternion, this.f);
        this.q2.slerp(this.q1, this.f);
        this.q3.slerp(this.q2, this.f);
        this.camera.quaternion.copy(this.q3);

        this.v1.lerp(c.position, this.f);
        this.v2.lerp(this.v1, this.f);
        this.v3.lerp(this.v2, this.f);
        this.camera.position.copy(this.v3);

        delta -= 1/60;
      }

      this.lastFreeze = true;
    }
    else if (this.lastFreeze) {

      var r = this.camera.rotation;
      this.controls.lat = 180 / π * r.x;
      this.controls.lon = -180 / π * r.y - 90;

      this.lastFreeze = false;
      this.release = 1.0;
    }

//    this.release *= .95;
    this.release -= .05;
    if (this.release > 0) {
      this.controls.mouseDragOn = true;
      this.controls.update(exports.time.delta);
      this.controls.mouseDragOn = false;
      this.camera.quaternion.slerp(this.q3, cosineEase(this.release));
    }
    else {
      this.controls.update(exports.time.delta);
    }

    if (!this.controls.freeze && this.canvas.style.cursor == 'none') {
      this.canvas.style.cursor = 'default';
    }
  },

  resize: function (exports) {
    var w = exports.render.width;
    var h = exports.render.height;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  },

});

Acko.EffectList.push(new Acko.Effect.Camera());

Acko.Camera = new THREE.PerspectiveCamera(45, 1, .01, 1000);
