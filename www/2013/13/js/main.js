var NumberUtils;

NumberUtils = (function() {
  NumberUtils.PI = Math.PI;

  NumberUtils.PIBy2 = Math.PI / 2;

  NumberUtils.PI2 = Math.PI * 2;

  function NumberUtils() {
    console.log("You musn't instanciate Utils");
    return;
  }

  NumberUtils.map = function(num, min1, max1, min2, max2, round, constrainMin, constrainMax) {
    var num1, num2;
    if (round == null) {
      round = false;
    }
    if (constrainMin == null) {
      constrainMin = true;
    }
    if (constrainMax == null) {
      constrainMax = true;
    }
    if (constrainMin && num < min1) {
      return min2;
    }
    if (constrainMax && num > max1) {
      return max2;
    }
    num1 = (num - min1) / (max1 - min1);
    num2 = (num1 * (max2 - min2)) + min2;
    if (round) {
      return Math.round(num2);
    }
    return num2;
  };

  NumberUtils.toRadians = function(degree) {
    return degree * (Math.PI / 180);
  };

  NumberUtils.toDegree = function(radians) {
    return radians * (180 / Math.PI);
  };

  NumberUtils.isInRange = function(num, min, max) {
    return num >= min && num <= max;
  };

  NumberUtils.random = function(min, max, negative) {
    if (negative == null) {
      negative = false;
    }
    if (!negative) {
      return Math.floor(Math.random() * max) + min;
    } else {
      return Math.floor(Math.random() * (max * 2)) - min;
    }
  };

  return NumberUtils;

})();

var GUIControls,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

GUIControls = (function() {
  GUIControls.prototype.el = null;

  function GUIControls() {
    this.onSnowColorChange = __bind(this.onSnowColorChange, this);
    this.initSantaControls = __bind(this.initSantaControls, this);
    var soundFolder;
    this.el = new dat.GUI;
    this.el.domElement.style.right = 'inherit !important';
    soundFolder = this.el.addFolder('Sound');
    soundFolder.add(sound, 'averageHit', 0, 255).name('Hit point');
    soundFolder.add(sound, 'signal', 0, 255).name('UV Meter');
    soundFolder.open();
    null;
  }

  GUIControls.prototype.initSantaControls = function() {
    return null;
  };

  GUIControls.prototype.onSnowColorChange = function(evt) {
    snow.systemMaterial.uniforms.color.value.set(snow.mainColor);
    snow.systemMaterial.uniforms.height.value = snow.height;
    snow.systemMaterial.uniforms.radiusX.value = snow.radiusX;
    snow.systemMaterial.uniforms.radiusZ.value = snow.radiusZ;
    snow.systemMaterial.uniforms.opacity.value = snow.opacity;
    return null;
  };

  GUIControls.prototype.update = function() {
    this.el.__folders.Sound.__controllers[0].updateDisplay();
    this.el.__folders.Sound.__controllers[1].updateDisplay();
    return null;
  };

  return GUIControls;

})();

var PoseInstructionGenerator,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

PoseInstructionGenerator = (function() {
  PoseInstructionGenerator.prototype.stripElement = null;

  PoseInstructionGenerator.prototype.availableInstructionsLabel = null;

  PoseInstructionGenerator.prototype.currentInstructionLabel = '';

  PoseInstructionGenerator.prototype.currentInstruction = null;

  PoseInstructionGenerator.prototype.timeBeforeNextPose = 0;

  PoseInstructionGenerator.prototype.canGenerate = true;

  PoseInstructionGenerator.prototype.canPressKey = false;

  PoseInstructionGenerator.prototype.instructionsOnDOM = null;

  PoseInstructionGenerator.prototype.timerOut = null;

  PoseInstructionGenerator.prototype.posesInstructions = null;

  PoseInstructionGenerator.prototype.posesContainer = null;

  PoseInstructionGenerator.prototype.arrowContainer = null;

  PoseInstructionGenerator.prototype.scoreContainer = null;

  PoseInstructionGenerator.prototype.currentScore = 0;

  PoseInstructionGenerator.prototype.totalAppeared = 0;

  function PoseInstructionGenerator() {
    this.onWrongKeyPressed = __bind(this.onWrongKeyPressed, this);
    this.onKeyPressed = __bind(this.onKeyPressed, this);
    this.checkKey = __bind(this.checkKey, this);
    this.update = __bind(this.update, this);
    this.generateInstruction = __bind(this.generateInstruction, this);
    this.initEvents = __bind(this.initEvents, this);
    this.instructionsOnDOM = [];
    this.availableInstructionsLabel = ['tutu', 'ballerina', 'kungfu', 'happyGuyOnTheBeach'];
    this.posesInstructions = $('.posesInstructions')[0];
    this.posesContainer = $('.poses')[0];
    this.arrowContainer = $('.posesInstructions p')[0];
    this.scoreContainer = $('.score')[0];
    this.initEvents();
    null;
  }

  PoseInstructionGenerator.prototype.initEvents = function() {
    window.addEventListener('keydown', this.checkKey);
    return null;
  };

  PoseInstructionGenerator.prototype.generateInstruction = function() {
    var tempInstructionLabel;
    if (this.timeBeforeNextPose > 0 || this.currentInstruction !== null) {
      return;
    }
    tempInstructionLabel = this.availableInstructionsLabel[NumberUtils.random(0, 4)];
    this.displayIntruction(tempInstructionLabel);
    return null;
  };

  PoseInstructionGenerator.prototype.displayIntruction = function(tempInstructionLabel) {
    if (tempInstructionLabel === this.currentInstructionLabel) {
      this.generateInstruction();
      return;
    }
    if (autoMode) {
      this.timeBeforeNextPose = 300;
    } else {
      this.timeBeforeNextPose = 1000;
    }
    this.canPressKey = true;
    if (!introEnded) {
      return;
    }
    this.currentInstructionLabel = tempInstructionLabel;
    this.posesInstructions.className = 'posesInstructions show ' + this.currentInstructionLabel;
    if (autoMode) {
      if (this.currentInstructionLabel === 'tutu') {
        santa.poseLikeATutuDancer(true, .2);
      } else if (this.currentInstructionLabel === 'ballerina') {
        santa.poseLikeABallerina(true, .2);
      } else if (this.currentInstructionLabel === 'kungfu') {
        santa.poseLikeAKungFuPanda(true, .2);
      } else if (this.currentInstructionLabel === 'happyGuyOnTheBeach') {
        santa.poseLikeAHappyGuyOnTheBeach(true, .2);
      }
    } else {
      this.totalAppeared++;
      this.updateScore();
    }
    return null;
  };

  PoseInstructionGenerator.prototype.update = function(elapsedTime) {
    if (this.timeBeforeNextPose > 0) {
      this.timeBeforeNextPose -= elapsedTime;
    }
    return null;
  };

  PoseInstructionGenerator.prototype.checkKey = function(evt) {
    if (!this.canPressKey) {
      return;
    }
    console.log(evt);
    console.log(evt.keyIdentifier, this.currentInstructionLabel);
    if (evt.keyIdentifier === 'Up') {
      santa.poseLikeATutuDancer(true, .2);
      if (this.currentInstructionLabel === 'tutu') {
        this.onGoodKeyPress();
      }
    } else if (evt.keyIdentifier === 'Down') {
      santa.poseLikeABallerina(true, .2);
      if (this.currentInstructionLabel === 'ballerina') {
        this.onGoodKeyPress();
      }
    } else if (evt.keyIdentifier === 'Left') {
      santa.poseLikeAKungFuPanda(true, .2);
      if (this.currentInstructionLabel === 'kungfu') {
        this.onGoodKeyPress();
      }
    } else if (evt.keyIdentifier === 'Right') {
      santa.poseLikeAHappyGuyOnTheBeach(true, .2);
      if (this.currentInstructionLabel === 'happyGuyOnTheBeach') {
        this.onGoodKeyPress();
      }
    } else {
      this.onWrongKeyPressed();
    }
    this.currentInstructionLabel = null;
    this.currentInstruction = null;
    return null;
  };

  PoseInstructionGenerator.prototype.onKeyPressed = function(key) {
    return null;
  };

  PoseInstructionGenerator.prototype.onWrongKeyPressed = function() {
    return null;
  };

  PoseInstructionGenerator.prototype.onGoodKeyPress = function() {
    this.currentScore++;
    this.updateScore();
    return null;
  };

  PoseInstructionGenerator.prototype.updateScore = function() {
    this.scoreContainer.innerHTML = this.currentScore + '/' + this.totalAppeared;
    return null;
  };

  PoseInstructionGenerator.prototype.show = function(autoMode) {
    this.posesInstructions.className = 'posesInstructions show tutu';
    if (!autoMode) {
      this.scoreContainer.className = 'score show';
    }
    return null;
  };

  return PoseInstructionGenerator;

})();

