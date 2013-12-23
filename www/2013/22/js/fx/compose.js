Acko.Effect.Compose = function () {
  Acko.Effect.call(this);

  this.order = 100;

  this.white = new THREE.Color(0xffffff);
}

Acko.Effect.Compose.prototype = _.extend(new Acko.Effect(), {

  build: function (exports) {
    var gl = exports.render.gl;
    var scene = exports.render.scene;
    var camera = exports.render.camera;
    var renderer = exports.render.renderer;

    // Compositing
    var finalScene = this.finalScene = new THREE.Scene();

    // Render full scene to texture
    var renderStage = this.renderStage = new ThreeRTT.Stage(renderer, {
      history: -1,
      width: 1,
      height: 1,
      camera: camera,
      clear: { color: true, depth: true, stencil: false },
      clearColor: new THREE.Color(0),
      texture: {
        format: THREE.RGBFormat,
        magFilter: THREE.LinearFilter,
        minFilter: THREE.LinearFilter,
      },
    });

    renderStage.scenes.push(scene);
    renderStage.passes.push(1);

    // FXAA
    var fxaaStage = this.fxaaStage = new ThreeRTT.Stage(renderer, {
      history: -1,
      width: 1,
      height: 1,
      camera: camera,
      clear: { color: true, depth: true, stencil: false },
      clearColor: new THREE.Color(0),
      texture: {
        format: THREE.RGBFormat,
        magFilter: THREE.LinearFilter,
        minFilter: THREE.LinearFilter,
      },
    });

    var shader = THREE.FXAAShader;
    this.fxaaUniforms = shader.uniforms;
    var fxaaMaterial = new ThreeRTT.FragmentMaterial(fxaaStage, shader.fragmentShader, { texture: renderStage.read() });
    fxaaStage.fragment(fxaaMaterial);

    // Downsample
    var halfStage = this.halfStage = new ThreeRTT.Stage(renderer, {
      history: -1,
      width: 1,
      height: 1,
      camera: camera,
      clear: { color: true, depth: true, stencil: false },
      clearColor: new THREE.Color(0),
      texture: {
        format: THREE.RGBFormat,
        magFilter: THREE.LinearFilter,
        minFilter: THREE.LinearFilter,
      },
    });

    var quadStage = this.quadStage = new ThreeRTT.Stage(renderer, {
      history: 0,
      width: 1,
      height: 1,
      camera: camera,
      clear: { color: true, depth: true, stencil: false },
      clearColor: new THREE.Color(0),
      texture: {
        format: THREE.RGBFormat,
        magFilter: THREE.LinearFilter,
        minFilter: THREE.LinearFilter,
      },
    });

    var octoStage = this.octoStage = new ThreeRTT.Stage(renderer, {
      history: 0,
      width: 1,
      height: 1,
      camera: camera,
      clear: { color: true, depth: true, stencil: false },
      clearColor: new THREE.Color(0),
      texture: {
        format: THREE.RGBFormat,
        magFilter: THREE.LinearFilter,
        minFilter: THREE.LinearFilter,
      },
    });

    var halfMaterial = new ThreeRTT.ScaleMaterial(fxaaStage, halfStage, 2);
    halfStage.fragment(halfMaterial);

    var quadMaterial = new ThreeRTT.ScaleMaterial(halfStage, quadStage, 2);
    quadStage.fragment(quadMaterial);

    var octoMaterial = new ThreeRTT.ScaleMaterial(quadStage, octoStage, 2);
    octoStage.fragment(octoMaterial);

    var octoBlur1 = new ThreeRTT.FragmentMaterial(octoStage, 'rtt-fragment-blur1');
    octoStage.fragment(octoBlur1);

    var octoBlur2 = new ThreeRTT.FragmentMaterial(octoStage, 'rtt-fragment-blur2');
    octoStage.fragment(octoBlur2);

    var pass1 = new ThreeRTT.Compose(fxaaStage, 'generic-fragment-texture');
    pass1.mesh.material.depthTest = false;
    pass1.mesh.material.depthWrite = false;
    pass1.mesh.material.transparent = false;
    pass1.mesh.renderDepth = -1000;

    var pass2 = new ThreeRTT.Compose(octoStage, 'generic-fragment-texture');
    pass2.mesh.material.depthTest = false;
    pass2.mesh.material.depthWrite = false;
    pass2.mesh.material.transparent = true;
    pass2.mesh.material.blending = THREE.AdditiveBlending;
    pass2.mesh.renderDepth = -999;

    finalScene.add(pass1);
    finalScene.add(pass2);

    /*

    // FXAA un-ao'd image
    var fxaaEffect = this.fxaaEffect = new THREE.ShaderPass();
    fxaaEffect.renderToScreen = true;
    composer.addPass(fxaaEffect);
    */
  },

  update: function (exports) {
    var scene = exports.render.scene;
    var camera = exports.render.camera;
    var renderer = exports.render.renderer;

    // White bg
    renderer.setClearColor(0x000000, 1);

    this.renderStage.render();
    this.fxaaStage.render();
    this.halfStage.render();
    this.quadStage.render();
    this.octoStage.render();

    renderer.render(this.finalScene, camera);
  },

  resize: function (exports) {
    if (this.depthTarget) this.depthTarget.dispose();

    var width = exports.render.width;
    var height = exports.render.height;

    // FXAA: Native
    //var fxaaEffect = this.fxaaEffect;
    //fxaaEffect.uniforms['resolution'].value.set(1 / width, 1 / height);

    this.renderStage.size(width, height);
    this.fxaaStage.size(width, height);
    this.halfStage.size(width / 2, height / 2);
    this.quadStage.size(width / 4, height / 4);
    this.octoStage.size(width / 8, height / 8);
  },

});

Acko.EffectList.push(new Acko.Effect.Compose());



