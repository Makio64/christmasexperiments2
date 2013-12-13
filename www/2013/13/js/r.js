var paths = {
    "jquery"            : "vendors/jquery-2.0.3.min",
    "Threejs"           : "vendors/three",
    "TweenLite"         : "vendors/TweenLite.min",
    "dat.gui"           : "vendors/dat.gui.min",
    "RAF"               : "vendors/requestAnimationFrame",
    "Stats"             : "vendors/Stats",
    "TrackballControls" : "vendors/TrackballControls",
    "ColladaLoader"     : "vendors/ColladaLoader",
    "OBJLoader"      : "vendors/OBJLoader",
};

var libs = [];
for(var n in paths) libs.push(n);

requirejs.config({

    paths: paths,

    shim: {
        'TrackballControls': {
            deps: ['Threejs']
        },
        'ColladaLoader': {
            deps: ['Threejs']
        },
        'OBJLoader': {
            deps: ['Threejs']
        }
    },

    waitSeconds: 30

});

require(libs, function()
{
    require(['main']);
});
