/**
 * Created by nico on 02/12/13.
 */
var Factory = function( group )
{

	Factory.CENTER       = new THREE.Vector3(  0.0, 0.0, 0.0 );
	Factory.LEFT         = new THREE.Vector3( -H, 0.0, 0.0 );
	Factory.RIGHT        = new THREE.Vector3(  H, 0.0, 0.0 );
	Factory.BACK         = new THREE.Vector3(  0.0, 0.0,-H );
	Factory.FRONT        = new THREE.Vector3(  0.0, 0.0, H );
	Factory.BOTTOM       = new THREE.Vector3(  0.0,-H, 0.0 );
	Factory.TOP          = new THREE.Vector3(  0.0, H, 0.0 );

}

Factory.mat = new THREE.Matrix4();
var SCALE = 10;
var H = 0.5 * SCALE;
var TRAIN_SPEED = 0;
var TRAIN_SPEED_DEST = 0;
var MAX_SPEED = 10;

var TRAIN_ROTATION = 0;
var TRAIN_ROTATION_DEST = 0;
var PROPEL = false;
var MAX_FORCE = 10000;
var WHEEL_THICKNESS = 1;

Factory.getModule = function( mass, pos, rot  )
{

	if( Factory.LEFT == null )new Factory();

	var module = new Module();
	module.body = Geom.getMesh( Geom.plateau, mass, Materials.GLASS );
	module.body.position.copy( pos );
	module.body.position.y += H;

	if( rot != null ) module.body.rotation.copy( rot );

	Main.scene.add( module.body );
/*
	var tot = 1 + Math.random() * 5;
	for( var i = 0; i< tot; i++ )
	{

		var m = Geom.getStandardMesh( Geom.cylinder,Materials.BUBBLE  );
		m.position.y = 5 + i * 10;
		m.rotation.x = ( Math.random() - .5 ) * Math.PI / 20;
		m.rotation.z = ( Math.random() - .5 ) * Math.PI / 20;
		module.body.add( m );
	}
*/


//	module.shadows = true;
	return module;

}


Factory.locomotive = function( mod, mass )
{

	var fr = Geom.getMesh( Geom.wheel, mass * 1.5, Materials.SHINY );
	var fl = Geom.getMesh( Geom.wheel, mass * 1.5, Materials.SHINY );
	var br = Geom.getMesh( Geom.wheel, mass, Materials.SHINY );
	var bl = Geom.getMesh( Geom.wheel, mass, Materials.SHINY );

	var labels = [ "fr", "fl", "br", "bl" ];
	var wheels = [ fr, fl, br,  bl ];

	//thickness
	var t = WHEEL_THICKNESS;

	//radius
	var frad = H * 2;
	var brad = H * 2;
	var eps = 1;


	for( var i = 0; i < wheels.length; i++ )
	{
		var w = wheels[ i ];
		mod.meshes.push( w );

		//positioning the wheel

		var front = ( i < 2 ) ? true : false;
		var right = ( i % 2 != 0 ) ? true : false;

		var pos = new THREE.Vector3(     mod.body.position.x + ( front ? -H * 2 : H ),
										 mod.body.position.y ,//- H,
									     mod.body.position.z + ( right ? -H - t : H + t ) );

		w.scale.set( front ? frad : brad, t, front ? frad : brad );
		w.rotation.set( PI / 2, 0, 0 );
		w.position.copy( pos );

		var ball = Geom.getStandardMesh( Geom.sphere, Materials.SHINY, false );
		ball.scale.set( 1 / frad * 2, 1 / t * 2, 1 / frad * 2 );
		w.add( ball );

		//adding to scene after transform
		Main.scene.add( w );

		//creating constraint

		var cons = new Physijs.DOFConstraint( w, mod.body, pos );
		Main.scene.addConstraint( cons );

		cons.setAngularLowerLimit({ x: 0, y: 0, z: 1 });
		cons.setAngularUpperLimit({ x: 0, y: 0, z: 0 });

		cons.configureAngularMotor( 2, 1, 0, TRAIN_SPEED, MAX_FORCE );

		w.front = front;
		w.right = right;
		w.constraint = cons;
		mod.wheels.push( w );


	};

};

