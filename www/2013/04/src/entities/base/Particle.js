var Particle = (function(){

	function Particle() {
		PIXI.DisplayObjectContainer.call(this);
		this.speed = 1;
		this.angle = 0;
		this.isAlive = false;
	}

	Particle.prototype = new PIXI.DisplayObjectContainer();

	Particle.prototype.setSize = function(width, height) {
		this.width = width;
		this.height = height;
	}

	Particle.prototype.setHitArea = function(x, y, width, height) {
		this.hitArea = new PIXI.Rectangle(x, y, width, height);
	};


	Particle.prototype.spawn = function(params) {
		this.isAlive = true;
	};

	Particle.prototype.kill = function() {
		this.parent.removeChild(this);
		this.isAlive = false;
	};

	Particle.prototype.hitTest = function(displayObject) {
		var pa = this.position;
		var a = this.hitArea;
		var pb = displayObject.position;
		var b = displayObject.hitArea;
		return !(pa.x + a.x > pb.x + b.x + b.width || pa.x + a.x + a.width < pb.x + b.x || pa.y + a.y > pb.y + b.y + b.height || pa.y + a.y + a.height < pb.y + b.y);
	};

	Particle.prototype.update = function() {
		this.position.y += Math.sin(this.angle) * this.speed;
		this.position.x += Math.cos(this.angle) * this.speed;
	};

	return Particle;
})();