var Santa,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Santa = (function() {
  Santa.prototype.dae = null;

  Santa.prototype.skin = null;

  Santa.prototype.mesh = null;

  Santa.prototype.hips = null;

  Santa.prototype.spine = null;

  Santa.prototype.chest = null;

  Santa.prototype.neck = null;

  Santa.prototype.head = null;

  Santa.prototype.leftShoulder = null;

  Santa.prototype.leftForearm = null;

  Santa.prototype.leftHand = null;

  Santa.prototype.rightShoulder = null;

  Santa.prototype.rightForearm = null;

  Santa.prototype.rightHand = null;

  Santa.prototype.leftThigh = null;

  Santa.prototype.leftShin = null;

  Santa.prototype.leftFoot = null;

  Santa.prototype.leftToe = null;

  Santa.prototype.rightThigh = null;

  Santa.prototype.rightShin = null;

  Santa.prototype.rightFoot = null;

  Santa.prototype.rightToe = null;

  Santa.prototype.isReady = false;

  function Santa() {
    this.update = __bind(this.update, this);
    this.poseLikeAHappyGuyOnTheBeach = __bind(this.poseLikeAHappyGuyOnTheBeach, this);
    this.poseLikeAKungFuPanda = __bind(this.poseLikeAKungFuPanda, this);
    this.poseLikeABallerina = __bind(this.poseLikeABallerina, this);
    this.poseLikeATutuDancer = __bind(this.poseLikeATutuDancer, this);
    this.reverseToe = __bind(this.reverseToe, this);
    this.moveBones = __bind(this.moveBones, this);
    this.rest = __bind(this.rest, this);
    this.bonesJustMoved = [];
    this.load();
    null;
  }

  Santa.prototype.load = function() {
    var loader,
      _this = this;
    loader = new THREE.JSONLoader();
    loader.load('./assets/models/santa.js', function(geo, mat) {
      var speed;
      if (_this.isReady) {
        return;
      }
      _this.isReady = true;
      _this.mesh = new THREE.SkinnedMesh(geo, new THREE.MeshFaceMaterial(mat));
      _this.mesh.rotation.y = Math.PI;
      _this.mesh.material.materials.forEach(function(mat) {
        mat.skinning = true;
        _this.mesh.traverse(function(child) {
          child.castShadow = true;
          return child.receiveShadow = false;
        });
        _this.mesh.position.set(0, -130, 0);
        _this.mesh.rotation.set(0, Math.PI * 2, 0);
        return _this.mesh.scale.x = _this.mesh.scale.y = _this.mesh.scale.z = 10;
      });
      _this.hips = {
        isAnimating: false,
        el: _this.mesh.bones[0],
        startPosition: _this.mesh.bones[0].position,
        startRotation: _this.mesh.bones[0].rotation,
        positionTween: null,
        rotationTween: null,
        timeBeforeNextMove: 0
      };
      _this.spine = {
        isAnimating: false,
        el: _this.mesh.bones[1],
        startPosition: _this.mesh.bones[1].position,
        startRotation: _this.mesh.bones[1].rotation,
        positionTween: null,
        rotationTween: null,
        timeBeforeNextMove: 0
      };
      _this.chest = {
        isAnimating: false,
        el: _this.mesh.bones[2],
        startPosition: _this.mesh.bones[2].position,
        startRotation: _this.mesh.bones[2].rotation,
        positionTween: null,
        rotationTween: null,
        timeBeforeNextMove: 0
      };
      _this.neck = {
        isAnimating: false,
        el: _this.mesh.bones[3],
        startPosition: _this.mesh.bones[3].position,
        startRotation: _this.mesh.bones[3].rotation,
        positionTween: null,
        rotationTween: null,
        timeBeforeNextMove: 0
      };
      _this.leftShoulder = {
        isAnimating: false,
        el: _this.mesh.bones[7],
        startPosition: _this.mesh.bones[7].position,
        startRotation: _this.mesh.bones[7].rotation,
        positionTween: null,
        rotationTween: null,
        timeBeforeNextMove: 0
      };
      _this.leftForearm = {
        isAnimating: false,
        el: _this.mesh.bones[8],
        startPosition: _this.mesh.bones[8].position,
        startRotation: _this.mesh.bones[8].rotation,
        positionTween: null,
        rotationTween: null,
        timeBeforeNextMove: 0
      };
      _this.leftHand = {
        isAnimating: false,
        el: _this.mesh.bones[9],
        startPosition: _this.mesh.bones[9].position,
        startRotation: _this.mesh.bones[9].rotation,
        positionTween: null,
        rotationTween: null,
        timeBeforeNextMove: 0
      };
      _this.rightShoulder = {
        isAnimating: false,
        el: _this.mesh.bones[30],
        startPosition: _this.mesh.bones[30].position,
        startRotation: _this.mesh.bones[30].rotation,
        positionTween: null,
        rotationTween: null,
        timeBeforeNextMove: 0
      };
      _this.rightForearm = {
        isAnimating: false,
        el: _this.mesh.bones[31],
        startPosition: _this.mesh.bones[31].position,
        startRotation: _this.mesh.bones[31].rotation,
        positionTween: null,
        rotationTween: null,
        timeBeforeNextMove: 0
      };
      _this.rightHand = {
        isAnimating: false,
        el: _this.mesh.bones[32],
        startPosition: _this.mesh.bones[32].position,
        startRotation: _this.mesh.bones[32].rotation,
        positionTween: null,
        rotationTween: null,
        timeBeforeNextMove: 0
      };
      _this.leftThigh = {
        isAnimating: false,
        el: _this.mesh.bones[52],
        startPosition: _this.mesh.bones[52].position,
        startRotation: _this.mesh.bones[52].rotation,
        positionTween: null,
        rotationTween: null,
        timeBeforeNextMove: 0
      };
      _this.leftShin = {
        isAnimating: false,
        el: _this.mesh.bones[53],
        startPosition: _this.mesh.bones[53].position,
        startRotation: _this.mesh.bones[53].rotation,
        positionTween: null,
        rotationTween: null,
        timeBeforeNextMove: 0
      };
      _this.leftFoot = {
        isAnimating: false,
        el: _this.mesh.bones[54],
        startPosition: _this.mesh.bones[54].position,
        startRotation: _this.mesh.bones[54].rotation,
        positionTween: null,
        rotationTween: null,
        timeBeforeNextMove: 0
      };
      _this.leftToe = {
        isAnimating: false,
        el: _this.mesh.bones[55],
        startPosition: _this.mesh.bones[55].position,
        startRotation: _this.mesh.bones[55].rotation,
        positionTween: null,
        rotationTween: null,
        timeBeforeNextMove: 0
      };
      _this.rightThigh = {
        isAnimating: false,
        el: _this.mesh.bones[58],
        startPosition: _this.mesh.bones[58].position,
        startRotation: _this.mesh.bones[58].rotation,
        positionTween: null,
        rotationTween: null,
        timeBeforeNextMove: 0
      };
      _this.rightShin = {
        isAnimating: false,
        el: _this.mesh.bones[59],
        startPosition: _this.mesh.bones[59].position,
        startRotation: _this.mesh.bones[59].rotation,
        positionTween: null,
        rotationTween: null,
        timeBeforeNextMove: 0
      };
      _this.rightFoot = {
        isAnimating: false,
        el: _this.mesh.bones[60],
        startPosition: _this.mesh.bones[60].position,
        startRotation: _this.mesh.bones[60].rotation,
        positionTween: null,
        rotationTween: null,
        timeBeforeNextMove: 0
      };
      _this.rightToe = {
        isAnimating: false,
        el: _this.mesh.bones[61],
        startPosition: _this.mesh.bones[61].position,
        startRotation: _this.mesh.bones[61].rotation,
        positionTween: null,
        rotationTween: null,
        timeBeforeNextMove: 0
      };
      _this.bodyPieces = [_this.neck, _this.leftShoulder, _this.leftForearm, _this.leftHand, _this.rightShoulder, _this.rightForearm, _this.rightHand];
      speed = 0;
      _this.poseLikeATutuDancer();
      return _this.onLoaded();
    });
    return null;
  };

  Santa.prototype.onLoaded = function() {
    return null;
  };

  Santa.prototype.rest = function(animated, speed) {
    if (animated == null) {
      animated = false;
    }
    if (speed == null) {
      speed = 0.3;
    }
    this.hips.positionTween = new TweenLite(this.hips.el.position, speed, {
      x: 0,
      y: 4.80336,
      z: -0.276
    });
    this.hips.rotationTween = new TweenLite(this.hips.el.rotation, speed, {
      x: 0,
      y: 0,
      z: 0
    });
    this.spine.positionTween = new TweenLite(this.spine.el.position, speed, {
      x: 0,
      y: 1.11514,
      z: 0.19
    });
    this.spine.rotationTween = new TweenLite(this.spine.el.rotation, speed, {
      x: 0,
      y: 0,
      z: 0
    });
    this.chest.positionTween = new TweenLite(this.chest.el.position, speed, {
      x: 0,
      y: 0.7905,
      z: 0.084
    });
    this.chest.rotationTween = new TweenLite(this.chest.el.rotation, speed, {
      x: 0,
      y: 0,
      z: 0
    });
    this.leftShoulder.positionTween = new TweenLite(this.leftShoulder.el.position, speed, {
      x: 0,
      y: 1.582,
      z: -0.0550001
    });
    this.leftShoulder.rotationTween = new TweenLite(this.leftShoulder.el.rotation, speed, {
      x: 0,
      y: 0,
      z: 0
    });
    this.leftForearm.positionTween = new TweenLite(this.leftForearm.el.position, speed, {
      x: 0,
      y: 0,
      z: 0
    });
    this.leftForearm.rotationTween = new TweenLite(this.leftForearm.el.rotation, speed, {
      x: 0,
      y: 0,
      z: 0
    });
    this.leftHand.positionTween = new TweenLite(this.leftHand.el.position, speed, {
      x: 1.31521,
      y: -0.717366,
      z: 0.0313626
    });
    this.leftHand.rotationTween = new TweenLite(this.leftHand.el.rotation, speed, {
      x: 0,
      y: 0,
      z: 0
    });
    this.rightShoulder.positionTween = new TweenLite(this.rightShoulder.el.position, speed, {
      x: -1.28868,
      y: -0.292931,
      z: -0.4755
    });
    this.rightShoulder.rotationTween = new TweenLite(this.rightShoulder.el.rotation, speed, {
      x: 0,
      y: 0,
      z: 0
    });
    this.rightForearm.positionTween = new TweenLite(this.rightForearm.el.position, speed, {
      x: -1.16156,
      y: -0.654974,
      z: 0.0037012
    });
    this.rightForearm.rotationTween = new TweenLite(this.rightForearm.el.rotation, speed, {
      x: 0,
      y: 0,
      z: 0
    });
    this.rightHand.positionTween = new TweenLite(this.rightHand.el.position, speed, {
      x: -1.31521,
      y: -0.717366,
      z: 0.0313626
    });
    this.rightHand.rotationTween = new TweenLite(this.rightHand.el.rotation, speed, {
      x: 0,
      y: 0,
      z: 0
    });
    this.leftThigh.positionTween = new TweenLite(this.leftThigh.el.position, speed, {
      x: 0.799119,
      y: 0.186009,
      z: 0.214
    });
    this.leftThigh.rotationTween = new TweenLite(this.leftThigh.el.rotation, speed, {
      x: 0,
      y: 0,
      z: 0
    });
    this.leftShin.positionTween = new TweenLite(this.leftShin.el.position, speed, {
      x: 0.0800303,
      y: -2.07062,
      z: 0.205
    });
    this.leftShin.rotationTween = new TweenLite(this.leftShin.el.rotation, speed, {
      x: 0,
      y: 0,
      z: 0
    });
    this.leftFoot.positionTween = new TweenLite(this.leftFoot.el.position, speed, {
      x: 0,
      y: -2.49275,
      z: -0.131957
    });
    this.leftFoot.rotationTween = new TweenLite(this.leftFoot.el.rotation, speed, {
      x: 0,
      y: 0,
      z: 0
    });
    this.leftToe.positionTween = new TweenLite(this.leftToe.el.position, speed, {
      x: 0,
      y: -0.3425,
      z: 0.548
    });
    this.leftToe.rotationTween = new TweenLite(this.leftToe.el.rotation, speed, {
      x: 0,
      y: 0,
      z: 0
    });
    this.rightThigh.positionTween = new TweenLite(this.rightThigh.el.position, speed, {
      x: -0.799119,
      y: 0.186009,
      z: 0.214
    });
    this.rightThigh.rotationTween = new TweenLite(this.rightThigh.el.rotation, speed, {
      x: 0,
      y: 0,
      z: 0
    });
    this.rightShin.positionTween = new TweenLite(this.rightShin.el.position, speed, {
      x: -0.0800303,
      y: -2.07062,
      z: 0.205
    });
    this.rightShin.rotationTween = new TweenLite(this.rightShin.el.rotation, speed, {
      x: 0,
      y: 0,
      z: 0
    });
    this.rightFoot.positionTween = new TweenLite(this.rightFoot.el.position, speed, {
      x: 0,
      y: -2.49275,
      z: -0.131957
    });
    this.rightFoot.rotationTween = new TweenLite(this.rightFoot.el.rotation, speed, {
      x: 0,
      y: 0,
      z: 0
    });
    this.rightToe.positionTween = new TweenLite(this.rightToe.el.position, speed, {
      x: 0,
      y: -0.3425,
      z: 0.548
    });
    this.rightToe.rotationTween = new TweenLite(this.rightToe.el.rotation, speed, {
      x: 0,
      y: 0,
      z: 0
    });
    return null;
  };

  Santa.prototype.moveBones = function(channel) {
    if (this.rightToe.timeBeforeNextMove > 0) {
      return;
    }
    this.rightToe.rotationTween = new TweenLite(this.rightToe.el.rotation, 5, {
      x: -0.7,
      onComplete: this.reverseToe
    });
    this.rightToe.timeBeforeNextMove = 20;
    return null;
  };

  Santa.prototype.reverseToe = function() {
    this.rightToe.rotationTween = TweenLite.to(this.rightToe.el.rotation, .1, {
      x: 0
    });
    return null;
  };

  Santa.prototype.poseLikeATutuDancer = function(animated, speed) {
    if (animated == null) {
      animated = false;
    }
    console.log('Look at my tutu pose <3');
    if (animated) {
      this.rest();
      this.leftShoulder.tween = new TweenLite(this.leftShoulder.el.rotation, speed, {
        z: 2
      });
      this.rightShoulder.tween = new TweenLite(this.rightShoulder.el.rotation, speed, {
        z: -2
      });
      this.leftHand.tween = new TweenLite(this.leftHand.el.rotation, speed, {
        x: 3
      });
      this.rightHand.tween = new TweenLite(this.rightHand.el.rotation, speed, {
        x: -3
      });
      this.leftShin.positionTween = new TweenLite(this.leftShin.el.position, speed, {
        x: 0.0800303,
        y: -2.07062,
        z: 0.205
      });
      this.leftShin.rotationTween = new TweenLite(this.leftShin.el.rotation, speed, {
        x: 0,
        y: 0,
        z: 0
      });
      this.rightShin.positionTween = new TweenLite(this.rightShin.el.position, speed, {
        x: -0.0800303,
        y: -2.07062,
        z: 0.205
      });
      this.rightShin.rotationTween = new TweenLite(this.rightShin.el.rotation, speed, {
        x: 0,
        y: 0,
        z: 0
      });
      this.leftFoot.positionTween = new TweenLite(this.leftFoot.el.position, speed, {
        x: 0,
        y: -2.49275,
        z: -0.131957
      });
      this.leftFoot.rotationTween = new TweenLite(this.leftFoot.el.rotation, speed, {
        x: 0,
        y: 0,
        z: 0
      });
      this.chest.positionTween = new TweenLite(this.chest.el.position, speed, {
        x: 0,
        y: 0.7905,
        z: 0.084
      });
      this.chest.rotationTween = new TweenLite(this.chest.el.rotation, speed, {
        x: 0,
        y: 0,
        z: 0
      });
    } else {
      this.leftShoulder.el.rotation.z = 2;
      this.rightShoulder.el.rotation.z = -2;
      this.leftHand.el.rotation.x = -3;
      this.rightHand.el.rotation.x = 3;
    }
    return null;
  };

  Santa.prototype.poseLikeABallerina = function(animated, speed) {
    if (animated == null) {
      animated = false;
    }
    console.log('Look at my ballerina pose <3');
    if (animated) {
      this.rest();
      this.leftShoulder.tween = new TweenLite(this.leftShoulder.el.rotation, speed, {
        z: 2
      });
      this.rightShoulder.tween = new TweenLite(this.rightShoulder.el.rotation, speed, {
        z: -2
      });
      this.leftHand.tween = new TweenLite(this.leftHand.el.rotation, speed, {
        x: 3
      });
      this.rightHand.tween = new TweenLite(this.rightHand.el.rotation, speed, {
        x: -3
      });
      this.leftThigh.tween = new TweenLite(this.leftThigh.el.rotation, speed, {
        x: 2,
        y: 2
      });
      this.leftFoot.tween = new TweenLite(this.leftFoot.el.rotation, speed, {
        x: 1
      });
      this.leftShin.positionTween = new TweenLite(this.leftShin.el.position, speed, {
        x: 0.0800303,
        y: -2.07062,
        z: 0.205
      });
      this.leftShin.rotationTween = new TweenLite(this.leftShin.el.rotation, speed, {
        x: 0,
        y: 0,
        z: 0
      });
      this.rightShin.positionTween = new TweenLite(this.rightShin.el.position, speed, {
        x: -0.0800303,
        y: -2.07062,
        z: 0.205
      });
      this.rightShin.rotationTween = new TweenLite(this.rightShin.el.rotation, speed, {
        x: 0,
        y: 0,
        z: 0
      });
      this.chest.positionTween = new TweenLite(this.chest.el.position, speed, {
        x: 0,
        y: 0.7905,
        z: 0.084
      });
      this.chest.rotationTween = new TweenLite(this.chest.el.rotation, speed, {
        x: 0,
        y: 0,
        z: 0
      });
    } else {
      this.leftShoulder.el.rotation.z = .6;
      this.rightShoulder.el.rotation.z = -.6;
      this.leftHand.el.rotation.x = -3;
      this.rightHand.el.rotation.x = 3;
      this.leftThigh.el.rotation.x = 2;
      this.leftThigh.el.rotation.y = 2;
      this.leftFoot.el.rotation.x = 1;
    }
    return null;
  };

  Santa.prototype.poseLikeAKungFuPanda = function(animated, speed) {
    if (animated == null) {
      animated = false;
    }
    console.log('Look at my kung fu panda pose <3');
    if (animated) {
      this.rest();
      this.leftShoulder.tween = new TweenLite(this.leftShoulder.el.rotation, speed, {
        z: 2
      });
      this.rightShoulder.tween = new TweenLite(this.rightShoulder.el.rotation, speed, {
        z: -2
      });
      this.leftHand.tween = new TweenLite(this.leftHand.el.rotation, speed, {
        x: -3
      });
      this.rightHand.tween = new TweenLite(this.rightHand.el.rotation, speed, {
        x: 3
      });
      this.rightThigh.tween = new TweenLite(this.rightThigh.el.rotation, speed, {
        x: -2
      });
      this.rightThigh.tween = new TweenLite(this.rightThigh.el.rotation, speed, {
        y: -1
      });
      this.rightShin.tween = new TweenLite(this.rightShin.el.rotation, speed, {
        x: 2
      });
      this.leftShin.positionTween = new TweenLite(this.leftShin.el.position, speed, {
        x: 0.0800303,
        y: -2.07062,
        z: 0.205
      });
      this.leftShin.rotationTween = new TweenLite(this.leftShin.el.rotation, speed, {
        x: 0,
        y: 0,
        z: 0
      });
      this.leftFoot.positionTween = new TweenLite(this.leftFoot.el.position, speed, {
        x: 0,
        y: -2.49275,
        z: -0.131957
      });
      this.leftFoot.rotationTween = new TweenLite(this.leftFoot.el.rotation, speed, {
        x: 0,
        y: 0,
        z: 0
      });
      this.chest.positionTween = new TweenLite(this.chest.el.position, speed, {
        x: 0,
        y: 0.7905,
        z: 0.084
      });
      this.chest.rotationTween = new TweenLite(this.chest.el.rotation, speed, {
        x: 0,
        y: 0,
        z: 0
      });
    } else {
      this.leftShoulder.el.rotation.z = 2;
      this.rightShoulder.el.rotation.z = -2;
      this.leftHand.el.rotation.x = -3;
      this.rightHand.el.rotation.x = 3;
      this.rightThigh.el.rotation.x = -2;
      this.rightThigh.el.rotation.y = -1;
      this.rightShin.el.rotation.x = 2;
    }
    return null;
  };

  Santa.prototype.poseLikeAHappyGuyOnTheBeach = function(animated, speed) {
    if (animated == null) {
      animated = false;
    }
    console.log('Look at my happy-guy-on-the-beach pose <3');
    if (animated) {
      this.rest();
      this.chest.tween = new TweenLite(this.chest.el.rotation, speed, {
        x: -2,
        y: -1
      });
      this.leftShoulder.tween = new TweenLite(this.leftShoulder.el.rotation, speed, {
        x: -1
      });
      this.leftForearm.tween = new TweenLite(this.leftForearm.el.rotation, speed, {
        x: -1
      });
      this.leftHand.positionTween = new TweenLite(this.leftHand.el.position, speed, {
        x: 1.31521,
        y: -0.717366,
        z: 0.0313626
      });
      this.leftHand.rotationTween = new TweenLite(this.leftHand.el.rotation, speed, {
        x: 0,
        y: 0,
        z: 0
      });
      this.rightShoulder.tween = new TweenLite(this.rightShoulder.el.rotation, speed, {
        x: -2,
        z: 1
      });
      this.leftShin.tween = new TweenLite(this.leftShin.el.rotation, speed, {
        x: 2
      });
      this.rightShin.positionTween = new TweenLite(this.rightShin.el.position, speed, {
        x: -0.0800303,
        y: -2.07062,
        z: 0.205
      });
      this.rightShin.rotationTween = new TweenLite(this.rightShin.el.rotation, speed, {
        x: 0,
        y: 0,
        z: 0
      });
      this.leftFoot.positionTween = new TweenLite(this.leftFoot.el.position, speed, {
        x: 0,
        y: -2.49275,
        z: -0.131957
      });
      this.leftFoot.rotationTween = new TweenLite(this.leftFoot.el.rotation, speed, {
        x: 0,
        y: 0,
        z: 0
      });
    } else {
      this.chest.el.rotation.x = -2;
      this.chest.el.rotation.y = -1;
      this.leftShoulder.el.rotation.x = -1;
      this.leftForearm.el.rotation.x = -1;
      this.rightShoulder.el.rotation.x = -2;
      this.rightShoulder.el.rotation.z = 1;
      this.leftShin.el.rotation.x = 2;
    }
    return null;
  };

  Santa.prototype.update = function(signal) {
    var bone, _i, _len, _ref;
    if (!this.mesh || !signal) {
      return;
    }
    _ref = this.bodyPieces;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      bone = _ref[_i];
      if (bone.timeBeforeNextMove > 0) {
        bone.timeBeforeNextMove -= 1;
      }
    }
    this.mesh.matrixWorldNeedsUpdate = true;
    this.mesh.geometry.verticesNeedUpdate = true;
    return null;
  };

  return Santa;

})();

