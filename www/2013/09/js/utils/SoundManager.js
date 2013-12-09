/**
 * @author Franco Bouly - http://rayfran.co
 */

window.AudioContext = window.AudioContext || window.webkitAudioContext;

(function(){
    var defaults = {
        src:        null,
        autoplay:   false,
        onReady:    function(){},
        onStart:    function(){},
        onEnd:      function(){},
    }

    APP.SoundManager = function(settings) {

        this.settings = $.extend(defaults,settings);

        this.ready    = false;
        this.playing  = false;
        this.source   = null;
        this.context  = new AudioContext();
        this.filter   = this.context.createBiquadFilter();

        this.introLapse = 0;

        this.filter.type = 0; // Low-pass filter. See BiquadFilterNode docs
        this.filter.frequency.value = 300; // Set cutoff to 440 HZ

        this.startAt = 0;

        if (!this.settings.src) {
            console.error('Cannot load SoundManager, no URL specified.');
            return;
        }

        if (typeof this.settings.src !== 'string') {
            // Possibilities to test browser capabilities
            this.settings.src = this.settings.src[0];
        }

        // Request and load sound
        var request = new XMLHttpRequest();

        request.open('GET', this.settings.src, true);
        request.responseType = 'arraybuffer';
        request.onload = function() {
            this.context.decodeAudioData(request.response, function(buffer) {
                this.source = this.context.createBufferSource();
                this.source.buffer = buffer;
                this.source.connect(this.filter);
                this.filter.connect(this.context.destination);

                this.ready  = true;
                this.source.onended = this.settings.onEnd.bind(this);
                this.settings.onReady.call(this);
                if (this.settings.autoplay) {
                    this.source.loopStart = 4.450;
                    this.source.loopEnd = 8.144;
                    this.source.loop = true;
                    this.play();
                }
            }.bind(this), function(err){
                console.error('Error loading sound file',err);
            });
        }.bind(this);
        request.send();
    };

    APP.SoundManager.prototype.play = function() {
        if (!this.ready) return;
        this.source.start(this.startAt);
        this.settings.onStart.call(this);
    };

    APP.SoundManager.prototype.stopLoop = function() {
        this.introLapse = this.getTime();
        if (this.source)
            this.source.loop = false;
        TweenLite.to(this.filter.frequency,1,{
            value: 22050,
            ease: Power2.easeOut
        });
    }

    APP.SoundManager.prototype.getTime = function() {
        return this.context.currentTime;
    };

    APP.SoundManager.prototype.pitch = function(a) {

    };
})();