var Scores = (function(){

	function Scores(width) {
		this.totalTime = 0;
		this.damage = 0;
		this.totalScore = 0;
	}

	Scores.prototype = new PIXI.DisplayObjectContainer();

	Scores.prototype.startTime = function() {
		this.startTime = new Date();
	};

	Scores.prototype.stopTime = function() {
		this.endTime = new Date();
		this.totalTime = (this.endTime - this.startTime);
	};

	Scores.prototype.getTotalScore = function() {
		this.totalScore = 1000000 - this.totalTime * 5 - this.damage * 10000;
		this.totalScore = this.totalScore < 0 ? 0 : this.totalScore;
		return this.totalScore;
	};

	return Scores;
})();