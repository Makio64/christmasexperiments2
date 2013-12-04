var Dialog = (function(){

	function Dialog(texts) {
		PIXI.DisplayObjectContainer.call(this);

		this.texts = texts;
		this.currentBubble = -1;
		this.nbTexts = this.texts.length;

		this.dialogCompletedSignal = new signals.Signal();

		this.showNextBubble();
	}

	Dialog.prototype = new PIXI.DisplayObjectContainer();

	Dialog.prototype.start = function() {
	
	};

	Dialog.prototype.onClick = function() {
		if(this.bubble) this.bubble.onClick();
	};

	Dialog.prototype.onBubbleComplete = function() {
		if(this.bubble) this.removeChild(this.bubble);
		TweenMax.delayedCall(0.3, this.showNextBubble, null, this);
	};

	Dialog.prototype.showNextBubble = function() {
		this.currentBubble++;
		if(this.currentBubble < this.nbTexts) {
			this.bubble = new TextBubble(this.texts[this.currentBubble].t);
			this.addChild(this.bubble);
			this.bubble.completedSignal.addOnce(this.onBubbleComplete.bind(this));
		}
		else {
			this.dialogCompletedSignal.dispatch();
		}

	};

	return Dialog;
})();