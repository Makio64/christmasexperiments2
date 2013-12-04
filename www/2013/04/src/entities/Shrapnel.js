var Shrapnel = (function(){

	function Shrapnel() {
		Particle.call(this);

		this.abstract.setSize.call(this, 8, 8);
		this.abstract.setHitArea.call(this, 0, 0, this.width, this.height);

		this.addChild(new PIXI.Sprite(PIXI.Texture.fromFrame("shrapnel.png")));

		this.speed = 10;
		this.angle = Math.PI * 0.5;

		this.isReady = false;
	}

	Shrapnel.prototype = new Particle();
	Shrapnel.prototype.constructor = Shrapnel;
	Shrapnel.prototype.abstract = Particle.prototype;

	Shrapnel.prototype.spawn = function(spawnZone) {
		this.spawnZone = spawnZone;
		this.position.x = spawnZone.x + spawnZone.width * Math.random();
		this.position.y = spawnZone.y + spawnZone.height * Math.random();

		this.abstract.spawn.call(this);
	};

	Shrapnel.prototype.kill = function() {
		TweenMax.killTweensOf(this.position);
		this.abstract.kill.call(this);
	};

	Shrapnel.prototype.onSpawned = function() {
		this.isReady = true;
	};

	Shrapnel.prototype.update = function() {
		if(!this.isReady) return
		this.abstract.update.call(this);
	};

	return Shrapnel;
})();