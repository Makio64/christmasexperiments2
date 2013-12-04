var Ennemy = (function(){

	function Ennemy() {
		PIXI.DisplayObjectContainer.call(this);
		this.spawnPosition = new PIXI.Point();
	}

	Ennemy.prototype = new PIXI.DisplayObjectContainer();


	Ennemy.prototype.init = function(textures, life, w, h) {
		PIXI.DisplayObjectContainer.call(this);

		this.animClip = new PIXI.MovieClip(textures);
		this.addChild(this.animClip);
		this.animClip.gotoAndPlay(Math.random() * textures.length);
		this.animClip.animationSpeed = 0.1;

		this.life = life;
		this.hitArea = new PIXI.Rectangle(this.width * 0.5 - w * 0.5, this.height * 0.5 - h * 0.5, w, h);
	}

	Ennemy.prototype.kill = function() {
		this.parent.removeChild(this);
	};

	Ennemy.prototype.hit = function() {
		this.life--;
		if(this.life <= 0) this.kill();
	};

	Ennemy.prototype.spawn = function(x, y) {
		this.spawnPosition.x = x;
		this.spawnPosition.y = y;
		TweenMax.to(this.position, 1, {x: this.spawnPosition.x, y: this.spawnPosition.y, ease: Expo.easeInOut});
	};

	return Ennemy;
})();