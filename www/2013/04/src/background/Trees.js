var Trees = (function(){

	function Trees(width, height) {
		PIXI.DisplayObjectContainer.call(this);

		this.treeTexture = PIXI.Texture.fromImage("img/trees.png");

		this.resize(width, height);
	}

	Trees.prototype = new PIXI.DisplayObjectContainer();

	Trees.prototype.resize = function(width, height) {
		if(this.treeLeft) this.removeChild(this.treeLeft);
		if(this.treeRight) this.removeChild(this.treeRight);

		this.treeLeft = new PIXI.TilingSprite(this.treeTexture, 256, height);
		this.addChild(this.treeLeft);

		this.treeRight = new PIXI.TilingSprite(this.treeTexture, 256, height);
		this.addChild(this.treeRight);
		this.treeRight.rotation = Math.PI;
		this.treeRight.position.x = width;
		this.treeRight.position.y = height;

		// dirty trick to be able to render a Filter on top of a TilingSprite
		// I don't know why it does not work otherwise
		this.filingSprite = new PIXI.Sprite(PIXI.Texture.fromImage("img/void.png"));
		this.addChild(this.filingSprite);
		this.filingSprite.width = width;
		this.filingSprite.height = height;


	};

	Trees.prototype.update = function() {
		this.treeLeft.tilePosition.y += 10;
		this.treeRight.tilePosition.y -= 10;
	};

	return Trees;
})();