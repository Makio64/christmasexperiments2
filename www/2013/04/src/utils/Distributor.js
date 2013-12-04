var Point = function(x, y) {
	this.x = x;
	this.y = y;
};

var Distributor = (function(){

	/* ===================================================
		CONSTRUCTOR
	=================================================== */
	function Distributor() {
		this.cellSize;
		this.minDistSquare;
		this.samplePoints;
	}

	Distributor.prototype.getMax = function(zoneWidth, zoneHeight, distance, count) {
		var max = (zoneWidth / distance) * (zoneHeight / distance);
		if(count > max * 0.5) count = max  * 0.5;
		return count;
	};

	Distributor.prototype.distribute = function(zoneWidth, zoneHeight, distance, count) {
		this.minDistSquare = distance * distance;
		count = this.getMax(zoneWidth, zoneHeight, distance, count);
		var p = new Point(zoneWidth * 0.5, zoneHeight * 0.5);
		var np;

		this.samplePoints = [p];

		while(this.samplePoints.length < count) {
			np = new Point(Math.random() * zoneWidth, Math.random() * zoneHeight);
			if(!this.isAround(this.samplePoints, np)) {
				this.samplePoints.push(np);
			}
		}

		return this.samplePoints;
	};

	Distributor.prototype.isAround = function(points, point) {
		var p;
		var dx, dy;
		for(var i = 0, l = points.length; i < l; i++) {
			p = points[i];
			dx = point.x - p.x;
			dy = point.y - p.y;
			if((dx * dx + dy * dy) < this.minDistSquare) return true;
		}
		return false;
	};

	return Distributor;
})();