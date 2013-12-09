/**
 * @author Franco Bouly - http://rayfran.co
 */


THREE.PeerControls = function (camera, el) {
    this.pos = 0;

    this.settings = {
        lookAt: new THREE.Vector3(0,0,0),
        distance: 300,
        max: 0.5,       // 0 < max > 1
    }

    this.camera = camera;
    this.el = el;

    window.addEventListener('mousemove',this.mousemove.bind(this),false);
}

THREE.PeerControls.prototype = Object.create(THREE.EventDispatcher.prototype);

THREE.PeerControls.prototype.mousemove = function(e) {
    var rel = 2/window.innerWidth*e.clientX-1;
        pos: rel * this.settings.distance,
        this.pos = rel * this.settings.distance;
}

THREE.PeerControls.prototype.update = function(x) {

    var pos = x || this.pos;
    var max = this.settings.max * this.settings.distance;

    if (pos < -max) {
        pos = -max;
    } else if (pos > max) {
        pos = max;
    }

    // Camera
    var angle = Math.acos(pos/this.settings.distance);
    
    this.camera.position.z += (Math.sin(angle) * this.settings.distance - this.camera.position.z)*0.5;
    this.camera.position.x += (pos - this.camera.position.x) *.05;
    this.camera.lookAt(this.settings.lookAt);
}