var SecretDancePoses;

SecretDancePoses = (function() {
  function SecretDancePoses() {
    console.log("You musn't instanciate SecretDancePoses");
    return;
  }

  return SecretDancePoses;

})();

var Snow,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Snow = (function() {
  Snow.prototype.numParticles = 1000;

  Snow.prototype.width = 400;

  Snow.prototype.height = 400;

  Snow.prototype.depth = 400;

  Snow.prototype.systemGeometry = null;

  Snow.prototype.systemMaterial = null;

  Snow.prototype.system = null;

  Snow.prototype.particleVelocityY = 0.5;

  Snow.prototype.mainColor = 0xffffff;

  Snow.prototype.radiusX = 5;

  Snow.prototype.radiusY = 5;

  Snow.prototype.opacity = 1;

  Snow.prototype.speedH = 1.0;

  Snow.prototype.speedV = 1.0;

  Snow.prototype.tempParticlesSystem = null;

  Snow.prototype.texture = null;

  Snow.prototype.clok = true;

  Snow.prototype.isMute = false;

  Snow.prototype.opacity = 0;

  function Snow() {
    this.addColorParticles = __bind(this.addColorParticles, this);
    var _uniforms;
    this.firstTime = true;
    this.isMute = false;
    this.tempParticlesSystem = [];
    this.texture = THREE.ImageUtils.loadTexture('./assets/img/snowflake1.png');
    this.systemGeometry = new THREE.Geometry;
    _uniforms = {
      color: {
        type: 'c',
        value: new THREE.Color(0xffffff)
      },
      height: {
        type: 'f',
        value: this.height
      },
      elapsedTime: {
        type: 'f',
        value: 0
      },
      radiusX: {
        type: 'f',
        value: 5
      },
      radiusY: {
        type: 'f',
        value: 5
      },
      size: {
        type: 'f',
        value: 100
      },
      scale: {
        type: 'f',
        value: 22.0
      },
      opacity: {
        type: 'f',
        value: 0.0
      },
      texture: {
        type: 't',
        value: this.texture
      },
      speedH: {
        type: 'f',
        value: this.speedH
      },
      speedV: {
        type: 'f',
        value: this.speedV
      }
    };
    this.systemMaterial = new THREE.ShaderMaterial({
      uniforms: _uniforms,
      vertexShader: document.getElementById('snow_vs').textContent,
      fragmentShader: document.getElementById('snow_fs').textContent,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: false,
      opacity: 0
    });
    this.systemMaterial.opacity = 0;
    this.init();
    null;
  }

  Snow.prototype.init = function() {
    var i, vertex, x, y, z, _i, _ref;
    for (i = _i = 0, _ref = this.numParticles; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      x = NumberUtils.random(0, this.height / 2) * Math.cos(NumberUtils.random(0, 360));
      y = NumberUtils.random(0, this.height);
      z = NumberUtils.random(0, this.height / 2) * Math.sin(NumberUtils.random(0, 360));
      vertex = new THREE.Vector3(x, y, z);
      this.systemGeometry.vertices.push(vertex);
    }
    this.system = new THREE.ParticleSystem(this.systemGeometry, this.systemMaterial);
    this.system.position.x = 0;
    this.system.position.y = 0;
    this.system.position.z = 0;
    return null;
  };

  Snow.prototype.addColorParticles = function(fromChannel) {
    var c, i, systemGeometry, systemMaterial, systemParticle, vertex, x, y, z, _i, _uniforms;
    switch (fromChannel) {
      case '0':
        c = 0xdddddd;
        break;
      case '1':
        c = 0x800000;
        break;
      case '2':
        c = 0x084C07;
        break;
      case '3':
        c = 0x084C07;
        break;
      case '4':
        c = 0x2F8396;
    }
    if (!this.firstTime) {
      return;
    }
    this.firstTime = false;
    systemGeometry = new THREE.Geometry;
    _uniforms = {
      color: {
        type: 'c',
        value: new THREE.Color(c)
      },
      height: {
        type: 'f',
        value: this.height
      },
      elapsedTime: {
        type: 'f',
        value: 0
      },
      radiusX: {
        type: 'f',
        value: 5
      },
      radiusY: {
        type: 'f',
        value: 5
      },
      size: {
        type: 'f',
        value: 100
      },
      scale: {
        type: 'f',
        value: 30.0
      },
      opacity: {
        type: 'f',
        value: 1.0
      },
      texture: {
        type: 't',
        value: this.texture
      },
      speedH: {
        type: 'f',
        value: this.speedH
      },
      speedV: {
        type: 'f',
        value: this.speedV
      }
    };
    systemMaterial = new THREE.ShaderMaterial({
      uniforms: _uniforms,
      vertexShader: document.getElementById('snow_vs').textContent,
      fragmentShader: document.getElementById('snow_fs').textContent,
      transparent: true,
      depthTest: false
    });
    for (i = _i = 0; _i < 1000; i = ++_i) {
      x = NumberUtils.random(0, this.height / 2) * Math.cos(NumberUtils.random(0, 360));
      y = NumberUtils.random(0, this.height);
      z = NumberUtils.random(0, this.height / 2) * Math.sin(NumberUtils.random(0, 360));
      vertex = new THREE.Vector3(x, y, z);
      systemGeometry.vertices.push(vertex);
    }
    systemParticle = new THREE.ParticleSystem(systemGeometry, systemMaterial);
    systemParticle.position.x = 0;
    systemParticle.position.y = 0;
    systemParticle.position.z = 0;
    this.tempParticlesSystem.push(systemParticle);
    return null;
  };

  Snow.prototype.update = function(elapsedTime) {
    var s, _i, _len, _ref;
    this.system.material.uniforms.elapsedTime.value = elapsedTime * 20;
    this.system.geometry.verticesNeedUpdate = true;
    if (this.tempParticlesSystem.length > 0) {
      _ref = this.tempParticlesSystem;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        s.material.uniforms.elapsedTime.value = elapsedTime * 20;
      }
    }
    return null;
  };

  return Snow;

})();

