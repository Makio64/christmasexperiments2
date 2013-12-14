var Tween = (function()
{

	var loop = new tools.Loop(update, this, false);
	var tweens = [];

	function add(tween)
	{
		if(tween.id != undefined) return;

		if(tween.override) manageOverride(tween);

		tween.id = tweens.length;
		tweens.push(tween);
		if(tweens.length == 1) loop.play();
	}

	function manageOverride(tween)
	{
		var n = tweens.length;
		for(var i = 0; i < n; i++)
		{
			var t = tweens[i];
			if(t.target != tween.target) continue;
			if(tween.override == 2)
			{
				remove(t);
				i--;
				n--;
				continue;
			}
			//tween.override == 1
			for(var prop in tween.to)
			{
				delete t.from[prop];
				delete t.to[prop];
			}
		}
	}

	function remove(tween)
	{
		if(tweens.length == 1) loop.pause();
		else
		{
			var tmp = tweens[tweens.length - 1];
			tmp.id = tween.id;
			tweens[tmp.id] = tmp;
		}
		tweens.length--;
		tween.id = null;
	}

	function update()
	{
		var n = tweens.length;
		for(var i = 0; i < n; i++)
		{
			var tween = tweens[i];
			if(!tween) continue;
			if(!tween.pauseBegin)
				tween._onUpdate();
		}
	}


	function Tween(target)
	{
		this.id = null;
		this.target = target;

		this.begin = this.end = 0;
		this.pauseBegin = 0;

		this.easingFunc = easings.quadOut;

		this.onStart = new tools.Signal();
		this.onPause = new tools.Signal();
		this.onResume = new tools.Signal();
		this.onUpdate = new tools.Signal();
		this.onComplete = new tools.Signal();

	}



	Tween.prototype = {

		start : function(duration, to, from, override)
		{
			this.duration = 1000 * duration;
			this.to = to || {};
			this.from = from || {};
			this.override = override == undefined ? 1 : override;
			for(var prop in this.to)
			{
				if(this.from[prop] == undefined)
					this.from[prop] = this.target[prop];
				if(isNaN(this.from[prop])) this.from[prop] = 0;
			}


			for(prop in this.from)
			{
				if(this.to[prop] == undefined)
					this.to[prop] = this.target[prop];
				this[prop] = this.from[prop];
			}

			this.begin = Date.now() + (this.delayTime || 0);
			this.delayTime = 0;
			this.pauseBegin = 0;
			add(this);
			this.onStart.dispatch();
			return this;
		},

		pause : function()
		{
			this.pauseBegin = Date.now();
			this.onPause.dispatch();
		},

		resume : function()
		{
			this.begin += Date.now() - this.pauseBegin;
			this.pauseBegin = 0;
			this.onResume.dispatch();
		},

		finish : function()
		{
			for(var prop in this.to)
				this.target[prop] = this.to[prop];
			this._onComplete();
		},

		delay : function(delay)
		{
			this.delayTime = 1000 * delay;
			return this;
		},

		easing : function(easingFunc)
		{
			this.easingFunc = easingFunc;
			return this
		},

		_onUpdate : function()
		{
			this.ratio = (Date.now() - this.begin) / this.duration;
			if(this.ratio < 0) return;
			else if(this.ratio >= 1)
			{
				this.finish();
				return;
			}
			var easing = this.easingFunc(this.ratio);
			for(var prop in this.to)
			{
				this.target[prop] = easing * (this.to[prop] - this.from[prop]) + this.from[prop];
			}
			this.onUpdate.dispatch();
		},

		_onComplete : function()
		{
			this.pauseBegin = 0;
			remove(this);
			this.onUpdate.dispatch();
			this.onComplete.dispatch();
		}
	}
	return Tween;
})();

//Robert Penner :
//http://www.robertpenner.com/
//http://www.robertpenner.com/easing/

//Philippe Elsass : 
//http://philippe.elsass.me
//https://code.google.com/p/eaze-tween/source/browse/trunk/as3/src/#src%2Faze%2Fmotion%2Feasing%253Fstate%253Dclosed
var easings = {

	none : function (k) { return k; },


	quartIn : function (k) { return k * k * k * k; },

	quartOut : function (k)
	{
		return -(--k * k * k * k - 1);
	},

	quartInOut : function (k) 
	{
		if ((k *= 2) < 1) return 0.5 * k * k * k * k;
		return -0.5 * ((k -= 2) * k * k * k - 2);
	},

	
	quadIn : function(k) { return k * k; },

	quadOut : function(k) { return -k * (k - 2); },

	quadInOut : function (k) 
	{
		if ((k *= 2) < 1) return 0.5 * k * k;
		return -0.5 * (--k * (k - 2) - 1);
	},

	
	expoIn : function (k) 
	{
		return k == 0 ? 0 : Math.pow(2, 10 * (k - 1));
	},

	expoOut : function (k) 
	{
		return k == 1 ? 1 : -Math.pow(2, -10 * k) + 1;
	},

	expoInOut : function (k) 
	{
		if (k == 0) return 0;
		if (k == 1) return 1;
		if ((k *= 2) < 1) return 0.5 * Math.pow(2, 10 * (k - 1));
		return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
	}
}



/*
new Tween(target, duration, to, [from, easingFunc])
start([delay]);

var myTween = new Tween(obj, 0.5, {x:5, y:10}, {x:0, y:0}, easings.quartIn).start(0.5);
myTween.stop();
myTween.onStart.add(_onCompelete, this);
myTween.onComplete.add(_onCompelete, this);
myTween.onUpdate.add(_onUpdate, this);


new Tween(target).delay(0.5)
				 .start(0.3, {x:5, y:10}, {x:0, y:0}, 0)
				 .easing(easings.quartIn);
*/
