var Gingerbread = (function(){

	function Gingerbread() {
		Ennemy.call(this);

		this.width = 68;
		this.height = 92;

		var textures = [];

		for (var i=0; i < 3; i++) {
		textures.push(PIXI.Texture.fromFrame("gingerbread-man-" + (i) + ".png"));
		};

		this.abstract.init.call(this, textures, 1, 40, 40);
	}


	Gingerbread.prototype = new Ennemy();
	Gingerbread.prototype.constructor = Gingerbread;
	Gingerbread.prototype.abstract = Ennemy.prototype;

	Gingerbread.prototype.update = function() {

	};

	return Gingerbread;
})();