var Sound,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Sound = (function() {
  Sound.prototype.context = null;

  Sound.prototype.audioBuffer = null;

  Sound.prototype.sourceNode = null;

  Sound.prototype.analyser = null;

  Sound.prototype.scriptProcessorNode = null;

  Sound.prototype.signal = 0;

  Sound.prototype.isMusicOneReady = false;

  Sound.prototype.isMusicTwoReady = false;

  Sound.prototype.averageHit = 0;

  function Sound() {
    this.onScriptProcessorNodeAudioProcess = __bind(this.onScriptProcessorNodeAudioProcess, this);
    if (!window.AudioContext) {
      if (!window.webkitAudioContext) {
        console.log('no audio context');
      } else {
        window.AudioContext = window.webkitAudioContext;
      }
    }
    this.context = new AudioContext;
    null;
  }

  Sound.prototype.loadMusicOne = function(url, callback) {
    var request,
      _this = this;
    request = new XMLHttpRequest;
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
      _this.context.decodeAudioData(request.response, function(buffer) {
        _this.bufferOne = buffer;
        _this.isMusicOneReady = true;
        _this.onLoaded();
        if (typeof callback === 'function') {
          callback();
        }
        return null;
      }, function() {
        console.log('[Sound] Couldnt load sound');
        return null;
      });
      return null;
    };
    return request.send();
  };

  null;

  Sound.prototype.loadMusicTwo = function(url, callback) {
    var request,
      _this = this;
    request = new XMLHttpRequest;
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
      _this.context.decodeAudioData(request.response, function(buffer) {
        _this.bufferTwo = buffer;
        _this.isMusicTwoReady = true;
        _this.onLoaded();
        if (typeof callback === 'function') {
          callback();
        }
        return null;
      }, function() {
        console.log('[Sound] Couldnt load sound');
        return null;
      });
      return null;
    };
    return request.send();
  };

  null;

  Sound.prototype.play = function(autoMode) {
    var buffer;
    if (autoMode) {
      buffer = this.bufferTwo;
      this.averageHit = 70;
    } else {
      buffer = this.bufferOne;
      this.averageHit = 100;
    }
    this.sourceNode.buffer = buffer;
    this.sourceNode.start(0);
    return null;
  };

  Sound.prototype.initAnalyser = function() {
    this.analyser = this.context.createAnalyser();
    this.analyser.smoothingTimeConstant = .8;
    this.analyser.fftSize = 1024;
    return null;
  };

  Sound.prototype.initScriptProcessorNode = function() {
    this.scriptProcessorNode = this.context.createScriptProcessor(2048, 1, 1);
    this.scriptProcessorNode.connect(this.context.destination);
    this.scriptProcessorNode.onaudioprocess = this.onScriptProcessorNodeAudioProcess;
    return null;
  };

  Sound.prototype.initSourceNode = function() {
    this.sourceNode = this.context.createBufferSource();
    this.sourceNode.connect(this.analyser);
    this.analyser.connect(this.scriptProcessorNode);
    this.sourceNode.connect(this.context.destination);
    return null;
  };

  Sound.prototype.onScriptProcessorNodeAudioProcess = function() {
    var amplitudes, check;
    check = false;
    amplitudes = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(amplitudes);
    this.signal = this.getAverageVolume(amplitudes);
    if (this.signal === 0 && xpStarted) {
      playEnd();
    }
    if (this.signal >= this.averageHit) {
      check = true;
      this.onChannelHit();
    }
    return null;
  };

  Sound.prototype.getAverageVolume = function(amplitudes) {
    var amplitude, values, _i, _len;
    values = 0;
    for (_i = 0, _len = amplitudes.length; _i < _len; _i++) {
      amplitude = amplitudes[_i];
      values += amplitude;
    }
    return values / amplitudes.length;
    return null;
  };

  Sound.prototype.onChannelHit = function(channel) {
    return null;
  };

  Sound.prototype.toggleMute = function() {
    this.isMute = !this.isMute;
    if (this.isMute) {
      this.sourceNode.volume = 1;
    } else {
      this.sourceNode.volume = 0;
    }
    return null;
  };

  Sound.prototype.onLoaded = function() {
    return null;
  };

  Sound.prototype.slowDown = function() {
    TweenLite.to(this.sourceNode.playbackRate, 1, {
      value: .3
    });
    return null;
  };

  return Sound;

})();

