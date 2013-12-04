var TextBubble = (function(){

	function TextBubble(text) {
     	PIXI.DisplayObjectContainer.call(this);

     	this.text = text;
     	this.textLength = this.text.length;
     	this.currentChar = 0;
     	this.isComplete = false;

		this.textField = new PIXI.Text(text, {font: "11px 'Press Start 2P'", fill: "#FFFFFF", align: "center"});
		this.textField.position.x = 10;
		this.textField.position.y = 10;
		this.addChild(this.textField);

		this.background = new PIXI.Graphics();
		this.background.lineStyle(0);
		this.background.beginFill(0x000000, 1);
		this.background.drawRect(0, 0, this.textField.width + 20, this.textField.height + 20);
		this.background.drawRect(-4, 4, this.textField.width + 28, this.textField.height + 12);
		this.background.drawRect(8, -4, this.textField.width + 4, this.textField.height + 28);
		this.addChildAt(this.background, 0);

		this.pointy = new PIXI.Graphics();
		this.pointy.lineStyle(0);
		this.pointy.beginFill(0x000000, 1);
		this.pointy.moveTo(10, 0);
		this.pointy.lineTo(0, 20);
		this.pointy.lineTo(30, 0);
		this.pointy.lineTo(10, 0);
		this.pointy.position.x = 20;
		this.pointy.position.y = this.textField.height + 24;
		this.addChild(this.pointy);

		this.completedSignal = new signals.Signal();

		this.start();
	}

    	TextBubble.prototype = new PIXI.DisplayObjectContainer();

	TextBubble.prototype.start = function() {
		this.setNextChar();
	};

	TextBubble.prototype.onClick = function() {
		TweenMax.killDelayedCallsTo(this.setNextChar);
		TweenMax.killDelayedCallsTo(this.kill);
		if(this.isComplete) {
			this.kill();
		}
		else {
			this.currentChar = this.textLength - 1;
			this.setNextChar();
		}
	};

	TextBubble.prototype.kill = function() {
		TweenMax.killDelayedCallsTo(this.setNextChar);
		TweenMax.killDelayedCallsTo(this.kill);
		this.completedSignal.dispatch();
	};

	TextBubble.prototype.setText = function(text) {
		this.text = text;
     	this.textLength = this.text.length;
     	this.currentChar = 0;
     	this.isComplete = false;

     	this.start();
	};

	TextBubble.prototype.setNextChar = function() {
		// body...
		this.currentChar++;
		if(this.currentChar < (this.textLength)) {
			TweenMax.delayedCall(0.04, this.setNextChar, null, this);
		}
		else {
			this.isComplete = true;
			TweenMax.delayedCall(1, this.kill, null, this);
		}
		this.textField.setText(this.text.substr(0, this.currentChar));
	};


	return TextBubble;
})();