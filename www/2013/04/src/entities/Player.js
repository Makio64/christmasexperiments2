var Player = (function(){

	function Player() {
		PIXI.DisplayObjectContainer.call(this);

		this.speed = 0;

		this.snowFlakes = new Pool(SnowFlake, 200);
		var snowFlake;
		var config = {
			origin: new PIXI.Point(100, 140),
			maxAngle: Math.PI * 0.5,
			angleOffset: Math.PI * 0.8
		}
		for(var i = 0; i < 100; i++) {
			snowFlake = this.snowFlakes.getEntity(config);
			this.addChildAt(snowFlake, 0);
		}

		config.origin = new PIXI.Point(210, 140);
		config.angleOffset = -Math.PI * 0.3

		for(i = 0; i < 100; i++) {
			snowFlake = this.snowFlakes.getEntity(config);
			this.addChildAt(snowFlake, 0);
		}

		var tBody = PIXI.Texture.fromFrame("snowman-body.png");
		var tHead = PIXI.Texture.fromFrame("snowman-head.png");
		var tArm = PIXI.Texture.fromFrame("snowman-arm.png");

		this.sBody = new PIXI.Sprite(tBody);
		this.addChild(this.sBody);
		this.sBody.position.x = 67;
		this.sBody.position.y = 27;

		this.sArmLeft = new PIXI.Sprite(tArm);
		this.addChild(this.sArmLeft);
		this.sArmLeft.position.y = 88;
		this.sArmLeft.position.x = 92;
		this.sArmLeft.pivot.x = 92;
		this.sArmLeft.pivot.y = 60;

		this.sArmRight = new PIXI.Sprite(tArm);
		this.addChild(this.sArmRight);

		this.sArmRight.pivot.x = 92;
		this.sArmRight.pivot.y = 60;
		this.sArmRight.position.x = 223;
		this.sArmRight.position.y = 88;
		this.sArmRight.scale.x = -1;

		this.sHead = new PIXI.Sprite(tHead);
		this.addChild(this.sHead);
		this.sHead.position.x = 103;
		this.sHead.position.y = -8;

		this.tlShoot = new TimelineMax();
		this.tlShoot.insert(TweenMax.fromTo(this.sArmLeft, 0.4, {rotation: Math.PI * 0.3}, {rotation: 0}), 0);
		this.tlShoot.insert(TweenMax.fromTo(this.sArmRight, 0.4, {rotation: -Math.PI * 0.3}, {rotation: 0}), 0);
		this.tlShoot.gotoAndStop(this.tlShoot.duration());

		this.tlJump = new TimelineMax();
		this.tlJump.insert(TweenMax.fromTo(this.sArmLeft, 0.2, {rotation: 0 }, {rotation: Math.PI * 0.3}), 0);
		this.tlJump.insert(TweenMax.fromTo(this.sArmRight, 0.2, {rotation: 0}, {rotation: -Math.PI * 0.3}), 0);
		this.tlJump.insert(TweenMax.to(this.sArmLeft, 0.4, {rotation: 0}), 0.2);
		this.tlJump.insert(TweenMax.to(this.sArmRight, 0.4, {rotation: 0}), 0.2);
		this.tlJump.insert(TweenMax.fromTo(this.sHead.position, 0.2, {y: -8}, {y: -30}), 0);
		this.tlJump.insert(TweenMax.fromTo(this.sHead.position, 0.4, {y: -30}, {y: -8}), 0.2);
		this.tlJump.gotoAndStop(0);

		this.width = 316;
		this.height = 160;

		var w = 15;
		var h = 34;

		this.hitArea = new PIXI.Rectangle(103 + 108 * 0.5 - w * 0.5, 0, w, h);

		this.colorMatrix = [1,0,0,0,
						0,1,0,0,
						0,0,1,0,
						0,0,0,1];


		this.colorFilter = new PIXI.ColorMatrixFilter();
		this.sHead.filters = [this.colorFilter];
		this.sBody.filters = [this.colorFilter];


		this.colorMatrixTween = {
			a: 1, b: 0, c: 0, d: 0,
			e: 0, f: 1, g: 0, h: 0,
			i: 0, j: 0, k: 1, l: 0,
			m: 0, n: 0, o: 0, p: 1
		};

	}

	Player.prototype = new PIXI.DisplayObjectContainer();

	Player.prototype.updateSnowFlake = function(snowFlake) {
		snowFlake.update();
		if(snowFlake.lifeSpan <= 0) {
			this.snowFlakes.killEntity(snowFlake);
			this.addChildAt(this.snowFlakes.getEntity(), 0);
		}
	};

	Player.prototype.hit = function() {
		TweenMax.fromTo(this.sHead.position, 0.8, {y: 20}, {y: -8});
		TweenMax.fromTo(this.colorMatrixTween, 0.5, {b: 0.5, c: 0.5, f: 0.5, k: 0.5}, {b: 0, c: 0, f: 1, k: 1, onUpdate: this.updateColors, onUpdateScope: this});
	};

	Player.prototype.updateColors = function() {
		this.colorMatrix[1] = this.colorMatrixTween.b;
		this.colorMatrix[2] = this.colorMatrixTween.c;
		this.colorMatrix[5] = this.colorMatrixTween.f;
		this.colorMatrix[10] = this.colorMatrixTween.k;
		this.colorFilter.matrix = this.colorMatrix;
	};

	Player.prototype.updateParticles = function(time) {
		this.snowFlakes.each(this.updateSnowFlake.bind(this));


		this.sHead.position.x = Math.cos(time) * 8 + 103;
	};

	Player.prototype.update = function(time, mouseX) {
		this.speed = ((mouseX - this.width * 0.5) - this.position.x) * 0.1;
		this.position.x += this.speed;

		this.hitArea.x = this.sHead.position.x + 108 * 0.5 - this.hitArea.width * 0.5;

		this.updateParticles(time);
	};

	Player.prototype.shoot = function() {
		this.tlShoot.gotoAndPlay(0);
	};

	Player.prototype.jump = function() {
		this.tlJump.gotoAndPlay(0);
	};

	return Player;
})();