var WoodScene;

WoodScene = (function() {
  WoodScene.prototype.mesh = null;

  WoodScene.prototype.isReady = null;

  function WoodScene() {
    this.init();
    null;
  }

  WoodScene.prototype.init = function() {
    var angleStep, currentAngle, floorGeometry, floorMaterial, floorTexture, i, options, points, shape, totalPoints, x, y, z, _i,
      _this = this;
    points = [];
    totalPoints = 60;
    angleStep = totalPoints / 360;
    currentAngle = 0;
    for (i = _i = 0; 0 <= totalPoints ? _i < totalPoints : _i > totalPoints; i = 0 <= totalPoints ? ++_i : --_i) {
      x = 200 * Math.cos(currentAngle);
      y = 200 * Math.sin(currentAngle);
      z = 0;
      points.push(new THREE.Vector3(x, y, z));
      currentAngle += angleStep;
    }
    shape = new THREE.Shape(points);
    options = {
      amount: 30,
      bevelEnabled: false,
      bevelSegments: 2,
      steps: 1,
      extrudePath: null
    };
    floorTexture = new THREE.ImageUtils.loadTexture('./assets/img/floor.jpg', new THREE.UVMapping(), function() {
      _this.isReady = true;
      return _this.onLoaded();
    });
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(10, 10);
    floorMaterial = new THREE.MeshLambertMaterial({
      map: floorTexture,
      side: THREE.DoubleSide
    });
    floorGeometry = new THREE.PlaneGeometry(1000, 1000, 300, 300);
    this.mesh = new THREE.Mesh(floorGeometry, floorMaterial);
    scene.add(this.mesh);
    return null;
  };

  WoodScene.prototype.onLoaded = function() {
    return null;
  };

  return WoodScene;

})();

