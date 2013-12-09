
	var Main = {};//GLOBAL HOLDER

	var container,

		camera,
		spring,
		scene,
		renderer,

		directionalLight,
		pointLight,

		train,
		loco,

		mouseX = 0,
		mouseY = 0,
		posMultiplier = 0.5,
		windowHalfX = window.innerWidth / 2,
		windowHalfY = window.innerHeight / 2,

		UP = 0,
		DOWN = 1,
		LEFT = 2,
		RIGHT = 3,
		keymap = [
			false,  /*up*/
			false,  /*down*/
			false,  /*left*/
			false  /*right*/
		],
		mouseDown = false,
		reset = false,
		started = false,

		objects = [],

		//CONSTANTS
		PI = Math.PI,
		PI2 = PI * 2,
		D2R = Math.PI / 180,

		SHADOWS = false;
		mouse_position = new THREE.Vector3()
		postProcess = true;
		;

		init();

	function init()
	{

		Physijs.scripts.worker = './js/physi/physijs_worker.js';
		Physijs.scripts.ammo = './ammo.js';

		container = document.getElementById( 'webgl' );

		camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 5000 );
		camera.position.set( 0,5,0 );
		spring = new SpringCamera( camera, null, 80 );
		Main.camera = camera;

		//SCENE

		scene = new Physijs.Scene;
		scene.fog = Materials.whiteFog;
		Main.scene = scene;

		//RENDER

		renderer = new THREE.WebGLRenderer( { antialias:true } );
		renderer.setClearColor( 0xffFFFF, 1 );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.autoClear = false;
		renderer.shadowMapEnabled = true;
		renderer.shadowMapSoft = true;
		container.appendChild( renderer.domElement );

		//COMPOSER

		composer.init( renderer, scene, camera );

		//LISTENERS

		document.addEventListener('mousedown', onDocumentMouseDown, false);
		document.addEventListener('mouseup', onDocumentMouseUp, false);
		document.addEventListener('mousemove', onDocumentMouseMove, false);

		document.addEventListener( 'keyup',onKeyUp, false );
		document.addEventListener( 'keydown', onKeyDown, false );

		window.addEventListener( 'resize', onWindowResize, false );


//		// LIGHTS
		var ambient = new THREE.AmbientLight( 0xFFFFFF );
		scene.add( ambient );

		var total = 3;
		var step = Math.PI * 2 / total;
		for( var i = 0; i < 3; i++ )
		{

			pointLight = new THREE.PointLight( 0xffffff, .85 );
			pointLight.position.x = Math.cos( i * step ) * 1000;
			pointLight.position.y = 1500;
			pointLight.position.z = Math.sin( i * step ) * 10000;
			scene.add( pointLight );

		}
///*
		//SPOT
		directionalLight = new THREE.DirectionalLight( 0xCCCCEE, 1.5 );
		directionalLight.position.set( 250, 500,150);
		directionalLight.castShadow = true;
		var camShadowBound = 150;
		directionalLight.shadowCameraLeft = -camShadowBound;
		directionalLight.shadowCameraTop = -camShadowBound;
		directionalLight.shadowCameraRight = camShadowBound;
		directionalLight.shadowCameraBottom = camShadowBound
		directionalLight.shadowCameraNear = 1;
		directionalLight.shadowCameraFar = 1500;
		directionalLight.shadowBias = .002
		directionalLight.shadowMapWidth = pointLight.shadowMapHeight = 2048;
		directionalLight.shadowDarkness = .5;
		scene.add( directionalLight );
//*/
		var steps = 10;
		var out = "";
		for( var i = 0; i < steps; i++)out += "" + ( i/steps ).toFixed(2) + " ";
		out += "1";
