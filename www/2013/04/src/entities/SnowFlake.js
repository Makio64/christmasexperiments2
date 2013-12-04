var SnowFlake = (function(){

	function SnowFlake() {
		Particle.call(this);

		this.abstract.setSize.call(this, Math.random() * 3 + 1, Math.random() * 3 + 1);

		var graphics = new PIXI.Graphics();
		graphics.lineStyle(0);
		graphics.beginFill(0x71b4ca, 1);
		graphics.drawCircle(this.width, this.width, this.width);
		graphics.drawRect(0, 0, this.width, this.width);

		this.addChild(graphics);
	}

	SnowFlake.prototype = new Particle();
	SnowFlake.prototype.constructor = SnowFlake;
	SnowFlake.prototype.abstract = Particle.prototype;

	SnowFlake.prototype.spawn = function(config) {
		if(config) {
			this.origin = config.origin;
			this.maxAngle = config.maxAngle;
			this.angleOffset = config.angleOffset;
		}

		this.position = this.origin.clone();
		this.lifeSpan = Math.random() * 100 + 50;
		this.speed = Math.random() * 3 + 2;
		this.angle = Math.random() * this.maxAngle + this.angleOffset;

		this.abstract.spawn.call(this);
	};

	SnowFlake.prototype.update = function() {
		this.lifeSpan -= this.speed;
		this.abstract.update.call(this);
	};

	return SnowFlake;
})();