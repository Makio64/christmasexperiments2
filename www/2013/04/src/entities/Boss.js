var Boss = (function(){

	function Boss() {
		Ennemy.call(this);

		var scale = 2;
		this.width = 128 * scale;
		this.height = 152 * scale;

		var textures = [];

		textures.push(PIXI.Texture.fromFrame("boss-0.png"));
		textures.push(PIXI.Texture.fromFrame("boss-1.png"));
		textures.push(PIXI.Texture.fromFrame("boss-0.png"));
		textures.push(PIXI.Texture.fromFrame("boss-1.png"));
		textures.push(PIXI.Texture.fromFrame("boss-0.png"));
		textures.push(PIXI.Texture.fromFrame("boss-0.png"));
		textures.push(PIXI.Texture.fromFrame("boss-0.png"));
		textures.push(PIXI.Texture.fromFrame("boss-0.png"));

		this.abstract.init.call(this, textures, 100, this.width * 0.9, this.height * 0.9);

		this.animClip.scale.x = this.animClip.scale.y = scale;
		this.colorMatrix = [1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,0,1];

		this.colorFilter = new PIXI.ColorMatrixFilter();
		this.animClip.filters = [this.colorFilter];
		this.colorMatrixTween = {
		a: 1, b: 0, c: 0, d: 0,
		e: 0, f: 1, g: 0, h: 0,
		i: 0, j: 0, k: 1, l: 0,
		m: 0, n: 0, o: 0, p: 1
		};
	}

	Boss.prototype = new Ennemy();
	Boss.prototype.constructor = Boss;
	Boss.prototype.abstract = Ennemy.prototype;

	Boss.prototype.hit = function() {
		this.abstract.hit.call(this);
		TweenMax.fromTo(this.colorMatrixTween, 0.2, {b: 0.5, c: 0.5, f: 0.5, k: 0.5}, {b: 0, c: 0, f: 1, k: 1, onUpdate: this.updateColors, onUpdateScope: this});
		TweenMax.fromTo(this.position, 0.2, {y: this.spawnPosition.y - 20}, {y: this.spawnPosition.y});
	};

	Boss.prototype.updateColors = function() {
		this.colorMatrix[1] = this.colorMatrixTween.b;
		this.colorMatrix[2] = this.colorMatrixTween.c;
		this.colorMatrix[5] = this.colorMatrixTween.f;
		this.colorMatrix[10] = this.colorMatrixTween.k;
		this.colorFilter.matrix = this.colorMatrix;
	};

	Boss.prototype.update = function() {
	
	};

	return Boss;
})();