var STAGE_HEIGHT, STAGE_WIDTH, animate, autoMode, camera, cameraRadius, cameraSpeed, checkIfAllLoaded, clock, controls, cylinder, delta, fog, getElapsedTime, guiControls, hole, init, initEngine, initGUI, initLight, initLum, initPoseIntructionsGenerator, initSanta, initSnow, initSound, initStats, initTrackBallControls, initWoodScene, introAnimComplete, introEnded, onPlayIntroComplete, onPlayIntroUpdate, onStartButtonClick, playEnd, playIntro, poseInstructionGenerator, render, renderer, santa, scene, snow, sound, spotlight, stats, target, update, woodScene, xpStarted,
  _this = this;

STAGE_WIDTH = 0;

STAGE_HEIGHT = 0;

camera = null;

scene = null;

renderer = null;

fog = null;

clock = null;

delta = 0;

snow = null;

sound = null;

woodScene = null;

santa = null;

spotlight = null;

hole = null;

cylinder = null;

poseInstructionGenerator = null;

guiControls = null;

controls = null;

stats = null;

target = null;

introEnded = false;

autoMode = false;

xpStarted = false;

introAnimComplete = false;

cameraSpeed = 0;

cameraRadius = 0;

init = function() {
  STAGE_WIDTH = window.innerWidth;
  STAGE_HEIGHT = window.innerHeight;
  initEngine();
  initLum();
  initWoodScene();
  initPoseIntructionsGenerator();
  initSnow();
  initSanta();
  initSound();
  initGUI();
  initTrackBallControls();
  santa.onLoaded = function() {
    checkIfAllLoaded();
    return guiControls.initSantaControls();
  };
  sound.onLoaded = checkIfAllLoaded;
  woodScene.onLoaded = checkIfAllLoaded;
  animate();
  return null;
};

