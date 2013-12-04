var ScoresDisplay = (function(){

	function ScoresDisplay(width, damage, time, score) {
     	PIXI.DisplayObjectContainer.call(this);

		this.textFieldTitle = new PIXI.Text("THE END", {font: "60px 'Press Start 2P'", fill: "#2c8ad2", align: "center", stroke: "white", strokeThickness: 10});
		this.addChild(this.textFieldTitle);
		this.textFieldTitle.position.x = width * 0.5 - this.textFieldTitle.width * 0.5;

		var damageText = "Damage " + damage;
		this.textFieldDamage = new PIXI.Text(damageText,  {font: "14px 'Press Start 2P'", fill: "#000000", align: "center", stroke: "white", strokeThickness: 4});
		this.addChild(this.textFieldDamage);
		this.textFieldDamage.position.x = width * 0.5 - this.textFieldDamage.width * 0.5;
		this.textFieldDamage.position.y = this.textFieldTitle.position.y + this.textFieldTitle.height + 50;

		var textTime = "Time " + time;
		this.textFieldTime = new PIXI.Text(textTime,  {font: "14px 'Press Start 2P'", fill: "#000000", align: "center", stroke: "white", strokeThickness: 4});
		this.addChild(this.textFieldTime);
		this.textFieldTime.position.x = width * 0.5 - this.textFieldTime.width * 0.5;
		this.textFieldTime.position.y = this.textFieldDamage.position.y + this.textFieldDamage.height + 12;

		var textScore = "Total Score " + score;
		this.textFieldScore = new PIXI.Text(textScore,  {font: "14px 'Press Start 2P'", fill: "#000000", align: "center", stroke: "white", strokeThickness: 4});
		this.addChild(this.textFieldScore);
		this.textFieldScore.position.x = width * 0.5 - this.textFieldScore.width * 0.5;
		this.textFieldScore.position.y = this.textFieldTime.position.y + this.textFieldTime.height + 12;

		this.height = this.textFieldScore.position.y + this.textFieldScore.height;
	}

    	ScoresDisplay.prototype = new PIXI.DisplayObjectContainer();

	return ScoresDisplay;
})();