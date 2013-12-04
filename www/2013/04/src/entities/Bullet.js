var Bullet = (function(){

	function Bullet() {
		Particle.call(this);

		this.abstract.setSize.call(this, 28, 28);
		this.abstract.setHitArea.call(this, 0, 0, this.width, this.height);

		this.addChild(new PIXI.Sprite(PIXI.Texture.fromFrame("bullet.png")));

		this.speed = 10;
		this.angle = -Math.PI * 0.5;
	}

	Bullet.prototype = new Particle();
	Bullet.prototype.constructor = Bullet;
	Bullet.prototype.abstract = Particle.prototype;

	return Bullet;
})();