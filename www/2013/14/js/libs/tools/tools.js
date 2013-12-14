var tools = function ()
{
	if(!Function.prototype.bind)
	{
		Function.prototype.bind(scope)
		{
			if(!method) throw new Error("no method specified");
			var args = Array.prototype.slice.call(arguments, 2);
			return function()
				{
					var params = Array.prototype.slice.call(arguments);
					method.apply(scope, params.concat(args));
				}
		}
	}

	function mixin(from, to) { for(var k in from) to[k] = from[k]; }
	
	
	function Signal(){ this.listeners = []; }
	
	Signal.prototype = {
	
		add : function(callback, scope)
		{
			if(!callback) throw new Error("no callback specified");
			var args = Array.prototype.slice.call(arguments, 2);
			var n = this.listeners.length;
			for(var i = 0; i < n; i++)
			{
				var listener = this.listeners[i];
				if(listener.callback == callback && listener.scope == scope)
				{
					listener.args = args;
					return;
				}
			}
			this.listeners.push({callback:callback, scope:scope, args:args});
		},
		
		remove : function(callback, scope)
		{
			var n = this.listeners.length;
			for(var i = 0; i < n; i++)
			{
				var listener = this.listeners[i];
				if(listener.callback == callback && listener.scope == scope)
				{
					this.listeners.splice(i, 1);
					return;
				}
			}
		},
		
		dispatch : function()
		{
			var args = Array.prototype.slice.call(arguments);
			var n = this.listeners.length;
			for(var i = 0; i < n; i++)
			{
				var listener = this.listeners[i];
				listener.callback.apply(listener.scope, args.concat(listener.args));
			}
		},
		
		dispose : function() { this.listeners = []; }
	}
	
	
	
	var requestAnimationFrame = window.requestAnimationFrame || 
								window.mozRequestAnimationFrame ||
								window.webkitRequestAnimationFrame || 
								window.msRequestAnimationFrame || 
								function(fn){return setTimeout(fn, 50/3)};
	window.requestAnimationFrame = requestAnimationFrame;
	
	var cancelAnimationFrame = window.cancelAnimationFrame || 
							   window.mozCancelAnimationFrame || 
							   window.webkitCancelAnimationFrame || 
							   function(id){clearTimeout(id);};




	function Stage(w, h, addToBody)
	{
		this.canvas = document.createElement("canvas");
		if(addToBody || addToBody == undefined)
			document.body.appendChild(this.canvas);
		this.out = this.canvas.getContext("2d");
		this.resize(w, h);
		this.onResize = new Signal();
	}
	
	Stage.prototype = {
		
		resize : function(w, h)
		{
			this.canvas.width = this.out.width = this.width = w;
			this.canvas.height = this.out.height = this.height = h;
		},
	
		autoSize : function(callback, scope)
		{
			if(callback) this.onResize.add(callback, scope);
			window.onresize = this._onResize.bind(this);
			this._onResize();
		},
	
		_onResize : function()
		{
			this.resize(window.innerWidth || document.body.clientWidth,
						 window.innerHeight || document.body.clientHeight);
			this.onResize.dispatch();
		},
		
		clear : function()
		{
			//this.out.clearRect(0, 0, this.width, this.height);
			this.canvas.width = this.canvas.width;
		}
	}
	
	
	
	
	
	function Loop(callback, scope, autoPlay)
	{
		this.onUpdate = new Signal();
		if(callback)
		{
			this.onUpdate.add(callback, scope);
			if(autoPlay || autoPlay == undefined)
				this.play();
		}
	}

	Loop.prototype = {
	
		isPaused : true,

		play : function()
		{
			if(!this.isPaused) return;
			this.isPaused = false;
			this._onUpdate();
		},

		_onUpdate : function()
		{
			//can cause the loop to be paused
			this.onUpdate.dispatch();
			if(!this.isPaused)
				this._requestFrame = requestAnimationFrame(this._onUpdate.bind(this));
		},

		pause : function()
		{
			this.isPaused = true;
			cancelAnimationFrame(this._requestFrame);
		},
		
		dispose : function()
		{
			this.onUpdate.dispose();
			pause();
		}
	}





	function Mouse(target)
	{
		this.x = this.y = 0;
		this.oldX = this.oldY = 0;
		this.isDown = false;
		this.target = target || document;
		
		this.onDown = new Signal();
		this.onUp = new Signal();
		this.onMove = new Signal();
	
		this._moveBind = this._onMouseMove.bind(this);
		this._downBind = this._onMouseDown.bind(this);
		this._upBind = this._onMouseUp.bind(this);
		this.target.onmousemove = this._moveBind;
		this.target.onmousedown = this._downBind;
		this.target.onmouseup = this._upBind;
	}

	Mouse.prototype = {
	
		_onMouseMove : function(e)
		{
			var ev = e || window.event;//Moz:IE
			if (ev.pageX)
			{
				//Mozilla or compatible
				this.x = ev.pageX;
				this.y = ev.pageY;
			}
			else if(ev.clientX)
			{
				//IE or compatible
				this.x = ev.clientX;
				this.y = ev.clientY
			}
			this.x -= this.target.offsetLeft 
			this.y -= this.target.offsetTop

			//synchronization problems with main loop
			//this.savePos();
			this.onMove.dispatch();
		},

		_onMouseDown : function(e)
		{
			this.isDown = true;
			this.savePos();
			this.onDown.dispatch();
		},

		_onMouseUp : function(e)
		{
			this.isDown = false;
			this.savePos();
			this.onUp.dispatch();
		},

		savePos : function()
		{
			this.oldX = this.x;
			this.oldY = this.y;
		},
		
		point : function(pt)
		{
			pt = pt || {};
			pt.x = this.x;
			pt.y = this.y;
			return pt;
		},

		showHand : function()
		{
			this.target.style.cursor = "hand";
		},

		hideHand : function()
		{
			this.target.style.cursor = "default";
		},
		
		dispose : function()
		{
			this.onDown.dispose();
			this.onUp.dispose();
			this.onMove.dispose();

			if(this.target.onmousemove == this._moveBind)
				this.target.onmousemove = null;
			if(this.target.onmousedown == this._downBind)
				this.target.onmousedown = null;
			if(this.target.onmouseup == this._upBind)
				this.target.onmouseup = null;
		}
	}






	function Keyboard()
	{
		this._keys = {};
		this._preventDefaultKeys = [];
		this.onDown = new Signal();
		this.onUp = new Signal();
		this._downBind = this._onKeyDown.bind(this);
		this._upBind = this._onKeyUp.bind(this);
		document.addEventListener("keydown", this._downBind);
		document.addEventListener("keyup", this._upBind);
	}

	Keyboard.prototype = {

		_onKeyDown : function(e)
		{
			e = e || window.event;
			this._doPreventDefault(e);
			this._keys[e.keyCode] = true;
			this._call(this.onDown, e.keyCode);
		},

		_onKeyUp : function(e)
		{
			e = e || window.event;
			this._doPreventDefault(e);
			this._keys[e.keyCode] = false;
			this._call(this.onUp, e.keyCode);
		},
		
		_call : function(signal, keyCode)
		{
			var listeners = signal.listeners;
			var n = listeners.length;
			for(var i = 0; i < n; i++)
			{
				var listener = listeners[i];
				if(!listener.args[0])
					listener.callback.apply(listener.scope, [keyCode].concat(listener.args));
				else if(listener.args[0] == keyCode)
					listener.callback.apply(listener.scope, listener.args);
			}
		},

		isDown : function(key) { return this._keys[key] || false; },
		
		dispose : function()
		{	
			this.onDown.dispose();
			this.onUp.dispose();
			document.removeEventListener("keydown", this._downBind);
			document.removeEventListener("keyup", this._upCallBind);
		},

		preventDefault : function(keys)
		{
			if(keys) this._preventDefaultKeys = this._preventDefaultKeys.concat(keys);
			else this._preventDefaultKeys = [-1];
		},

		_doPreventDefault : function(e)
		{
			var k = this._preventDefaultKeys;
			if(k.indexOf(e.keyCode) != -1 || k[0] == -1)
				e.preventDefault();
		}
	}

	return {
			Stage:Stage,
			Mouse:Mouse,
			Keyboard:Keyboard,
			Loop:Loop,
			Signal:Signal,
			mixin:mixin
		};
}();

/*
var stage = new tools.Stage(800, 600);
var loop = new Loop(onUpdate, this);
loop.pause();
stage.width;
stage.height;
stage.out;


var mouse = new tools.Mouse(stage.canvas);
mouse.x
mouse.y
mouse.isDown
mouse.onDown.add(onMouseDown, this);
mouse.onUp.add(onMouseUp, this);

var keyboard = new tools.Keyboard();
keyboard.onDown.add(onDown, this);
keyboard.onUp.add(onKeyUp, this);
keyboard.onUp.add(onKey32Up, this, 32);
keyboard.isDown(33);


*/