//		console.log( out )

		//mouse
		projector = new THREE.Projector();


		// MATERIALS
		var materials = new Materials();

		// PHYSICS
		var ground = new Physijs.BoxMesh(new THREE.CubeGeometry( 100, 100, 100, 10,1,10 ), Materials.groundMaterial, 0 );
		ground.position.set( 0, -50, 0 );
		ground.scale.set( SCALE * 10,1,SCALE * 10);
		ground.receiveShadow = true;
		scene.add( ground );


		TRAIN_SPEED_DEST = 4;
		TRAIN_ROTATION_DEST = -.45;

		scene.setGravity(new THREE.Vector3( 0, -50, 0 ));

		bodylMass = 2000;
		wheelMass = 1000;

		var offset = new THREE.Vector3 ( -20, 0, 25 );

		train = new Train( bodylMass, wheelMass, offset );
		loco = train.loco;

		//LANDSCAPE
		for( var i = 0; i < 50; i++  )
		{

			var angle = Math.random() * Math.PI * 2;
			var distance = 1000 + Math.random() * 1000;
			var b = new Ball();
			b.position.set( Math.cos( angle )* distance, 0, Math.sin( angle )*distance );
			b.scale.set( 100, 20 + Math.random() * 20, 100 );
			scene.add( b );

		}
		for( var i = 0; i < 50; i++  )
		{

			var angle = Math.random() * Math.PI * 2;
			var distance = 400 + Math.random() * 600;
			var b = new THREE.Mesh( Geom.cone, Materials.getStandardMaterial( Materials.getRandomMaterial() ) );
			b.position.set( Math.cos( angle )* distance, 0, Math.sin( angle )*distance );
			b.scale.set( 100, 30 + Math.random() * 20, 100 );
			scene.add( b );

		}

		new Title( "X,M,A,S", 20, new THREE.Vector3( 0, 10,0 ) );


		render();
		animate();

	}

	function start()
	{
		new TWEEN.Tween( composer ).to( { angle : 0 }, 1000).start();
		spring.target = loco.body;
		started = true;

		SoundManager.CLAP.play();
		SoundManager.POUET.play();
		SoundManager.stop();

		var xp = new Title( "XP", 30, new THREE.Vector3( 0,50, 0 )  );
		for( i = 0; i < 20; i++ )
		{
			var r = 5 + Math.random() * 5;
			var sp = Geom.getMesh( Math.random()>.5 ? Geom.sphere_1 : Geom.cylinder_6, 1000, Materials.getRandomType() );
			sp.scale.set( r, r, r );
			sp.rotation.set( rnd( PI2 ), rnd( PI2 ), rnd( PI2 ) );


//			Materials.friction( sp.material,.1 )
//			Materials.restitution( sp.material,.9 )
			angle = Math.random() * Math.PI * 2;
			distance = 120 + Math.random() * 100;

			var c = new THREE.Vector3( ) ;//loco.body.position
			sp.position.set(    c.x + Math.cos( angle ) * distance,
								50 + Math.random() * 100,
								c.z + Math.sin( angle ) * distance );//Math.sin( angle )*distance );

			scene.add( sp );
			objects.push( sp );
		}

	}

	function animate()
	{

		doTheLoco();

		render();

		requestAnimationFrame( animate );

	}

	function doTheLoco()
	{
		if( reset )
		{
			train.reset();
		}
		if( mouseDown )
		{
			attract();
		}

		TWEEN.update();

		//apply inputs
		if( started )
		{
			if( keymap[ UP ] ||keymap[ RIGHT ] || keymap[ LEFT ])TRAIN_SPEED_DEST += .05;
			if( keymap[ DOWN ] )TRAIN_SPEED_DEST -= .05;
			if( keymap[ RIGHT ] )TRAIN_ROTATION_DEST -= 0.05;
			if( keymap[ LEFT ] )TRAIN_ROTATION_DEST += 0.05;
		}

		//check bound
		if( TRAIN_ROTATION_DEST >  .4 )TRAIN_ROTATION_DEST =  .4;
		if( TRAIN_ROTATION_DEST < -.4 )TRAIN_ROTATION_DEST = -.4;
		if( TRAIN_SPEED_DEST >  MAX_SPEED )TRAIN_SPEED_DEST =  MAX_SPEED;
		if( TRAIN_SPEED_DEST < -MAX_SPEED / 2 )TRAIN_SPEED_DEST = - MAX_SPEED / 2;

		//tween speed
		TRAIN_ROTATION += ( TRAIN_ROTATION_DEST - TRAIN_ROTATION ) * .05;
		if( started ) TRAIN_ROTATION_DEST += -TRAIN_ROTATION_DEST * .05;

		TRAIN_SPEED += ( TRAIN_SPEED_DEST - TRAIN_SPEED ) * .1;
		if( started ) TRAIN_SPEED_DEST += -TRAIN_SPEED_DEST * .005;

//		var vol = ( Math.abs( TRAIN_SPEED / MAX_SPEED ) *.25 );
//		console.log( vol );
//		SoundManager.MUSIC._volume = vol;

		var timer = Date.now() * .001;
		var time = ( Math.sin( timer ) *.5 );
		train.update( time );

		scene.simulate( undefined, 0 );

		spring.update();

		var pos = loco.body.position.clone();
		if( spring.target == null )
		{
			camera.position.x += ( ( mouseX / SCALE ) - camera.position.x ) * .05;
			camera.position.y += ( ( mouseY / SCALE ) - camera.position.y ) * .05;
			camera.position.z = 6 * SCALE;
			if( posMultiplier > .5 ) posMultiplier -= .05;
		}
		else
		{
			if( posMultiplier < 1 ) posMultiplier += .01;
		}
		if( camera.position.y < 25 )camera.position.y = 25;
		if( camera.position.y > 50 )camera.position.y = 50;


//		camera.fov = ( 40 + Math.abs( 20 * TRAIN_SPEED ) ) * D2R;
		//camera.updateProjectionMatrix();

		pos.multiplyScalar( posMultiplier );
		camera.lookAt( pos );

		Satellite.update();

	}

	function render()
	{
		if( composer.angle == 0 )postProcess = false;
		renderer.clear();
		if( postProcess )
		{
			composer.render();
		}
		else
		{
			renderer.render( scene, camera );
		}

	}



	function getWorldMousePosition( evt )
	{

		var vector = new THREE.Vector3( ( evt.clientX / renderer.domElement.clientWidth ) * 2 - 1, -( ( evt.clientY / renderer.domElement.clientHeight ) * 2 - 1 ),.5);
		projector.unprojectVector( vector, camera );
		vector.sub( camera.position ).normalize();
		var coefficient = - camera.position.y / vector.y;
		mouse_position = camera.position.clone().add( vector.multiplyScalar( coefficient ) );
		Main.mouse_position = mouse_position;

	};

	 function attract()
	 {

		if ( !mouse_position ) return;

//		var strength = 20000, distance, effect, offset, box;
//		effect = mouse_position.clone().sub( loco.body.position ).normalize().multiplyScalar( strength );
//		offset = mouse_position.clone().sub( loco.body.position );
//		loco.body.applyImpulse( effect, offset );

		 for( var i = 0; i < objects.length; i++ )
		 {

			 var strength = 10000, distance, effect, offset, box;
			effect = mouse_position.clone().sub( objects[ i ].position ).normalize().multiplyScalar( strength );
			offset = mouse_position.clone().sub( objects[ i ].position );
			 objects[ i ].applyImpulse( effect, offset );
		 }

	};

	//HANDLERS

	function onWindowResize()
	{

		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );

	}

	function onDocumentMouseDown(event)
	{
		mouseDown = true;
	}

	function onDocumentMouseUp(event)
	{
		mouseDown = false;
	}

	function onDocumentMouseMove(event)
	{

		mouseX = ( event.clientX - windowHalfX );
		mouseY = ( event.clientY - windowHalfY );
		getWorldMousePosition( event );

	}

	function freeze( body )
	{
		body.mass = 0;
		console.log( "freeze" )
	}
	function onKeyDown( ev )
	{
//		console.log( ev.keyCode );
		switch( ev.keyCode ) {
			case 66://B

				train.pop();

				break;
			case 67://C
//				Factory.unbind( train.wagons[train.wagons.length - 2], train.wagons[train.wagons.length - 1] )
				train.append();
				break;
			case 37:
				// Left
				keymap[ LEFT ] = true;
				SoundManager.play();
				break;

			case 39:
				// Right
				keymap[ RIGHT ] = true;
				SoundManager.play();
				break;

			case 38:
				// Up
				keymap[ UP ] = true;
				SoundManager.play();
				break;

			case 40:
				// Down
				keymap[ DOWN ] = true;
				SoundManager.play();
				break;
			case 32:
				PROPEL = true;
				break;
		}

	}
	function onKeyUp( ev )
	{
		switch( ev.keyCode )
		{
			case 32:
				PROPEL = false;
				break;
			case 67://C

				break;
			case 82:
				reset = true;
				doTheLoco();
				reset = false;
				break;
			case 83:
				SoundManager.enabled = !SoundManager.enabled ? true : false;
				if( !SoundManager.enabled )
				{
					SoundManager.MUSIC.mute();
				}
				else
				{
					SoundManager.MUSIC.unmute();
				}

				break;

			case 37:
				// Left
				keymap[ LEFT ] = false;
				SoundManager.stop();
				break;

			case 39:
				// Right
				keymap[ RIGHT ] = false;
				SoundManager.stop();
				break;

			case 38:
				// Up
				keymap[ UP ] = false;
				SoundManager.stop();
				break;

			case 40:
				// Down
				keymap[ DOWN ] = false;
				SoundManager.stop();
				break;
		}
	}

