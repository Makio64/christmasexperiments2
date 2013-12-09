var soundMap = [];

(function(){
    var defaults = {
        // Moose position
        gx: 0,
        gy: -30,
        gz: 0,

        // Nose position
        x: 0,
        y: 0,
        a: 200,

        // Moose color
        hue: 0.41,
        saturation: 0.31,
        lightness: 0.99,

        // Camera position
        camX: 0,

        // Music
        bpm: 50,

        debug: false,
    }

    THREE.Color.prototype.setHSB = function(h,s,b) {
        var l = (2 - s) * b / 2;

        var hsl = {
            h : h,
            s : s * b / (l < 0.5 ? l * 2 : 2 - l * 2),
            l : l
        };

        return this.setHSL(hsl.h, hsl.s, hsl.l);
    }

    APP.Moose = function(settings) {

        this.settings = $.extend(defaults,settings);

        // Local vars definitions

        this.width;         // Width of the scene
        this.height;        // Height of the scene
        this.scene;         // THREE Scene
        this.renderer;      // WebGL Renderer
        this.camera;        // THREE Camera
        this.controls;      // THREE Controls
        this.intensity;     // Intensity on Y axis


        // Local references definitions

        this.verticesO;     // Original shape vertices
        this.cx = settings.x;
        this.cy = settings.y;
        this.ca = settings.a;

        // Start the engine

        this.init();
        this.animate();

        return this;
    };

    APP.Moose.prototype.init = function() {

        var h, gui, plane, loader, text;

        this.scene = new THREE.Scene();

        // Create a renderer and add it to the DOM.
        this.renderer = new THREE.WebGLRenderer({antialias:true});

        this.renderer.setClearColorHex( 0xEA4437, 1 );

        $('#container').append(this.renderer.domElement);

        this.renderer.domElement.id = "context";

        // Camera
        this.camera = new THREE.PerspectiveCamera(24, 1.28, 1, 10000);
        this.camera.position.y = 15;
        this.scene.add(this.camera);

        this._resizeHandler(); // Set the renderer size

        // Controls
        // this.controls = new THREE.TrackballControls(this.camera);
        this.controls = new THREE.PeerControls(this.camera, this.renderer.domElement);
        this.controls.settings.lookAt = new THREE.Vector3(0,this.camera.position.y,-100);

        // Helper
        // if (this.settings.debug) {
        //     axes = new THREE.AxisHelper( 200 );
        //     this.scene.add( axes );
        // }

        // GUI helper
        this._setupGUI();

        // Add fake shadow

        this.shadow = new THREE.Mesh(new THREE.PlaneGeometry(43, 1000), new THREE.MeshBasicMaterial({color: 0xd03d31}));
        this.shadow.position.x = 323;
        this.shadow.position.y = -379;
        this.shadow.position.z = 0.1;
        this.shadow.rotation.z = 0.7;
        this.scene.add(this.shadow);

        // Moose Shape

        loader = new THREE.JSONLoader();
        loader.load( "js/data/shape.js", function(geometry) {
            // var texture = THREE.ImageUtils.loadTexture('assets/texture_wood.jpg');
            this.moose = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
                vertexColors: THREE.FaceColors,
                shading: THREE.FlatShading
            }));
            this.moose.position.y = 0;
            this.moose.position.x = 0;
            this.moose.position.z = 0;
            this.moose.castShadow = true;

            this.scene.add(this.moose);

            this.verticesO = this.moose.geometry.clone().vertices;

            this._updateVertices();
            this._updateFaces();
        }.bind(this));

        $(window).on('resize',this._resizeHandler.bind(this));
    };

    APP.Moose.prototype.render = function() {
        
        // Curve Debug
        if (this.settings.debug) {
            this._displayBone();
        } else {
            this.scene.remove(this.bone);
        }

        TweenLite.to(this.settings, 1, {
            a: 300 - (this.intensity || 0) * 50
        });

        if (this.moose) {
          // moose.material.uniforms.uBaseColor.value.setHSL(this.settings.hue, settings.saturation, settings.lightness);
          this.moose.position.set(this.settings.gx, this.settings.gy, this.settings.gz);
        }

        if (this.cx !== this.settings.x || this.cy !== this.settings.y || this.ca !== this.settings.a) {
          this._updateVertices();
          this.cx = this.settings.x;
          this.cy = this.settings.y;
          this.ca = this.settings.a;
        }

        this.renderer.render(this.scene, this.camera);
    };

    APP.Moose.prototype.animate = function() {
        requestAnimationFrame(this.animate.bind(this));
        this.render();
        // this.controls.update(this.settings.camX);
        this.controls.update();
    };

    APP.Moose.prototype.moveHead = function(x,y) {
        this.settings.x = x;
        this.settings.y = y;
    }

    // Vertices modifier
    APP.Moose.prototype._updateVertices = function() {

        if (!this.moose) return;

        var vertices = this.moose.geometry.vertices;

        this.moose.geometry.dynamic = true;

        for (var i=0, len=vertices.length; i<len; i++) {
            var vertexO, vertex, angx;

            vertexO = this.verticesO[i];
            vertex  = vertices[i];
            angx = this._tan(vertexO.z,this.settings.x);

            vertex.z = vertexO.z + Math.sin(angx) * vertexO.x;
            vertex.x = this._bone(vertex.z,this.settings.x) + vertexO.x;
            vertex.y = this._bone(vertex.z,this.settings.y) + vertexO.y;
        }

        this.moose.geometry.verticesNeedUpdate = true;
    }

    APP.Moose.prototype._updateFaces = function() {
        if (!this.moose) return;

        var color = new THREE.Color(0xffffff);
        var faces = this.moose.geometry.faces;

        for (var i=0, len=faces.length; i<len; i++) {
            var face   = faces[i];
            var normal = face.normal;
            var deep   = face.centroid.z/70+0.4;

            var values   = [normal.x, normal.y, normal.z];
            var maxValue = 0;
            var maxIndex = 0;
            var positive = true;

            for (var j=0; j<3; j++) {
                var abs = Math.abs(values[j]);
                if (abs > maxValue) {
                    maxValue = abs;
                    maxIndex = j;
                    positive = values[j] > 0;
                }
            }

            // Face / top / bottom lightness is Z-axis based
            if (maxIndex > 0) {
                face.color.setHSB(0.113888889,0.34,1 * deep + 0.2);
            }

            // Right
            else if (positive) {
                face.color.setHSB(0.113888889,0.34,.66);
            }

            // Left
            else {
                face.color.setHSB(0.113888889,0.34,1);
            }
        }
    }

    // Bone function (bended curve)
    APP.Moose.prototype._bone = function(pos,mod) {
        return mod * (1/this.settings.a*Math.pow(pos,2));
    };

    // Draw the bone
    APP.Moose.prototype._displayBone = function () {
        if (this.bone) {
          this.scene.remove(this.bone);
          this.bone = null;
        }
        if (this.settings.debug) {
          // Draw bone
          var lineMaterial = new THREE.LineBasicMaterial({color: 0xff00ff});
          var lineGeometry = new THREE.Geometry();
          for(var i=0; i<500; i++) {
            lineGeometry.vertices.push(new THREE.Vector3(this._bone(i,this.settings.x), this._bone(i,this.settings.y), i));
          }
          this.bone = new THREE.Line(lineGeometry, lineMaterial);
          this.scene.add(this.bone);
        }
    };

    // Get the vertex tangent relative to the bone
    APP.Moose.prototype._tan = function(bx,mod) {
        var dx, dy, ax, cx, ay, cy, ang;

        ax = bx-1;
        cx = bx+1;

        ay = this._bone(ax,mod);
        cy = this._bone(cx,mod);

        dx = ax-cx;
        dy = ay-cy;
        
        ang = Math.atan2(dy,dx);

        return ang;
    };

    APP.Moose.prototype._resizeHandler = function() {
        this.width  = $(window).innerWidth(),
        this.height = $(window).innerHeight();

        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width/this.height;
        this.camera.updateProjectionMatrix();
    };

    APP.Moose.prototype._setupGUI = function() {

        if (!this.settings.debug) return;

        var h;
        var gui = new dat.GUI();

        h = gui.addFolder('Positions');
        h.add(this.settings,'a',50, 200).name('Wideness');

        h.add(this.settings,'gx',-20, 20).name('Moose X');
        h.add(this.settings,'gy',-30, 20).name('Moose Y');
        h.add(this.settings,'gz',-300, 5).name('Moose Z');

        // h = gui.addFolder('Material');
        // h.add(this.settings, "hue", 0.0, 1.0, 0.025);
        // h.add(this.settings, "saturation", 0.0, 1.0, 0.025);
        // h.add(this.settings, "lightness", 0.0, 1.0, 0.025);

        h = gui.addFolder('Debug');
        h.add(this.settings, "debug");
    }
})();