Acko.Surface = function (options) {
  if (options === undefined) return;

  options = options || {};

  this.buffer    = options.buffer     || null;
  this.n         = options.n          || this.buffer.n || 1;
  this.m         = options.m          || this.buffer.m || this.buffer.history || 1;
  this.color     = options.color      || new THREE.Vector4(1, 1, 1, 1);
  this.xClip     = options.xClip      || 1;
  this.yClip     = options.yClip      || 1;
  this.zBias     = options.zBias      || 0;
  this._uniforms = options.uniforms   || {};

  this.vertexShader   = options.vertexShader   || 'surface-vertex-data';
  this.fragmentShader = options.fragmentShader || 'surface-fragment';

  THREE.Object3D.apply(this);

  this.build();
};

Acko.Surface.prototype = _.extend(new THREE.Object3D(), {

  attributes: function () {
    return {
      edge: {
        type: 'v2',
        value: null,
      },
    };
  },

  set: function (props) {
    for (var i in props) {
      var u = this._uniforms[i];
      if (u) {
        u.value = props[i];
      }
    }
  },

  uniforms: function () {
    return _.extend({}, this._uniforms, this.buffer.uniforms());
  },

  build: function () {
    this._uniforms = _.extend({}, this._uniforms, {
      xClip: {
        type: 'f',
        value: this.xClip,
      },
      yClip: {
        type: 'f',
        value: this.yClip,
      },
      color: {
        type: 'v4',
        value: this.color,
      },
      zBias: {
        type: 'f',
        value: this.zBias,
      },
    });

    var geometry = new Acko.SurfaceGeometry(this.n, this.m);
    var material = new THREE.ShaderMaterial({
      attributes: this.attributes(),
      uniforms: this.uniforms(),
      vertexShader: getShader(this.vertexShader),
      fragmentShader: getShader(this.fragmentShader),
      side: THREE.DoubleSide,
    });
    material.defaultAttributeValues = null;

    this._geometry = geometry;
    this._material = material;
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.frustumCulled = false;

    this.add(this.mesh);
  },

});
