var WebAudio = (function() {

	var webaudio = {};

	var context;
	var soundLib = {};

	this.available = false;

	webaudio.init = function() {

		if (typeof AudioContext !== "undefined") {
		    context = new AudioContext();
		} else if (typeof webkitAudioContext !== "undefined") {
		    context = new webkitAudioContext();
		} else {
		    console.log("WebAudio not available. :'(");
		    this.available = false;
		    return;
		}

		context.listener.setPosition(0, 0, 0);
		this.available = true;

		this.master = context.createGain();
		this.master.connect(context.destination);

	}

	webaudio.loadSound = function ( url, callback, mono ) {
		var isMono = mono || false;
		var callbackFunction = callback || null;

		var fileName = url.match(/[-_\w]+[.][\w]+$/i)[0];
		var name = fileName.substr(0, fileName.lastIndexOf("."));

		var request = new XMLHttpRequest();
		request.open("GET", url, true);
		request.responseType = "arraybuffer";
		 
		// async callback
		request.onload = function() {
		    context.decodeAudioData(request.response, function onSuccess(decodedBuffer) {
				soundLib[name] = {buffer: decodedBuffer};
				if (callbackFunction !== null) {
					callbackFunction(name);
				}

			}, function onFailure() {
				//console.log("Decoding the audio buffer failed");
			}); 

		}

		request.send();		
	}

	webaudio.startSound = function( parameters ) {

		if (!this.available) return;

		var name = parameters.name || undefined;
		var loop = parameters.loop || false;
		var position = parameters.position || null;
		var volume = parameters.volume || 1;
		var time = parameters.time || 0;
		var pitch = parameters.pitch || 1;
		var delay = parameters.delay || 0;

		if (name === undefined) return;

		// source
		var sourceNode = context.createBufferSource();
		sourceNode.buffer = soundLib[name].buffer;
		sourceNode.loop = loop;
		sourceNode.playbackRate.value = pitch;

		// pan
		var panNode = context.createPanner();
		if (position !== null) {
			panNode.setPosition(position.x, position.y, position.z);
		}

		// gain / volume
		var gainNode = context.createGain();
		gainNode.gain.value = volume;

		// connect nodes
		sourceNode.connect(panNode);
		panNode.connect(gainNode);
		gainNode.connect(this.master);

		// play
		sourceNode.start(time);

		return {sound: sourceNode, pan: panNode, gain: gainNode.gain};

	}

	webaudio.getContext = function() {

		return context;

	}



	return webaudio;

})();