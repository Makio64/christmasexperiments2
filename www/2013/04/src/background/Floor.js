var Floor = (function(){

	function Floor(width, height) {
		PIXI.DisplayObjectContainer.call(this);

		this.floorTexture = PIXI.Texture.fromImage('img/floor.png');

		this.resize(width, height);
	}

	Floor.prototype = new PIXI.DisplayObjectContainer();

	Floor.prototype.resize = function(width, height) {
		if(this.floor) this.removeChild(this.floor);

		this.floor = new PIXI.TilingSprite(this.floorTexture, width, height);
		this.addChild(this.floor);

		// dirty trick to be able to render a Filter on top of a TilingSprite
		// I don't know why it does not work otherwise
		if(this.filingSprite) this.removeChild(this.filingSprite);
		this.filingSprite = new PIXI.Sprite(PIXI.Texture.fromImage("img/void.png"));
		this.addChild(this.filingSprite);
		this.filingSprite.width = width;
		this.filingSprite.height = height;
	};

	Floor.prototype.update = function() {
		this.floor.tilePosition.y += 10;
		if(this.floor.tilePosition.y > 100000) this.floor.tilePosition.y = 0;
	};

	return Floor;
})();