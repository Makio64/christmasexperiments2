var FirstPersonSanta = (function() {

	/*

		First Person Santa - Just Cause Giving Feels Good

                                                		    __.  .--,
		*-/___,  ,-/___,-/___,-/___,-/___,           _.-.=,{\/ _/  /`)
		 `\ _ ),-/___,-/___,-/___,-/___, )     _..-'`-(`._(_.;`   /
		  /< \\=`\ _ )`\ _ )`\ _ )`\ _ )<`--''`     (__\_________/___,
		         /< <\ </ /< /< /< </ /<           (_____Y_____Y___,  jgs

		
		A small Christmas experiment for http://christmasexperiments.com/

		Makes use of:
		three.js - https://github.com/mrdoob/three.js @mrdoob
		cannon.js - https://github.com/schteppe/cannon.js/ @schteppe
		tween.js - https://github.com/sole/tween.js/ @sole

		Ghetto code below by @oosmoxiecode

		Merry Christmas!

	*/

	var fps = {};

	var container;
	var depthMaterial, depthTarget, composer, ssao, fxaa;

	var camera, scene, renderer;
	var meshes = [], bodies = [];

	var world;

	var roof, house, roofBody;
	var chimney, chimneyBody;

	var delta;
	var time;
	var oldTime;

	var packageBodyMaterial;
	var spriteFog;
	var trees;
	var skybox;
	var blackCover;
	var spriteClouds, spriteClouds2;
	var snow, snow2;
	var uniformsFog, uniformsSnow, uniformsClouds2;

	var knotMesh, starMesh, icoRibbonMesh;
	var packageMaterialArray;
	var ribbonMaterialArray;
	var ribbonMaterialFlatArray;

	var isMouseDown = false;
	var isTouchButtonDown = false;

	var isTraveling = true;

	var firedPackages = 0;
	var deliveredPackages = 0;

	var lastDelivery = 0;

	var textures = {};
	var treeGeometry;

	var cameraTarget = new THREE.Vector3( 0, 0, 0 );
	var cameraContainer;
	var cameraCubeContainer;

	var targetVector = new THREE.Vector3();
	var offset = new THREE.Vector3();
	var offset2 = new THREE.Vector3();
	var camPos = new THREE.Vector3();
	var camLook = new THREE.Vector3();

	var mouse = new THREE.Vector3(0,0,0);
	var projector = new THREE.Projector();

	var ratio = window.devicePixelRatio || 1;
	var touchDevice = ( ('ontouchstart' in document) || (navigator.userAgent.match(/ipad|iphone|android/i) != null) );
	var tabletDevice = (navigator.userAgent.match(/ipad|iphone|android/i) != null);
	var ie = !!navigator.userAgent.match(/Trident\/7\./);
	var doPostprocessing = true;

	var scaleRatio = 1;
	if (ratio > 1 || touchDevice) scaleRatio = ratio;

	var startTime = Date.now();
	var elapsedTime = 0;

	// pointer lock
	var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
	var isPointerLocked = false;
	var cross;

	// sound
	var masterVolume = 1.0;
	var windSound = null;
	var lastDropSound = 0;
	var leaveMaster;


	var loadedAssets = 0;


	// init
	fps.init = function() {

		container = document.createElement( 'div' );
		document.body.appendChild( container );

		if (tabletDevice) {
			document.getElementById('fps_title').children[1].innerHTML = "( Press the button to give )";
		}

		WebAudio.init();

		preload();

	}
	// preload
	var preload = function () {
		
	    if (WebAudio.available) {

	    	WebAudio.master.gain.value = masterVolume;

			WebAudio.loadSound("assets/sound/thud0.mp3", assetLoaded);
			WebAudio.loadSound("assets/sound/thud1.mp3", assetLoaded);
			WebAudio.loadSound("assets/sound/thud2.mp3", assetLoaded);
			WebAudio.loadSound("assets/sound/thud3.mp3", assetLoaded);
			WebAudio.loadSound("assets/sound/ding.mp3", assetLoaded);
			WebAudio.loadSound("assets/sound/wind_loop.mp3", assetLoaded);
			
		} else {

			loadedAssets += 6;
			document.getElementById('soundbutton').style.display = "none";
	    
	    }

	    // textures

	    textures.dirt0_inv = THREE.ImageUtils.loadTexture( "assets/dirt0_inv.png", undefined, assetLoaded );
	    textures.dirt1_inv = THREE.ImageUtils.loadTexture( "assets/dirt1_inv.png", undefined, assetLoaded );
	    textures.dirt2_inv = THREE.ImageUtils.loadTexture( "assets/dirt2_inv.png", undefined, assetLoaded );
	    textures.dirt3_inv = THREE.ImageUtils.loadTexture( "assets/dirt3_inv.png", undefined, assetLoaded );
	    textures.dirt = THREE.ImageUtils.loadTexture( "assets/dirt.png", undefined, assetLoaded );
	    textures.bricks = THREE.ImageUtils.loadTexture( "assets/bricks.jpg", undefined, assetLoaded );
	    textures.cross = THREE.ImageUtils.loadTexture( "assets/cross.png", undefined, assetLoaded );
	    textures.moon = THREE.ImageUtils.loadTexture( "assets/moon.png", undefined, assetLoaded );
	    textures.smoke = THREE.ImageUtils.loadTexture( "assets/smoke.png", undefined, assetLoaded );
	    textures.snowflake = THREE.ImageUtils.loadTexture( "assets/snowflake.png", undefined, assetLoaded );
	    textures.side = THREE.ImageUtils.loadTexture( "assets/cube/side.png", undefined, assetLoaded );
	    textures.up = THREE.ImageUtils.loadTexture( "assets/cube/up.png", undefined, assetLoaded );

	    // tree
		var loader = new THREE.JSONLoader();
		loader.load( "assets/tree.js", treeLoaded );	

	}

	var assetLoaded = function () {
		++loadedAssets;

		if (loadedAssets >= 19) {
			allLoaded();
		}

	}

	var allLoaded = function () {

		setup();
		animate();

		// fade out title
		var spinner = document.getElementById('loading_spinner');
		var title = document.getElementById('fps_title');
		title.style.opacity = 1.0;
		spinner.style.opacity = 1.0;

        var outTween0 = new TWEEN.Tween( spinner.style )
            .to( { opacity: 0.1 }, 2000 )
            .easing( TWEEN.Easing.Quadratic.In )
            .onComplete(function () {
            	spinner.style.display = "none";
            });
    	outTween0.start();

        var outTween1 = new TWEEN.Tween( title.style )
            .to( { opacity: 0.0 }, 2000 )
            .easing( TWEEN.Easing.Quadratic.In )
            .onComplete(function () {
            	title.style.display = "none";
            })
            .delay(3000);
    	outTween1.start();

		document.body.style.cursor = 'pointer';

		var hud = document.getElementById('hud');

        var alphaTween0 = new TWEEN.Tween( hud.style )
            .to( { opacity: 0.4 }, 3000 )
            .delay(4000)
            .easing( TWEEN.Easing.Quadratic.Out );
    	alphaTween0.start();


		var soundbutton = document.getElementById('soundbutton');

        var alphaTween1 = new TWEEN.Tween( soundbutton.style )
            .to( { opacity: 0.4 }, 3000 )
            .delay(4000)
            .easing( TWEEN.Easing.Quadratic.Out );
    	alphaTween1.start();



    	// cover
        var alphaTween2 = new TWEEN.Tween( blackCover.material )
            .to( { opacity: 0.0 }, 3000 )
            .easing( TWEEN.Easing.Quadratic.Out )
            .delay(3500)
            .onComplete(function () {
            	scene.remove(blackCover);
            	blackCover = undefined;
            });
    	alphaTween2.start();

    	setTimeout(function () {
	    	cameraTarget.y = 180;
	    	camPos.y = 100;

	    	moveAndThenBack(0.7, 0.7);
    	}, 3000);


    	// sound
    	if (WebAudio.available) {
	    	
	    	windSound = WebAudio.startSound( {name: "wind_loop", volume: 0.2, loop: true} );

	    	WebAudio.master.gain.value = 0;

	        var volumeTween = new TWEEN.Tween( WebAudio.master.gain )
	            .to( { value: 1.0 }, 3000 )
	            .delay(3000)
	            .easing( TWEEN.Easing.Quadratic.Out );
	    	volumeTween.start();

			window.addEventListener('focus', function() {
		        WebAudio.master.gain.value = leaveMaster;
			});

			window.addEventListener('blur', function() {
				leaveMaster = WebAudio.master.gain.value;
				WebAudio.master.gain.value = 0;
			});

		}

		if (tabletDevice) {
			var touch = document.getElementById('touch');
			touch.style.display = "block";

	        var alphaTween3 = new TWEEN.Tween( touch.style )
	            .to( { opacity: 0.4 }, 3000 )
	            .delay(4000)
	            .easing( TWEEN.Easing.Quadratic.Out );
	    	alphaTween3.start();

		}

	}

	var treeLoaded = function (geometry) {
		treeGeometry = geometry;
		assetLoaded();
	}

    var toggleSound = function () {
    	if (WebAudio.master.gain.value > 0) {
    		WebAudio.master.gain.value = 0;
    		document.getElementById("soundimage").src = "assets/sound_off.png";
    	} else {
    		WebAudio.master.gain.value = 1;
    		document.getElementById("soundimage").src = "assets/sound_on.png";
    	}
    }

	// setup
	var setup = function () {
		console.log("setup");

		scene = new THREE.Scene();
		scene.fog = new THREE.Fog(0x192d37, 100, 250);

		camera = new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 2, 1000 );
		cameraContainer = new THREE.Object3D();
		scene.add(cameraContainer);
		cameraContainer.add( camera );

		var light = new THREE.HemisphereLight( 0xccdee5, 0x222222, 0.8 );
		light.position.set( 0, 10, -10 );
		scene.add( light );

		// cover
		var black = generateTexture();
		black.needsUpdate = true;

		var material = new THREE.SpriteMaterial( { map: black, alignment: THREE.SpriteAlignment.center, opacity: 1.0 } );

		blackCover = new THREE.Sprite( material );
		blackCover.position.set( window.innerWidth/2, window.innerHeight/2, 0 );
		blackCover.scale.set( window.innerWidth, window.innerHeight, 1 );
		scene.add( blackCover );

		setupShapes();
		setupTrees(treeGeometry);

		// skybox
		var up = textures.up;
		var side = textures.side;

		var skyboxGeometry = new THREE.Geometry();

		var pgside = new THREE.PlaneGeometry(1000,1000);
		var pgup = new THREE.PlaneGeometry(1000,1000);
		var pgdown = new THREE.PlaneGeometry(1000,1000);

		for (var i = 0; i < pgup.faces.length; i++) {
			pgup.faces[i].materialIndex = 1;
		}

		for (var i = 0; i < pgdown.faces.length; i++) {
			pgdown.faces[i].materialIndex = 2;
		}

		var back = new THREE.Mesh( pgside );
		back.position.z = -500;
		THREE.GeometryUtils.merge(skyboxGeometry, back);

		var front = new THREE.Mesh( pgside );
		front.position.z = 500;
		front.rotation.y = Math.PI;
		THREE.GeometryUtils.merge(skyboxGeometry, front);

		var left = new THREE.Mesh( pgside );
		left.position.x = 500;
		left.rotation.y = Math.PI*1.5;
		THREE.GeometryUtils.merge(skyboxGeometry, left);

		var right = new THREE.Mesh( pgside );
		right.position.x = -500;
		right.rotation.y = Math.PI*0.5;
		THREE.GeometryUtils.merge(skyboxGeometry, right);

		var top = new THREE.Mesh( pgup );
		top.position.y = 500;
		top.rotation.x = Math.PI/2;
		THREE.GeometryUtils.merge(skyboxGeometry, top);

		var bottom = new THREE.Mesh( pgdown );
		bottom.position.y = -500;
		bottom.rotation.x = -Math.PI/2;
		THREE.GeometryUtils.merge(skyboxGeometry, bottom);

		var moonPlane = new THREE.PlaneGeometry(120,120);
		for (var i = 0; i < moonPlane.faces.length; i++) {
			moonPlane.faces[i].materialIndex = 3;
		}		
		var moon = new THREE.Mesh( moonPlane );
		moon.position.z = -500;
		moon.position.y = 250;
		THREE.GeometryUtils.merge(skyboxGeometry, moon);

		var m0 = new THREE.MeshBasicMaterial({map: side, fog: false, depthWrite: false});
		var m1 = new THREE.MeshBasicMaterial({map: up, fog: false, depthWrite: false});
		var m2 = new THREE.MeshBasicMaterial({color: 0x192d37, fog: false, depthWrite: false});
		
		var moonMaterial = new THREE.MeshBasicMaterial( {map: textures.moon, opacity: 0.6, transparent: true, blending: THREE.AdditiveBlending, fog: false, depthWrite: false} )

		var skyBoxMaterial = new THREE.MeshFaceMaterial( [m0, m1, m2, moonMaterial] );
		skybox = new THREE.Mesh(skyboxGeometry, skyBoxMaterial);
		scene.add( skybox );
		skybox.renderDepth = 0;
		skybox.frustumCulled = false;


		// fog

		var geometry = new THREE.Geometry();

		var fog = new THREE.Fog( 0x192d37, 100, 300 );

		var attributesFog = {

			direction: 	 { type: "v3", value: new THREE.Vector3( 0, 0, 0 ) },
			seed:		 { type: 'f', value: [] },
			size:		 { type: 'f', value: [] },
			customColor: { type: 'c', value: new THREE.Color( 0xffffff ) },
						
		};


		uniformsFog = {

			map: { type: "t", value: textures.smoke },
			fogColor : { type: "c", value: fog.color },
			fogNear : { type: "f", value: fog.near },
			fogFar : { type: "f", value: fog.far },
			globalTime : { type: "f", value: 0.0 },
			globalAlpha : { type: "f", value: 1.0 },
				
		};

		var material = new THREE.ShaderMaterial( {

			uniforms: uniformsFog,
			attributes: attributesFog,
			vertexShader: document.getElementById( 'fog_vs' ).textContent,
			fragmentShader: document.getElementById( 'fog_fs' ).textContent,
			transparent: true,
			depthWrite: false,

		} );

		var plane = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ) );
		plane.applyMatrix( new THREE.Matrix4().makeRotationFromEuler( new THREE.Vector3( -Math.PI*0.5, 0, 0 ) ) );

		for ( i = 0; i < 400; i++ ) {

			plane.position.x = Math.random() * 700 - 350;
			plane.position.y = -6 + Math.random() * -30;
			plane.position.z = Math.random() * 700 - 350;

			THREE.GeometryUtils.merge(geometry, plane);

		}


		var vertices = geometry.vertices;
		var values_direction = attributesFog.direction.value;
		var values_size = attributesFog.size.value;
		var values_seed = attributesFog.seed.value;
		var values_colors = attributesFog.customColor.value;

		var testGeometry = new THREE.PlaneGeometry(2,2);
		testGeometry.applyMatrix( new THREE.Matrix4().makeRotationFromEuler( new THREE.Vector3( -Math.PI*0.5, 0, 0 ) ) );

		for( var v = 0; v < vertices.length; v+=4 ) {
			
			values_direction[v] = testGeometry.vertices[0];
			values_direction[v+1] = testGeometry.vertices[1];
			values_direction[v+2] = testGeometry.vertices[2];
			values_direction[v+3] = testGeometry.vertices[3];

			var size = 50 + Math.random() * 40;
			values_size[v] = size;
			values_size[v+1] = size;
			values_size[v+2] = size;
			values_size[v+3] = size;

			var seed = Math.random();
			values_seed[v] = seed;
			values_seed[v+1] = seed;
			values_seed[v+2] = seed;
			values_seed[v+3] = seed;

			var color = new THREE.Color( 0x192d37 );
			color.offsetHSL(0, -(0.1 + Math.random()*0.15), 0.1+Math.random()*0.3);

			values_colors[v] = color;
			values_colors[v+1] = color;
			values_colors[v+2] = color;
			values_colors[v+3] = color;

		}


		spriteFog = new THREE.Mesh( geometry, material );
		scene.add( spriteFog );
		spriteFog.frustumCulled = false;


		// clouds

		var geometry = new THREE.Geometry();

		var attributesClouds = {

			direction: 	 { type: "v3", value: new THREE.Vector3( 0, 0, 0 ) },
			seed:		 { type: 'f', value: [] },
			size:		 { type: 'f', value: [] },
			customColor: { type: 'c', value: new THREE.Color( 0xffffff ) },
						
		};


		var uniformsClouds = {

			map: { type: "t", value: textures.smoke },
			fogColor : { type: "c", value: fog.color },
			fogNear : { type: "f", value: fog.near },
			fogFar : { type: "f", value: fog.far },
			globalTime : { type: "f", value: 0.0 },
			globalAlpha : { type: "f", value: 1.0 },

		};

		uniformsClouds2 = {

			map: { type: "t", value: textures.smoke },
			fogColor : { type: "c", value: fog.color },
			fogNear : { type: "f", value: fog.near },
			fogFar : { type: "f", value: fog.far },
			globalTime : { type: "f", value: 0.0 },
			globalAlpha : { type: "f", value: 1.0 },

		};

		var material = new THREE.ShaderMaterial( {

			uniforms: uniformsClouds,
			attributes: attributesClouds,
			vertexShader: document.getElementById( 'fog_vs' ).textContent,
			fragmentShader: document.getElementById( 'fog_fs' ).textContent,
			transparent: true,
			depthWrite: false,

		} );

		var material2 = new THREE.ShaderMaterial( {

			uniforms: uniformsClouds2,
			attributes: attributesClouds,
			vertexShader: document.getElementById( 'fog_vs' ).textContent,
			fragmentShader: document.getElementById( 'fog_fs' ).textContent,
			transparent: true,
			depthWrite: false,
		} );

		var plane = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ) );
		plane.applyMatrix( new THREE.Matrix4().makeRotationFromEuler( new THREE.Vector3( Math.PI*0.5, 0, 0 ) ) );

		for ( i = 0; i < 100; i++ ) {

			plane.position.x = Math.random() * 600 - 300;
			plane.position.y = 160 + Math.random() * 140;
			plane.position.z = Math.random() * 600 - 300;

			THREE.GeometryUtils.merge(geometry, plane);

		}


		var vertices = geometry.vertices;
		var values_direction = attributesClouds.direction.value;
		var values_size = attributesClouds.size.value;
		var values_seed = attributesClouds.seed.value;
		var values_colors = attributesClouds.customColor.value;

		var testGeometry = new THREE.PlaneGeometry(2,2);
		testGeometry.applyMatrix( new THREE.Matrix4().makeRotationFromEuler( new THREE.Vector3( Math.PI*0.5, 0, 0 ) ) );

		for( var v = 0; v < vertices.length; v+=4 ) {
			
			values_direction[v] = testGeometry.vertices[0];
			values_direction[v+1] = testGeometry.vertices[1];
			values_direction[v+2] = testGeometry.vertices[2];
			values_direction[v+3] = testGeometry.vertices[3];

			var size = 100 + Math.random() * 80;
			values_size[v] = size;
			values_size[v+1] = size;
			values_size[v+2] = size;
			values_size[v+3] = size;

			var seed = Math.random();
			values_seed[v] = seed;
			values_seed[v+1] = seed;
			values_seed[v+2] = seed;
			values_seed[v+3] = seed;

			var color = new THREE.Color( 0x192d37 );
			color.offsetHSL(0, -(0.1 + Math.random()*0.15), 0.1+Math.random()*0.3);

			values_colors[v] = color;
			values_colors[v+1] = color;
			values_colors[v+2] = color;
			values_colors[v+3] = color;

		}


		spriteClouds = new THREE.Mesh( geometry, material );
		spriteClouds2 = new THREE.Mesh( geometry, material2 );
		spriteClouds2.visible = false;
		scene.add( spriteClouds );
		scene.add( spriteClouds2 );

		spriteClouds.frustumCulled = false;
		spriteClouds2.frustumCulled = false;

		spriteClouds.renderDepth = 0;
		spriteClouds2.renderDepth = 0;


		// Snowfall
		var bSize = Math.min( Math.max(8, (window.innerWidth*window.innerHeight)*0.00001), 16) / scaleRatio;

		var attributesSnow = {

			size:		 { type: 'f', value: [] },
			time:		 { type: 'f', value: [] },

		};

		uniformsSnow = {

			color:      { type: "c", value: new THREE.Color( 0x777777 ) },
			texture:    { type: "t", value: textures.snowflake },
			globalTime:	{ type: "f", value: 0.0 },
			baseSize:	{ type: "f", value: bSize }
				
		};

		var shaderMaterial = new THREE.ShaderMaterial( {

			uniforms: 		uniformsSnow,
			attributes:     attributesSnow,
			vertexShader:   document.getElementById( 'p_vs' ).textContent,
			fragmentShader: document.getElementById( 'p_fs' ).textContent,

			blending: 		THREE.AdditiveBlending,
			transparent:	true,
			depthWrite: 	false,

		});

		var geometry = new THREE.Geometry();

		var numSnow = 10000;
		if (tabletDevice) numSnow = 6000;

		for ( i = 0; i < numSnow; i++ ) {
			var vertex = new THREE.Vector3(Math.random() * 400 - 200,  -400, Math.random() * 400 - 200);

			geometry.vertices.push(vertex);
		}

		snow = new THREE.ParticleSystem( geometry, shaderMaterial );
		snow2 = new THREE.ParticleSystem( geometry, shaderMaterial );

		snow.position.y = 300;
		snow.renderDepth = 1;
		snow2.position.y = 300;
		snow2.renderDepth = 1;

		snow2.visible = false;

		var vertices = geometry.vertices;
		var values_size = attributesSnow.size.value;
		var values_time = attributesSnow.time.value;

		for( var v = 0; v < vertices.length; v++ ) {
			
			values_size[ v ] = 2+Math.random()*2;
			
			values_time[ v ] = Math.random();

		}

		scene.add( snow );
		scene.add( snow2 );

		snow.frustumCulled = false;
		snow2.frustumCulled = false;



		// physics
		world = new CANNON.World();
		world.broadphase = new CANNON.NaiveBroadphase();
		world.gravity.set( 0, -40, 0 );

		world.solver.iterations = 1;
		world.solver.tolerance = 0.0001;

		var snowMaterial = new CANNON.Material();

		var size = 16;
		var boxShape = new CANNON.Box(new CANNON.Vec3(size*2,size,size));
		roofBody = new CANNON.RigidBody( 0, boxShape, snowMaterial );
		roofBody.position.set( 0, -8, 0 );
		roofBody.quaternion.setFromAxisAngle( new CANNON.Vec3( 1, 0, 0 ), -Math.PI / 4 );
		world.add( roofBody );

		var snowGeometry = new THREE.CubeGeometry((size*2)*2, 2, (size*2), 12, 2, 6);
		snowGeometry.applyMatrix( new THREE.Matrix4().setPosition( new THREE.Vector3( 0, 0, size ) ) );
		
		snowGeometry.computeCentroids();
		snowGeometry.computeFaceNormals();
		snowGeometry.computeVertexNormals();

		var modifier = new THREE.SubdivisionModifier( 1 );
		modifier.modify( snowGeometry );

		for (var i = 0; i < snowGeometry.vertices.length; i++) {
			if (snowGeometry.vertices[i].z > 3) {
				snowGeometry.vertices[i].x += Math.random()*1.2 - 0.6;
				snowGeometry.vertices[i].y += Math.random()*1.2 - 0.6;
				snowGeometry.vertices[i].z += Math.random()*1.2 - 0.6;
			}
		}

		snowGeometry.computeFaceNormals();
		snowGeometry.computeVertexNormals();

		var snowRoofMaterial = new THREE.MeshPhongMaterial( {color: 0xdddddd, specular: 0x444444, wireframe: false} );

		var side1 = new THREE.Mesh( snowGeometry, snowRoofMaterial );
		side1.position.y = 14;
		side1.position.z = -0.6;
		
		side1.rotation.x = Math.PI*0.25;
		scene.add(side1);

		var side2 = new THREE.Mesh( snowGeometry, snowRoofMaterial );
		side2.position.y = 14;
		side2.position.z = 0.6;

		side2.rotation.x = Math.PI*0.75;
		scene.add(side2);

		var roofGeometry = new THREE.CubeGeometry((size*2)*2 - 4, (size*2)-2, (size*2)-2);

		roofGeometry.vertices[3].y = 0;
		roofGeometry.vertices[3].z = 0;
		roofGeometry.vertices[6].y = 0;
		roofGeometry.vertices[6].z = 0;

		roof = new THREE.Mesh( roofGeometry, new THREE.MeshPhongMaterial( {color: 0x581407, specular: 0x222222} ) );
		roof.useQuaternion = true;
		scene.add( roof );

		var size = 3;
		var boxShape = new CANNON.Box(new CANNON.Vec3(size,size,size));
		chimneyBody = new CANNON.RigidBody( 0.0, boxShape, snowMaterial );

		
		chimneyBody.position.set( Math.random()*48-24, 14, 0 );
		world.add( chimneyBody );

		var chimneyGeometry = new THREE.CubeGeometry((size*2), (size*2), (size*2));
		chimney = new THREE.Mesh( chimneyGeometry, new THREE.MeshPhongMaterial( {map: textures.bricks, color: 0xffa46d, specular: 0x444444} ) );
		chimney.useQuaternion = true;
		scene.add( chimney );

		var topGeo = new THREE.CubeGeometry((size*2)+0.6, 1, (size*2)+0.6);
		var top = new THREE.Mesh( topGeo, new THREE.MeshPhongMaterial( {map: textures.dirt, color: 0x888888, specular: 0x333333} ) );
		top.position.y = size-0.4;
		chimney.add(top);

		var topPlane = new THREE.PlaneGeometry((size*2)-3, (size*2)-3);
		var topDark = new THREE.Mesh( topPlane, new THREE.MeshPhongMaterial( {color: 0x111111, specular: 0x222222} ) );
		topDark.rotation.x = -Math.PI*0.5;
		topDark.position.y = 0.6;
		top.add(topDark);


		var snowTopGeo = new THREE.CubeGeometry((size*2)+1, 1.0, (size*2)+1, 4, 1, 4);

		var modifier = new THREE.SubdivisionModifier( 1 );
		modifier.modify( snowTopGeo );

		for (var i = 0; i < snowTopGeo.vertices.length; i++) {
			snowTopGeo.vertices[i].x += Math.random()*0.4 - 0.2;
			snowTopGeo.vertices[i].y += Math.random()*0.4 - 0.2;
			snowTopGeo.vertices[i].z += Math.random()*0.4 - 0.2;

			var hole = 1.5;
			if (snowTopGeo.vertices[i].x < hole && snowTopGeo.vertices[i].x > -hole) {
				if (snowTopGeo.vertices[i].z < hole && snowTopGeo.vertices[i].z > -hole) {
					snowTopGeo.vertices[i].y = -1.0;
				}
			}
		}

		snowTopGeo.computeFaceNormals();
		snowTopGeo.computeVertexNormals();

		var snowTop = new THREE.Mesh( snowTopGeo, snowRoofMaterial );
		snowTop.position.y = 0.5;
		top.add(snowTop);


		// house
		var size = 16;
		var houseGeometry = new THREE.CubeGeometry((size*2)*2 - 6, (size*2)*2, (size*2));

		var winGeometry = new THREE.Geometry();

		var windowGeometry = new THREE.CubeGeometry(8, 8, (size*2)+0.1);
		for (var i = 0; i < windowGeometry.faces.length; i++) {
			windowGeometry.faces[i].materialIndex = 1;
		}

		var winMat = new THREE.MeshLambertMaterial( {color: 0x666666} );

		var win0 = new THREE.Mesh( windowGeometry, winMat );
		win0.position.set(18, 5, 0);
		var win1 = new THREE.Mesh( windowGeometry, winMat );
		win1.position.set(-18, 5, 0);
		var win2 = new THREE.Mesh( windowGeometry, winMat );
		win2.position.set(0, 5, 0);
		THREE.GeometryUtils.merge(winGeometry, win0);
		THREE.GeometryUtils.merge(winGeometry, win1);
		THREE.GeometryUtils.merge(winGeometry, win2);

		var win0 = new THREE.Mesh( windowGeometry, winMat );
		win0.position.set(18, -15, 0);
		var win1 = new THREE.Mesh( windowGeometry, winMat );
		win1.position.set(-18, -15, 0);
		var win2 = new THREE.Mesh( windowGeometry, winMat );
		win2.position.set(0, -15, 0);
		THREE.GeometryUtils.merge(winGeometry, win0);
		THREE.GeometryUtils.merge(winGeometry, win1);
		THREE.GeometryUtils.merge(winGeometry, win2);

		var windowGeometry2 = new THREE.CubeGeometry((size*2)*2 - 6 +0.1, 8, 8);
		for (var i = 0; i < windowGeometry2.faces.length; i++) {
			windowGeometry2.faces[i].materialIndex = 1;
		}

		var win0 = new THREE.Mesh( windowGeometry2, winMat );
		win0.position.set(0, 25, -8);
		var win1 = new THREE.Mesh( windowGeometry2, winMat );
		win1.position.set(0, 25, 8);
		THREE.GeometryUtils.merge(winGeometry, win0);
		THREE.GeometryUtils.merge(winGeometry, win1);

		var win0 = new THREE.Mesh( windowGeometry2, winMat );
		win0.position.set(0, 5, -8);
		var win1 = new THREE.Mesh( windowGeometry2, winMat );
		win1.position.set(0, 5, 8);
		THREE.GeometryUtils.merge(winGeometry, win0);
		THREE.GeometryUtils.merge(winGeometry, win1);


		var houseMaterial = new THREE.MeshPhongMaterial( {color: 0x581407, specular: 0x222222} );
		house = new THREE.Mesh( houseGeometry, houseMaterial );
		house.position.y = -40;
		scene.add(house);

		var windows = new THREE.Mesh( winGeometry, winMat );
		house.add(windows);

		packageBodyMaterial = new CANNON.Material();
		world.addContactMaterial( new CANNON.ContactMaterial( packageBodyMaterial, snowMaterial, 0.07, 0.1 ) );
		world.addContactMaterial( new CANNON.ContactMaterial( packageBodyMaterial, packageBodyMaterial, 0.1, 0.1 ) );

		roof.position.copy( roofBody.position );
		roof.quaternion.copy( roofBody.quaternion );

		chimney.position.copy( chimneyBody.position );
		chimney.quaternion.copy( chimneyBody.quaternion );
		chimney.position.y -= 0.25;

		// cross
		if (!tabletDevice) {

			var material = new THREE.SpriteMaterial( { map: textures.cross, alignment: THREE.SpriteAlignment.center, opacity: 0.2 } );

			cross = new THREE.Sprite( material );
			cross.position.set( (window.innerWidth/scaleRatio)/2, (window.innerHeight/scaleRatio)/2, 0 );
			cross.scale.set( 30/scaleRatio, 30/scaleRatio, 1 );
			cross.visible = false;
			scene.add( cross );

		}

		try {
			// renderer
			renderer = new THREE.WebGLRenderer({antialias: false});
			renderer.setSize( window.innerWidth/scaleRatio, window.innerHeight/scaleRatio );
			renderer.setClearColor(0x131313);

			if (!tabletDevice && !ie && doPostprocessing) {

				renderer.autoClear = false;

				// postprocessing
				composer = new THREE.EffectComposer( renderer );
				composer.addPass( new THREE.RenderPass( scene, camera ) );

				depthTarget = new THREE.WebGLRenderTarget( window.innerWidth/scaleRatio, window.innerHeight/scaleRatio, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat } );

				ssao = new THREE.ShaderPass( THREE.SSAOShader );
				ssao.uniforms[ 'tDepth' ].value = depthTarget;
				ssao.uniforms[ 'size' ].value.set( window.innerWidth/scaleRatio, window.innerHeight/scaleRatio );
				ssao.uniforms[ 'cameraNear' ].value = camera.near;
				ssao.uniforms[ 'cameraFar' ].value = camera.far;
				ssao.uniforms[ 'aoClamp' ].value = 0.6;
				ssao.uniforms[ 'lumInfluence' ].value = 0.1;
				ssao.uniforms[ 'onlyAO' ].value = 0;
				composer.addPass( ssao );

				fxaa = new THREE.ShaderPass( THREE.FXAAShader );
				fxaa.uniforms[ 'resolution' ].value = new THREE.Vector2( 1/(window.innerWidth), 1/(window.innerHeight) );
				fxaa.renderToScreen = true;
				composer.addPass( fxaa );

				// depth pass
				depthPassPlugin = new THREE.DepthPassPlugin();
				depthPassPlugin.renderTarget = depthTarget;

				renderer.addPrePlugin( depthPassPlugin );

			}

			renderer.domElement.style.position = "absolute";
			renderer.domElement.style.top = "0px";
			renderer.domElement.style.left = "0px";

			if (scaleRatio > 1) {
				renderer.domElement.style.webkitTransform = "scale3d("+scaleRatio+", "+scaleRatio+", 1)";
				renderer.domElement.style.webkitTransformOrigin = "0 0 0";
				renderer.domElement.style.transform = "scale3d("+scaleRatio+", "+scaleRatio+", 1)";
				renderer.domElement.style.transformOrigin = "0 0 0";				
			}

			container.appendChild( renderer.domElement );
			has_gl = true;

			addEventListeners();

			onWindowResize(null);

		}
		catch (e) {
			// need webgl
			alert("No WebGL... No Santa for you! :'(  HOOHOO! ");
			return;
		}

	}

	var setupTrees = function (geometry) {

		geometry.computeFaceNormals();
		geometry.computeVertexNormals();
		
		var allTrees = new THREE.Geometry();
		var material = new THREE.MeshLambertMaterial( {color: 0x344c36, shading: THREE.FlatShading} )

		for (var i = 0; i < 400; i++) {

			var mesh = new THREE.Mesh( geometry, material );
			var scale = 0.075 + Math.random()*0.025;
			var scale = 3.5 + Math.random()*1.5;
			
			mesh.scale.set(scale,scale*1.2,scale);

			var radius = 100+(i*0.9);
			var angle = i*0.3;

			mesh.position.set(Math.sin(angle)*radius, -60, Math.cos(angle)*radius);

			mesh.position.x += Math.random()*30-15;
			mesh.position.z += Math.random()*30-15;

			mesh.rotation.set((Math.random()*0.2)-0.1,Math.random()*Math.PI,(Math.random()*0.2)-0.1);

			THREE.GeometryUtils.merge(allTrees, mesh);
			
		}
			
		trees = new THREE.Mesh( allTrees, material );
		scene.add(trees);
		trees.frustumCulled = false;

	}

	var generateTexture = function () {

		var canvas = document.createElement( 'canvas' );
		canvas.width = 16;
		canvas.height = 16;

		var context = canvas.getContext( '2d' );

		context.fillStyle = "#000000";
		context.fillRect(0,0,16,16);

		return new THREE.Texture(canvas);

	}

	var setupShapes = function () {
		
		//knot
		var spline= new THREE.SplineCurve3([
					new THREE.Vector3(0, 0, 0),
					new THREE.Vector3(-1, 0, 0),
					new THREE.Vector3(-0.75, 0.4, 0),
					new THREE.Vector3(-0.25, 0.4, 0),
					new THREE.Vector3(0, 0, 0),
					new THREE.Vector3(1, 0, 0),
					new THREE.Vector3(0.75, 0.4, 0),
					new THREE.Vector3(0.25, 0.4, 0),
					new THREE.Vector3(0, 0, 0) ]);

		var knot = new THREE.TubeGeometry(spline, 20, 0.2, 2, true, false);
		for (var i = 0; i < knot.faces.length; i++) {
			knot.faces[i].materialIndex = 1;
		}
		knotMesh = new THREE.Mesh(knot);

		// star
		var star = new THREE.IcosahedronGeometry(0.4, 1);
		for (var i = 0; i < star.vertices.length; i++) {
			if (i<12) {
				star.vertices[i].multiplyScalar(1.5);
			}					
		}
		for (var i = 0; i < star.faces.length; i++) {
			star.faces[i].materialIndex = 1;
		}
		starMesh = new THREE.Mesh(star);

		// ico ribbon
		var ico = new THREE.IcosahedronGeometry(1);

		for (var i = 0; i < ico.faces.length; i++) {
			ico.faces[i].materialIndex = 1;
		}				

		icoRibbonMesh = new THREE.Mesh(ico);

		// materials
		var packageColors = [0x982a20, 0x9f2c1d, 0xc40e0e, 0xdf3e4d, 0xfff1f1, 0xc9778c, 0x5e1618, 0xd33734, 0x7e3273, 0x3d693a, 0x2f4388, 0xaf8a49, 0xb0aa9f];
		var ribbonColors = [0xbc9645, 0xaba9a6, 0xefeeea, 0x711414, 0x1d4713];

		packageMaterialArray = [];

		for (var i = 0; i < packageColors.length; i++) {
			var t = textures["dirt"+Math.floor( 4*Math.random() )+"_inv"];
			var packageMaterial = new THREE.MeshPhongMaterial( {map: t, color: packageColors[i], specular: 0x666666, shading: THREE.FlatShading} );
			packageMaterialArray.push(packageMaterial);
		}

		ribbonMaterialArray = [];
		ribbonMaterialFlatArray = [];

		for (var i = 0; i < ribbonColors.length; i++) {
			var ribbonMaterial = new THREE.MeshPhongMaterial( {color: ribbonColors[i], specular: 0x888888, shading: THREE.SmoothShading} );
			var ribbonMaterialFlat = new THREE.MeshPhongMaterial( {color: ribbonColors[i], specular: 0x888888, shading: THREE.FlatShading} );

			ribbonMaterialArray.push(ribbonMaterial);
			ribbonMaterialFlatArray.push(ribbonMaterialFlat);
		}


	}

	var changeHouseColorMoveChimney = function () {
		
		var houseColors = [0x8a8780,
						   0x787a77,
						   0x505148,
						   0x9b8a6e,
						   0x7f5253,
						   0x517384,
						   0x8d7b63,
						   0x3f150d,
						   0x302627,
						   0x532124,								   
						   ];

		var chimneyColors = [0xffa46d,
							 0xe5e5e5,
							 0xf8e3ab,
							 0xacacac,
							 0xd18f66,
							 ];

		var color = new THREE.Color( houseColors[Math.floor(Math.random()*houseColors.length)] );
		roof.material.color = color;
		house.material.color = color;

		color = new THREE.Color( chimneyColors[Math.floor(Math.random()*chimneyColors.length)] );
		chimney.material.color = color;


		chimneyBody.position.set( Math.random()*48-24, 14, 0 );
		chimney.position.copy( chimneyBody.position );
		chimney.quaternion.copy( chimneyBody.quaternion );

		chimney.position.y -= 0.25;


	}

	var gotoNewHouse = function () {

		var angle = toStandardAngle( getAngle(offset.x, offset.z, offset2.x, offset2.z) * 180 / Math.PI );

		var newx = 0; 
		var newz = 0; 
		var newy = 130; 

		// x or z?
		if (Math.random() < 0.5) {
			// x
			newx = 1;
			if (Math.random() < 0.5) newx = -1;
		} else {
			// z
			newz = 1;
			if (Math.random() < 0.5) newz = -1;					
		}

		if (angle >= 90 && angle < 270 && newz == 1) {
			newz = 1;
		}
		if ((angle >= 270 || angle < 90) && newz == -1) {
			newz = 1;
		}
		if (angle >= 0 && angle < 180 && newx == -1) {
			newx = 1;
		}
		if (angle >= 180 && angle <= 360 && newx == 1) {
			newx = -1;
		}

        var targetTweenY = new TWEEN.Tween( cameraTarget )
            .to( { y: newy }, 5000 )
            .easing( TWEEN.Easing.Quadratic.InOut );
    	targetTweenY.start();

       var targetTweenXZ = new TWEEN.Tween( cameraTarget )
            .to( { x: newx*300, z: newz*300 }, 6000 )
            .easing( TWEEN.Easing.Quadratic.In );
    	targetTweenXZ.start();

        var mouseZtween = new TWEEN.Tween( mouse )
            .to( { z: 0 }, 1500 )
            .easing( TWEEN.Easing.Quadratic.In );
    	mouseZtween.start();

    	var positionTween = new TWEEN.Tween( camPos )
            .to( { x: newx*200, z: newz*200 }, 5000 )
            .delay(1000)
            .easing( TWEEN.Easing.Quadratic.In )
            .onComplete(function () {
            	moveAndThenBack(newx, newz);
            });
    	positionTween.start();

    	var positionTweenY = new TWEEN.Tween( camPos )
            .to( { y: newy-40 }, 5000 )
            .delay(1000)
            .easing( TWEEN.Easing.Quadratic.InOut );
    	positionTweenY.start();

		isTraveling = true;

		snow2.visible = true;
		snow2.position.x = newx*400;
		snow2.position.z = newz*400;

		spriteClouds2.visible = true;
		spriteClouds2.position.x = newx*400;
		spriteClouds2.position.z = newz*400;

		uniformsClouds2.globalAlpha.value = 0.0;

		var alphaTween = new TWEEN.Tween( uniformsClouds2.globalAlpha )
            .to( { value: 1.0 }, 4000 )
            .easing( TWEEN.Easing.Quadratic.InOut );
    	alphaTween.start();

	}

	var moveAndThenBack = function (newx, newz) {

		snow2.visible = false;

		removeAll();
		changeHouseColorMoveChimney();

		cameraTarget.x = newx*-100;
		cameraTarget.z = newz*-100;

		spriteClouds2.position.x = 0;
		spriteClouds2.position.z = 0;

		spriteClouds.position.x = newx*-400;
		spriteClouds.position.z = newz*-400;


        var targetTweenY = new TWEEN.Tween( cameraTarget )
            .to( { y: 0 }, 6000 )
            .easing( TWEEN.Easing.Quadratic.InOut );
    	targetTweenY.start();

       var targetTweenXZ = new TWEEN.Tween( cameraTarget )
            .to( { x: 0, z: 0 }, 3000 )
            .easing( TWEEN.Easing.Quadratic.Out );
    	targetTweenXZ.start();

		camPos.x = newx*-200;
		camPos.z = newz*-200;

    	var positionTween = new TWEEN.Tween( camPos )
            .to( { x: chimney.position.x, z: chimney.position.z }, 6000 )
            .easing( TWEEN.Easing.Quadratic.Out );
    	positionTween.start();

    	var positionTweenY = new TWEEN.Tween( camPos )
            .to( { y: 0 }, 6000 )
            .easing( TWEEN.Easing.Quadratic.InOut );
    	positionTweenY.start();


        var mouseZtween = new TWEEN.Tween( mouse )
            .to( { z: 1 }, 2000 )
            .delay(2000)
            .easing( TWEEN.Easing.Quadratic.In )
            .onComplete(function () {
            	isTraveling = false;
		    	elapsedTime = 0;
				spriteClouds.position.x = 0;
				spriteClouds.position.z = 0;
            	spriteClouds2.visible = false;
       			uniformsClouds2.globalAlpha.value = 0.0;
            });		            
    	mouseZtween.start();
			
	}


    var setTargetDirection = function (targetVec) {
        var vector = targetVec;
        targetVec.set(mouse.x*0.6,0,1);
        projector.unprojectVector(vector, camera);
        var ray = new THREE.Ray(cameraContainer.position, vector.sub(cameraContainer.position).normalize() );
        targetVec.x = ray.direction.x;
        targetVec.y = ray.direction.y;
        targetVec.z = ray.direction.z;
    }

	var addPackage = function () {

		if (time < lastDelivery+30) return;

		lastDelivery = time;

		var x = cameraContainer.position.x + Math.random()*6 - 3;
		var y = cameraContainer.position.y + Math.random()*4 - 6 + mouse.y*5;
		var z = cameraContainer.position.z + Math.random()*6 - 3;

		var sizex = 0.2+Math.random()*1.5;
		var sizey = 0.2+Math.random()*1.5;
		var sizez = 0.2+Math.random()*1.5;

		var type = 0;
		if (Math.random() > 0.8) {
			type = 1;
			sizex *= 1.2;
		}

		var mesh = getPackage(sizex, sizey, sizez, type);
		mesh.useQuaternion = true;
		scene.add( mesh );
		meshes.push( mesh );

		var mass = sizex*sizey*sizez;
		var shape;
		if (type == 0) {
			shape = new CANNON.Box(new CANNON.Vec3(sizex,sizey,sizez));
	
		} else if (type == 1) {
			shape = new CANNON.Sphere( sizex );
		}
		var body = new CANNON.RigidBody( mass, shape, packageBodyMaterial );
		body.quaternion.set( Math.random() * 0.1, Math.random() * 0.1, Math.random() * 0.1, Math.random() * 0.1 );
		world.add( body );

		body.addEventListener("collide",function(e){
			if (e.with == roofBody || e.with == chimneyBody) {
				if (body.velocity.y < -40 && windSound && lastDropSound+110 < time ) {
					var pos = new THREE.Vector3().copy(camPos);
					pos.sub(offset).normalize();
					var extra = Math.min(1, body.mass)/15;
					var r = Math.floor(Math.random()*4);
					WebAudio.startSound( {name: "thud"+r, volume: 0.15+extra, position: pos} );
					lastDropSound = time;
				};
			}
		});

		
		setTargetDirection(targetVector);
		var velo = 4+Math.random()*8;
		if (mouse.x > 0) velo += (1+mouse.x*5);

		body.velocity.set(targetVector.x * velo*3,
                                (velo*(1+Math.random()+mouse.y)),
                                targetVector.z * velo*3);

		targetVector.multiplyScalar(5);

		body.position.set( x+targetVector.x, y+targetVector.y, z+targetVector.z );

		bodies.push( body );

		++firedPackages;

		updateScore();

	}

	var getPackage = function (sx, sy, sz, type) {
		
		// type 0 = cube, type 1 = sphere

		if (type == 0 || type == undefined) {

			var cube = new THREE.CubeGeometry(sx*2,sy*2,sz*2);

			for (var i = 0; i < cube.faces.length; i++) {
				cube.faces[i].materialIndex = 0;
			}

			// ribbon
			var wp = 0.15;
			var width = sx;
			if (sz < sx) width = sz;
			var cubeX = new THREE.CubeGeometry((width*2)*wp,sy*2,sz*2);
			var cubeZ = new THREE.CubeGeometry(sx*2,sy*2,(width*2)*wp);

			for (var i = 0; i < cubeX.faces.length; i++) {
				cubeX.faces[i].materialIndex = 1;
			}				
			for (var i = 0; i < cubeZ.faces.length; i++) {
				cubeZ.faces[i].materialIndex = 1;
			}

			var mx = new THREE.Mesh(cubeX);
			var mz = new THREE.Mesh(cubeZ);
			mx.scale.multiplyScalar( 1.02 );
			mz.scale.multiplyScalar( 1.02 );

			THREE.GeometryUtils.merge(cube, mx);
			THREE.GeometryUtils.merge(cube, mz);

			var ribbonShading = "smooth";

			if (Math.random() < 0.5) {

				var size = sx;
				if (sz < sx) size = sz;

				// knot
				knotMesh.scale.set(1,1,1);
				knotMesh.scale.multiplyScalar( 0.95*size );
				knotMesh.position.y = sy+0.1;
				knotMesh.rotation.y = Math.random()*1.0 - 0.5;

				THREE.GeometryUtils.merge(cube, knotMesh);

				if (Math.random() < 0.5) {
					knotMesh.rotation.y += (Math.PI*0.5) + (Math.random()*1.0 - 0.5);
					THREE.GeometryUtils.merge(cube, knotMesh);
				}


			} else {

				// star
				var size = sx;
				if (sz < sx) size = sz;
				starMesh.scale.set(1*size,0.6*size,1*size);
				starMesh.position.y = sy;
				THREE.GeometryUtils.merge(cube, starMesh);
				ribbonShading = "flat";

			}

			var packageMaterial = packageMaterialArray[Math.floor( packageMaterialArray.length*Math.random() )];
			var ribbonMaterial;
			if (ribbonShading == "smooth") {
				ribbonMaterial = ribbonMaterialArray[Math.floor( ribbonMaterialArray.length*Math.random() )];
			} else {
				ribbonMaterial = ribbonMaterialFlatArray[Math.floor( ribbonMaterialFlatArray.length*Math.random() )];
			}

			var material = new THREE.MeshFaceMaterial( [packageMaterial, ribbonMaterial] );

			var mesh = new THREE.Mesh(cube, material);

			return mesh;

		} else {

			var ico = new THREE.IcosahedronGeometry(sx);

			// ribbon
			icoRibbonMesh.scale.set((sx+0.1)*0.15,sx+0.1,sx+0.1);
			THREE.GeometryUtils.merge(ico, icoRibbonMesh);
			icoRibbonMesh.scale.set(sx+0.1,sx+0.1,(sx+0.1)*0.15);
			THREE.GeometryUtils.merge(ico, icoRibbonMesh);

			var packageMaterial = packageMaterialArray[Math.floor( packageMaterialArray.length*Math.random() )];
			var ribbonMaterial = ribbonMaterialArray[Math.floor( ribbonMaterialArray.length*Math.random() )];
			
			var material = new THREE.MeshFaceMaterial( [packageMaterial, ribbonMaterial] );

			var mesh = new THREE.Mesh(ico, material);

			return mesh;

		}



	}

	var deliverPackage = function (index) {
	
		var mesh = meshes[ index ];
		var body = bodies[ index ];

		meshes.splice(index,1);
		bodies.splice(index,1);

		world.remove( body );	

        var xzTween = new TWEEN.Tween( mesh.position )
            .to( { x: chimney.position.x, z: chimney.position.z }, 200 )
            .easing( TWEEN.Easing.Quadratic.Out );
    	xzTween.start();

        var rotationTween = new TWEEN.Tween( mesh.quaternion )
            .to( { x: 0, y: 0, z: 0, w: 1 }, 200 )
            .easing( TWEEN.Easing.Quadratic.In );
    	rotationTween.start();

        var yTween = new TWEEN.Tween( mesh.position )
            .to( { y: 16 }, 200 )
            .easing( TWEEN.Easing.Quadratic.In )
            .delay(50)
            .onComplete(function () {
            	scene.remove( mesh );
            	if (windSound) {
            		var pos = {x:Math.cos( time * 0.0005 ), y:-1, z:Math.sin( time * 0.0005 )};
            		WebAudio.startSound( {name: "ding", volume: 0.25, position: pos} );
            	}
            });
    	yTween.start();

    	++deliveredPackages;

    	updateScore();

	}

	var updateScore = function () {

		document.getElementById('hud').children[1].innerHTML = deliveredPackages+" / "+firedPackages;

	}

	var removePackage = function () {

		scene.remove( meshes.shift() );
		world.remove( bodies.shift() );

	}

	var removeAll = function () {

		for ( var i = 0; i < meshes.length; i ++ ) {

			var mesh = meshes[ i ];
			var body = bodies[ i ];

			scene.remove( mesh );
			world.remove( body );

		}

		meshes.length = 0;
		bodies.length = 0;

	}

	// render
	var animate = function () {
		
		requestAnimationFrame( animate );

		if ( (isMouseDown || isTouchButtonDown) && !isTraveling ) {

			if ( meshes.length > 100 ) {

				removePackage();

			}

			addPackage();

		}

		render();

	}

	var render = function () {
		
		time = Date.now();
		delta = time - oldTime;
		oldTime = time;

		if (isNaN(delta) || delta > 1000 || delta == 0 ) {
			delta = 1000/60;
		}

		elapsedTime += delta;

		if (elapsedTime > 17500 && !isTraveling) {
			gotoNewHouse();
		}

		mouse.x *= mouse.z;
		mouse.y *= mouse.z;

		TWEEN.update();

		uniformsFog.globalTime.value += delta * 0.00002;
		uniformsSnow.globalTime.value += delta * 0.00008;


		offset.x = Math.sin( time * 0.0005 ) * 40;
		offset.z = Math.cos( time * 0.0005 ) * 40;
		offset.y = 40 + Math.sin( time * 0.0008 )*10;

		offset2.x = Math.sin( time * 0.0007 ) * 10;
		offset2.z = Math.cos( time * 0.0007 ) * 10;

		cameraContainer.position.set(camPos.x+offset.x, camPos.y+offset.y, camPos.z+offset.z);

		camLook.set(cameraTarget.x+offset2.x, cameraTarget.y+offset2.y, cameraTarget.z+offset2.z);

		cameraContainer.lookAt( camLook );

		camera.rotation.y += (-Math.PI-mouse.x - camera.rotation.y)/12;
		camera.rotation.x += (-(mouse.y+0.2)*0.9 - camera.rotation.x)/12;


		camera.up.x = -mouse.x;

		world.step( ( delta ) * 0.001 );

		for ( var i = 0; i < meshes.length; i ++ ) {

			var mesh = meshes[ i ];
			var body = bodies[ i ];

			mesh.position.copy( body.position );
			mesh.quaternion.copy( body.quaternion );

			if (mesh.position.y < -50) {

				scene.remove( mesh );
				world.remove( body );	

				meshes.splice(i,1);
				bodies.splice(i,1);
						
			}

			// into chimney
			if (mesh.position.y > 17 && mesh.position.y < 19 ) {
				if (mesh.position.x > chimney.position.x-1.5 && mesh.position.x < chimney.position.x+1.5) {
					if (mesh.position.z > chimney.position.z-1.5 && mesh.position.z < chimney.position.z+1.5) {
						deliverPackage(i);
					}
				}
			}

		}

		if (windSound != null) {
			var x = Math.sin(time*0.0003);
			var z = Math.cos(time*0.0003);
			var y = Math.cos(time*0.0001);
			windSound.pan.setPosition(x, y, z);

			var v = (camPos.y/100)*0.3;

			windSound.gain.value = 0.2+v;
				
		}


		if (has_gl) {

			skybox.position = cameraContainer.position;

			if (!tabletDevice && !ie && doPostprocessing) {
				depthPassPlugin.enabled = true;
				if (trees) {
					spriteFog.visible = false;
					trees.visible = false;	
					skybox.visible = false;	
					spriteClouds.visible = false;
					var s2 = spriteClouds2.visible;
					spriteClouds2.visible = false;
				}

				renderer.render( scene, camera, composer.renderTarget2, true );

				depthPassPlugin.enabled = false;
				if (trees) {
					spriteFog.visible = true;
					trees.visible = true;
					skybox.visible = true;
					spriteClouds.visible = true;
					spriteClouds2.visible = s2;	
				}

				composer.render();
			} else {
				renderer.clear();
				renderer.render( scene, camera );
			}


		}

	}

	// helpers
	var getAngle = function (x1, y1, x2, y2) {
		var dx = x2 - x1;
		var dy = y2 - y1;
		return Math.atan2(dx,dy);
	}

	var toStandardAngle = function (ang) {
		return (((ang%360)+360)%360);
	}

	// events
	var addEventListeners = function () {

		window.addEventListener( 'resize', onWindowResize, false );

		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'touchmove', onTouchMove, false );
		document.addEventListener( 'mousedown', onMouseDown, false );
		document.addEventListener( 'touchstart', onTouchStart, false );
		document.addEventListener( 'mouseup', onMouseUp, false );
		document.addEventListener( 'touchend', onTouchEnd, false );
		document.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

		if (havePointerLock) {
			document.addEventListener('pointerlockchange', pointerLockChangeCallback, false);
			document.addEventListener('mozpointerlockchange', pointerLockChangeCallback, false);
			document.addEventListener('webkitpointerlockchange', pointerLockChangeCallback, false);
		}			
	}


	var onWindowResize = function ( event ) {

		var w = window.innerWidth/scaleRatio;
		var h = window.innerHeight/scaleRatio;

		renderer.setSize( w, h );

		camera.aspect = w / h;
		camera.updateProjectionMatrix();

		uniformsSnow.baseSize.value = Math.min( Math.max(8, (w*h)*0.00001), 16) / scaleRatio;

		if (blackCover) {

			blackCover.position.set( w/2, h/2, 0 );
			blackCover.scale.set( window.innerWidth, window.innerHeight, 1 );

		}

		if (cross) {
			cross.position.set( w/2, h/2, 0 );
		}

		if (tabletDevice && w < 1000) {
			var button = document.getElementById('touchimage');
			var size = Math.max( w/3, 80);
			button.width = button.height = size;
		}

		if (!tabletDevice && !ie && doPostprocessing) {

			depthTarget = new THREE.WebGLRenderTarget( w, h, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat } );
			
			fxaa.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
			ssao.uniforms[ 'size' ].value.set( w, h );

			depthPassPlugin.renderTarget = depthTarget;
			ssao.uniforms[ 'tDepth' ].value = depthTarget;

			composer.reset();

		}
		
		if (scaleRatio > 1) {
			renderer.domElement.style.webkitTransform = "scale3d("+scaleRatio+", "+scaleRatio+", 1)";
			renderer.domElement.style.webkitTransformOrigin = "0 0 0";
			renderer.domElement.style.transform = "scale3d("+scaleRatio+", "+scaleRatio+", 1)";
			renderer.domElement.style.transformOrigin = "0 0 0";				
		}

	}


	var tryPointerLock = function () {
		
		container.requestPointerLock = container.requestPointerLock || container.mozRequestPointerLock || container.webkitRequestPointerLock;
		container.requestPointerLock();

	}

	var pointerLockChangeCallback = function (event) {

		if (document.pointerLockElement == container || document.mozPointerLockElement == container || document.webkitPointerLockElement == container) {

			isPointerLocked = true;
			cross.visible = true;

		} else {
			
			isPointerLocked = false;
			cross.visible = false;

		}

	}

	var onMouseMove = function ( event ) {

		event.preventDefault();

		if (isPointerLocked) {

			var mx = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
			var my = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

			mouse.x += mx*0.002;
			mouse.y -= my*0.002;

			if (mouse.x < -1) mouse.x = -1;
			if (mouse.x > 1) mouse.x = 1;
			if (mouse.y < -1) mouse.y = -1;
			if (mouse.y > 1) mouse.y = 1;

			return;
		}

		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	}


	var onTouchMove = function (event) { 

		event.preventDefault();

		for (var i = 0; i < event.changedTouches.length; i++) {

			var tx = ( event.changedTouches[i].clientX / window.innerWidth ) * 2 - 1;
			var ty = - ( event.changedTouches[i].clientY / window.innerHeight ) * 2 + 1;

			if (event.changedTouches[i].target.id == "touchimage") {
				continue;
			}

			mouse.x = tx;
			mouse.y = ty;

		}

	}

	var onMouseDown = function ( event ) {

		if (event.target.id == "soundimage") {
			toggleSound();
			return;
		}

		event.preventDefault();

		isMouseDown = true;

		if (havePointerLock && !isPointerLocked) {
			tryPointerLock();
			return;
		}

	}

	var onMouseUp = function ( event ) {

		isMouseDown = false;

	}

	var onTouchStart = function ( event ) {

		event.preventDefault();

		if (event.target.id == "soundimage") {
			toggleSound();
			return;
		}

		if (event.target.id == "touchimage") {
			isTouchButtonDown = true;
			document.getElementById('touchimage').src = "assets/button_over.png";
			return;
		}

		for (var i = 0; i < event.changedTouches.length; i++) {

			mouse.x = ( event.changedTouches[i].clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( event.changedTouches[i].clientY / window.innerHeight ) * 2 + 1;
		
		}

	}

	var onTouchEnd = function ( event ) {

		event.preventDefault();

		if (event.target.id == "touchimage") {
			isTouchButtonDown = false;
			document.getElementById('touchimage').src = "assets/button.png";
			return;
		}

	}

	return fps;

})();