//pick mesh ?
	/*initEventHandling = (function () {
	     var _vector = new THREE.Vector3,
	         projector = new THREE.Projector(),
	         handleMouseDown, handleMouseMove, handleMouseUp

	     var cameraLookPosition = new THREE.Vector3();

	     handleMouseDown = function (evt) {
	         var ray, intersections;

	         _vector.set(
	             (evt.clientX / window.innerWidth) * 2 - 1,
	             -(evt.clientY / window.innerHeight) * 2 + 1,
	             1
	         );

	         projector.unprojectVector(_vector, camera);

	         ray = new THREE.Raycaster(camera.position, _vector.sub(camera.position).normalize());
	         intersections = ray.intersectObjects(blocks);

	         if (intersections.length > 0) {
	             selected_block = intersections[0].object;

	             _vector.set(0, 0, 0);
	             selected_block.setAngularFactor(_vector);
	             selected_block.setAngularVelocity(_vector);
	             selected_block.setLinearFactor(_vector);
	             selected_block.setLinearVelocity(_vector);

	             mouse_position.copy(intersections[0].point);
	             block_offset.subVectors(selected_block.position, mouse_position);

	             intersect_plane.position.y = mouse_position.y;

	           //  _controller.enabled = false;

	         }
	     };

	     handleMouseMove = function (evt) {

	         var ray, intersection, i;

	         if (selected_block !== null) {

	             _vector.set(
	                 (evt.clientX / window.innerWidth) * 2 - 1,
	                 -(evt.clientY / window.innerHeight) * 2 + 1,
	                 1
	             );

	             projector.unprojectVector(_vector, camera);

	             ray = new THREE.Raycaster(camera.position, _vector.sub(camera.position).normalize());
	             intersection = ray.intersectObject(intersect_plane);
	             console.log(selected_block._physijs.touches);

	             if (intersection[0] !== undefined)
	                 mouse_position.copy(intersection[0].point);
	         }
	     };

	     handleMouseUp = function (evt) {

	         if (selected_block !== null) {
	             _vector.set(1, 1, 1);
	             selected_block.setAngularFactor(_vector);
	             selected_block.setLinearFactor(_vector);
	             selected_block = null;
	         }

	     };

	     return function () {
	         renderer.domElement.addEventListener('mousedown', handleMouseDown);
	         renderer.domElement.addEventListener('mousemove', handleMouseMove);
	         renderer.domElement.addEventListener('mouseup', handleMouseUp);
	     };
	 })();
//*/
	function lrp( t, a, b ){ return a + ( b - a ) * t; }
	function nrm( t, a, b ){ return ( t - a ) / ( b - a ); }
	function map( t, a, b, c, d ){ return lrp( nrm( t, a, b ), c, d ); }