Factory.wagon = function( mod, mass )
{

	var fr = Geom.getMesh( Geom.wheel, mass, Materials.SHINY );
	var fl = Geom.getMesh( Geom.wheel, mass, Materials.SHINY );

	var wheels = [ fr, fl ];

	//thickness
	var t = WHEEL_THICKNESS;
	var radius = H * 1.5;
	for( var i = 0; i < wheels.length; i++ )
	{
		var w = wheels[ i ];
		mod.meshes.push( w );

		//positioning the wheel

		var right = ( i == 0 ) ? true : false;

		Factory.mat.extractRotation( mod.body.matrix );
		var dist = ( right ? -H - t : H + t );
		var v = new THREE.Vector3( 0,0, dist ).applyMatrix4( Factory.mat );

		var angle = Math.PI / 2 + ( right ? Math.PI : 0 );
		var pos = new THREE.Vector3(     mod.body.position.x + v.x,
										 mod.body.position.y + v.y,
									     mod.body.position.z + v.z );

		w.scale.set( radius, t, radius );
		w.rotation.set( PI / 2, angle, 0 );
		w.position.copy( pos );

		var ball = Geom.getStandardMesh( Geom.sphere, Materials.SHINY, false );
		ball.scale.set( 1 / radius * 2, 1 / t * 2, 1 / radius * 2 );
		w.add( ball );

		//adding to scene AFTER transform
		Main.scene.add( w );

		//creating constraint
		var cons = new Physijs.DOFConstraint( w, mod.body, pos );
		Main.scene.addConstraint( cons );

		cons.setAngularLowerLimit( new THREE.Vector3( 0, 0, -PI ) );
		cons.setAngularUpperLimit( new THREE.Vector3( 0, 0,  PI ) );
		cons.configureAngularMotor( 2, 1, 0, TRAIN_SPEED, MAX_FORCE );

		w.front = false;
		w.right = right;
		w.constraint = cons;
		mod.wheels.push( w );

	};


};


Factory.bind = function( m0, m1 )
{

	var joint = new Physijs.ConeTwistConstraint( m0.body, m1.body, m0.body.position );
	Main.scene.addConstraint( joint, false );

	var freedomX = Math.PI / 8;
	var freedomY = Math.PI / 8;
	var freedomZ = Math.PI / 8;

	joint.setLimit( freedomX, freedomY, freedomZ );

	m0.constraints.push( { other:m1, constraint:joint } );

};

Factory.unbind = function( m0, m1 )
{
	m0.constraints.forEach( function( c, i )
	{
		if(c.other == m1 )
		{
			Main.scene.removeConstraint( c.constraint );
			m0.constraints.splice( i, 1 );
			return;
		}
	});

}

Factory.propeller = function( mod )
{

	var axis = Geom.getStandardMesh( Geom.cylinder, Materials.SHINY );
	axis.scale.set( 2,this.top,2 );
	axis.position.y = this.top / 2;

	var pales = [];
	var tot = 5;
	var step = PI2 / tot;
	for( var i = 0; i< tot; i++ )
	{
		var pale =   Geom.getStandardMesh( Geom.sphere_1, Materials.SHINY, false );
		pale.scale.set(.01, .1,.01 );

		pale.rotation.set(  -0.01, -( i * step ), 0  );
		pale.position.set( Math.cos( i * step ) * 3, .5, Math.sin( i * step ) * 3  );

		axis.add( pale );
		pales.push( pale );
		if( i > 0 ) pale.material.color.setHex( pales[ 0 ].material.color.getHex() );
		new TWEEN.Tween( pale.scale ).to( { x:6, y:.1, z:3 }, 500).start();

	}

	var top =   Geom.getStandardMesh( Geom.sphere, Materials.SHINY );
	top.scale.set( 1.5,.25, 1.5 );
	top.position.y = .5;

	axis.add( top );
	top.material.color.setHex( axis.material.color.getHex() );

	mod.body.add( axis );

	var looping = new TWEEN.Tween( axis.rotation ).to( { y : Math.PI * 2 }, 1000).repeat( Infinity );
	looping.start();
	mod.hasPropeller = true;


//	mod.body.applyCentralForce( new THREE.Vector3( 0.01, 1, 0.01 ) );//, new THREE.Vector3(1,1,1) );
//	mod.body.applyForce( new THREE.Vector3( 0,0,0), new THREE.Vector3( 1,1000,1) );

//	mod.body.applyCentralImpulse( new THREE.Vector3( 0,500000,0) );


};
function rnd( max )
{
	return Math.random() * max;
}
function rndi( max )
{
	return parseInt( Math.random() * max );
}
Factory.bidule = function( mod)
{

	var g = new THREE.Object3D();

	var tot = 2 + rndi( 4 );
	var S = SCALE  * 1.5;
	for( var i = 0; i< tot; i++ )
	{
		var o =   Geom.getStandardMesh( Geom.geoms[ rndi( Geom.geoms.length ) ], Materials.list[ rndi( Materials.list.length ) ], false );
		o.scale.set( 10, 10, 10 );
		o.rotation.set(  rnd( PI ), rnd( PI ), rnd( PI ) );
		o.position.set( i * rnd( 1 ), H + i * 5, i * rnd( 1 ) );
		g.add( o );

//		new TWEEN.Tween( o.scale ).to( { x:.05 + rnd( S ), y:.05 + rnd( S ), z:05 + rnd( S ) }, 3000 );
//		var looping = new TWEEN.Tween( o.rotation ).to( { x:PI2 * rnd( 1 ), y:PI2 * rnd( 1 ), z:PI2 * rnd( 1 ) }, 10000 ).repeat( Infinity );
//		looping.start();

	}


	this.top = H + i * 5;
//	var bb = Geom.getMesh( Geom.cylinder, 1000, Materials.TRANSPARENT );
//	bb.scale.set( 10, this.top, 10);
//	bb.position.y = this.top / 2;
//
//	g.scale.set( .10, 1 / this.top, .10);
//	bb.add( g );
	mod.body.add( g );

}