initEngine = function() {
  var cameraTarget;
  scene = new THREE.Scene;
  camera = new THREE.PerspectiveCamera(45, STAGE_WIDTH / STAGE_HEIGHT, 1, 10000);
  camera.position.x = -169;
  camera.position.y = 29.014027522864485;
  camera.position.z = 0;
  camera.rotation.x = -0.35475103395861907;
  camera.rotation.y = 0.015350179868538257;
  camera.rotation.z = -0.022065570283709802;
  cameraTarget = new THREE.Vector3(0, 0, 0);
  camera.lookAt(cameraTarget);
  renderer = new THREE.WebGLRenderer;
  renderer.setSize(STAGE_WIDTH, STAGE_HEIGHT);
  renderer.setClearColor(0x000000);
  renderer.shadowMapEnabled = true;
  clock = new THREE.Clock;
  document.body.appendChild(renderer.domElement);
  return null;
};

initLum = function() {
  spotlight = new THREE.SpotLight(0xffffff);
  spotlight.position.set(0, 30, 0);
  spotlight.shadowDarkness = 0.95;
  spotlight.intensity = 1;
  spotlight.castShadow = true;
  scene.add(spotlight);
  return null;
};

initTrackBallControls = function() {
  controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;
  controls.keys = [65, 83, 68];
  controls.addEventListener('change', render);
  return null;
};

