var APP = APP || {};

$(function(){

    var animateMoose;
    var bpm = 63.9;
    var curr = 0;

    var soundMap = [
        {t: 3.474285714285714, w: 1},
        {t: 26.81904761904762, w: 3} ,
        {t: 29.608344671201813, w: 4},
        {t: 33.34385487528345, w: 2} ,
        {t: 35.21596371882086, w: 1} ,
        {t: 40.96, w: 3} ,
        {t: 44.58521541950113, w: 2} ,
        {t: 50.361179138321994, w: 3} ,
        {t: 53.19981859410431, w: 2} ,
        {t: 56.07328798185941, w: 3} ,
        {t: 63.70394557823129, w: 1} ,
        {t: 71.36943310657597, w: 3} ,
        {t: 80.90412698412699, w: 4} ,
        {t: 82.82557823129251, w: 2} ,
        {t: 86.73233560090704, w: 3} ,
        {t: 90.60716553287982, w: 4} ,
        {t: 94.4152380952381, w: 3} ,
        {t: 98.22331065759637, w: 4} ,
        {t: 102.179410430839, w: 3} ,
        {t: 110.37895691609977, w: 2} ,
        {t: 113.66748299319728, w: 1} ,
        {t: 117.59455782312925, w: 3} ,
        {t: 121.44907029478458, w: 4} ,
        {t: 126.7112925170068, w: 1} ,
        {t: 147.98657596371882, w: 3} ,
        {t: 156.31673469387755, w: 1}
    ]

    var a = true;
    var r = 60/bpm; // ratio
    var b = 0;     // beat
    var n = r;     // next beat
    var t = r/2    // tier

    // Time map
    var tc = 0; // Current index
    var mn = soundMap[0].t; // Next time to reach

    var time;

    animateMoose = function() {

        if (!a) return;

        requestAnimationFrame(animateMoose);
        time = Math.floor(APP.music.getTime());
        if (n < time) {
            n += r;
            TweenLite.to(APP.moose.settings,t,{
                y: 0.4,
                ease: Power4.easeInOut,
                delay: t
            });
            TweenLite.to(APP.moose.settings,t,{
                y: 0,
                ease: Power1.easeIn,
                delay: 2*t
            });
            TweenLite.to(APP.moose.settings,2*t,{
                x: b % 2 ? -0.4 : 0.4,
                ease: Power1.easeInOut,
                delay: t
            });

            b += 1;
        }
        if (APP.music.introLapse > 0 && mn < time - APP.music.introLapse) {
            if (!soundMap[tc]) return;
            tc+=1;
            mn = soundMap[tc].t;
            APP.moose.intensity = soundMap[tc].w;
        }
    }

    // Moose Manager
    APP.moose = new APP.Moose({
        debug: false
    });

    // // // Sound Manager
    APP.music = new APP.SoundManager({
        src: ['sound/whitechristmas.mp3'],
        autoplay: true,
        onStart: animateMoose,
        onEnd: function(){ a = false }
    });

});