initStats = function() {
  stats = new Stats;
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);
  return null;
};

initGUI = function() {
  guiControls = new GUIControls;
  return null;
};

initLight = function() {
  var spotLight;
  spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 60, -10);
  spotLight.castShadow = true;
  scene.add(spotLight);
  return null;
};

initSnow = function() {
  snow = new Snow;
  scene.add(snow.system);
  snow.system.position = woodScene.mesh.position;
  return null;
};

initPoseIntructionsGenerator = function() {
  poseInstructionGenerator = new PoseInstructionGenerator;
  return null;
};

initSound = function() {
  sound = new Sound;
  sound.loadMusicOne('./assets/sounds/walking_in_the_air.mp3');
  sound.loadMusicTwo('./assets/sounds/carols_of_the_bells.mp3');
  return null;
};

initWoodScene = function() {
  woodScene = new WoodScene;
  scene.add(woodScene.mesh);
  woodScene.mesh.position.x = 15;
  woodScene.mesh.position.y = 0;
  woodScene.mesh.position.z = 0;
  woodScene.mesh.rotation.x = 0.5 * Math.PI;
  return null;
};

initSanta = function() {
  santa = new Santa;
  return null;
};

checkIfAllLoaded = function() {
  var _this = this;
  if (santa.isReady && sound.isMusicOneReady && sound.isMusicTwoReady && woodScene.isReady) {
    cylinder = new THREE.Mesh(new THREE.CylinderGeometry(50, 50, 1, 50, 50, false), new THREE.MeshBasicMaterial({
      color: 0x000000
    }));
    cylinder.scale.x = cylinder.scale.y = cylinder.scale.z = 0.01;
    scene.add(woodScene);
    scene.add(cylinder);
    scene.add(santa.mesh);
    scene.add(snow.systemParticle);
    target = santa.mesh;
    sound.initAnalyser();
    sound.initScriptProcessorNode();
    sound.initSourceNode();
    sound.onChannelHit = function() {
      return poseInstructionGenerator.generateInstruction();
    };
    $('.startInstructions').addClass('loaded');
    $('.man').on('click', onStartButtonClick);
    $('.auto').on('click', onStartButtonClick);
  }
  return null;
};

onStartButtonClick = function(evt) {
  if ($(evt.currentTarget).hasClass('man')) {
    autoMode = false;
    cameraSpeed = .5;
    cameraRadius = 200;
  } else {
    autoMode = true;
    cameraSpeed = 2;
    cameraRadius = 400;
  }
  playIntro();
  $('.startInstructions').removeClass('show');
  poseInstructionGenerator.show(autoMode);
  sound.play(autoMode);
  return null;
};

playIntro = function() {
  TweenLite.to(camera.position, 5, {
    x: 8.433944074662788,
    y: 190.83546230112506,
    z: 515.1839583298332
  });
  TweenLite.to(camera.rotation, 5, {
    x: -0.35475103395861907,
    y: 0.015350179868538257,
    z: -0.022065570283709802
  });
  TweenLite.to(spotlight, 2, {
    intensity: 2,
    delay: .8
  });
  TweenLite.to(spotlight.position, 2, {
    y: 300,
    delay: .8
  });
  TweenLite.to(snow, 5, {
    opacity: 1,
    onUpdate: onPlayIntroUpdate
  });
  TweenLite.to(santa.mesh.position, 5, {
    y: 0,
    onUpdate: onPlayIntroUpdate,
    delay: 5
  });
  TweenLite.to(santa.mesh.rotation, 5, {
    y: NumberUtils.PI * 50,
    onUpdate: onPlayIntroUpdate,
    onComplete: onPlayIntroComplete,
    delay: 5
  });
  TweenLite.to(cylinder.scale, 1, {
    x: 1,
    y: 1,
    z: 1,
    delay: 3
  });
  return null;
};

onPlayIntroUpdate = function() {
  snow.systemMaterial.uniforms.opacity.value = snow.opacity;
  return null;
};

onPlayIntroComplete = function() {
  TweenLite.to(cylinder.scale, .6, {
    x: 0.01,
    y: 0.01,
    z: 0.01
  });
  introEnded = true;
  $('.startInstructions').hide();
  return null;
};

playEnd = function() {
  return null;
};

getElapsedTime = function() {
  delta = clock.getDelta();
  return clock.getElapsedTime() * .5;
};

update = function() {
  controls.update();
  camera.position.distanceTo(woodScene.mesh.position);
  snow.update(getElapsedTime());
  poseInstructionGenerator.update(getElapsedTime());
  santa.update();
  if (!target || !introEnded) {
    return;
  }
  camera.position.x = target.position.x + 400 * Math.cos(cameraSpeed * getElapsedTime());
  camera.position.z = target.position.z + 400 * Math.sin(cameraSpeed * getElapsedTime());
  camera.lookAt(target.position);
  return null;
};

render = function() {
  renderer.render(scene, camera);
  return null;
};

animate = function() {
  window.requestAnimationFrame(animate);
  update();
  render();
  guiControls.update();
  return null;
};

$(function() {
  var _this = this;
  init();
  return window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    return renderer.setSize(window.innerWidth, window.innerHeight);
  });
});
