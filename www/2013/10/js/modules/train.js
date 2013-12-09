/**
 * Created by nico on 06/12/13.
 */
var Train = function( bodyMass, wheelMass, offset )
{
	this.bodyMass = bodyMass;
	this.wheelMass = wheelMass;
	this.offset = offset;


	this.started = false;

	this.wagons = [];
	this.loco = null;
	this.buildLocomotive();

	this.buildWagon( this.offset );
	this.buildWagon( this.offset );
	this.buildWagon( this.offset );
//	this.buildWagon( this.offset );




}

Train.prototype =
{

	buildLocomotive : function()
	{

		this.loco = Factory.getModule( this.bodylMass, this.offset );
		Factory.locomotive( this.loco, this.wheelMass );

//		this.loco.body.material = Materials.getRandomMaterial( Materials.TRANSPARENT );

		var b = this.loco.body;

		var m = Geom.getStandardMesh( Geom.box,Materials.SHINY, false  );
		m.position.x -= H/2 - 2;
		m.position.y = H/2;
		m.scale.set( 18, 5, 10 );
		this.loco.body.add( m );

		var c = Geom.getStandardMesh( Geom.cylinder,Materials.SHINY, false  );
		c.position.x -= m.position.x + 2;
		c.position.y = H;
		c.rotation.z = PI / 2;
		c.scale.set( 10, 20, 10 );
		this.loco.body.add( c );



		var ch = Geom.getStandardMesh( Geom.cylinder,Materials.SHINY, false  );
		ch.position.x -= H * 1.5;
		ch.position.y = H * 2;
		ch.scale.set( 5, 10, 5 );
		this.loco.body.add( ch );



		var ca = Geom.getStandardMesh( Geom.box,Materials.SHINY, false  );
		ca.position.x = H;
		ca.position.y = H * 2;
		ca.scale.set( 10, 7.5, 7.5 );
		this.loco.body.add( ca );

		var hc = Geom.getStandardMesh( Geom.roof, Materials.SHINY, true  );
		hc.material.side = THREE.DoubleSide;
		hc.scale.set( 1.05 * SCALE, SCALE * 1.25, 1.05 * SCALE );
		hc.position.x += H;
		hc.position.y = H ;
		hc.rotation.x = -PI / 2;
		hc.rotation.z = PI / 2;
		this.loco.body.add( hc );



		c.material.color.setHex( m.material.color.getHex() );
//		ch.material.color.setHex( m.material.color.getHex() );
//		ca.material.color.setHex( m.material.color.getHex() );
//		hc.material.color.setHex( m.material.color.getHex() );

		this.wagons.push( this.loco );
		this.shadows( SHADOWS );
		this.offset.x += 20;

	},

	buildWagon : function( offset, rot )
	{
		offset = offset || this.offset;
		var wag = Factory.getModule( this.bodylMass, offset, rot )
		Factory.wagon( wag, this.wheelMass);
		Factory.bind( this.wagons[ this.wagons.length -1 ], wag );
		this.wagons.push( wag );

		Factory.bidule( wag );

		if( Math.random() >.75 )
		{
			Factory.propeller( wag );
		}

		if( Math.random() > .75 )
		{
			new Satellite( wag.body, 10 + rnd(5), Geom.sphere_1, Materials.BUBBLE, 1+rnd(2), "x" );
			new Satellite( wag.body, 10 + rnd(5), Geom.sphere_1, Materials.SHINY, 1+rnd(2), "y" );
			new Satellite( wag.body, 10 + rnd(5), Geom.sphere_1, Materials.BASE, 1+rnd(2), "z" );
		}

//		this.shadows( SHADOWS );
		offset.x += 15;

	},


	pop : function( pop )
	{
		pop = pop || true;
		if( this.wagons.length == 1 && pop )return;
		var mod = this.wagons[this.wagons.length - 1];
		Factory.unbind( this.wagons[this.wagons.length - 2], mod )
		scene.removeConstraint( mod.wheels[0].constraint );
		scene.removeConstraint( mod.wheels[1].constraint );
		if( pop ) this.wagons.pop();
	},

	append : function()
	{

		var last = this.wagons[ this.wagons.length - 1 ].body;
		var d = new THREE.Vector3( 15, 0, 0 ).applyMatrix4( last.matrix );
		this.buildWagon( d, last.rotation );

//		//pos
//		var last = this.wagons[ this.wagons.length - 1 ].body.position;
//		var prev = this.wagons[ this.wagons.length - 1 ].body.position;
//		if( this.wagons.length > 1 )
//		{
//			prev = this.wagons[ this.wagons.length - 2 ].body.position;
//		}
//		var pos = prev.sub( last );
//		return pos;

	},

	update : function(t){	this.wagons.forEach( function( w ){w.update(t); } );},
	start : function(){		this.started = true;    this.wagons.forEach( function( w ){w.start(); } );},
	stop : function(){		this.started = false;   this.wagons.forEach( function( w ){w.stop(); } );},

	reset : function()
	{

		var i = 4;
		while( i-- )this.pop(false);

		for( var i = 0; i < this.wagons.length; i++ )
		{


			var wag = this.wagons[ i ];
			wag.wheels.forEach(function( w ){

				scene.removeConstraint( w.constraint );
				scene.remove( w );

			});
			if( i > 1 ) Factory.unbind( this.wagons[this.wagons.length - 2], this.wagons[this.wagons.length -  1] )

			scene.remove( this.wagons[ i ].body );

		}


        this.offset.set( 0,0,0 );
		this.wagons = [];
		this.loco = null;
		this.buildLocomotive();
		loco = this.loco;
		train = this;
		spring.target = loco.body;

		this.buildWagon( this.offset );
		this.buildWagon( this.offset );
		this.buildWagon( this.offset );
	//	this.buildWagon( this.offset );

		return
		this.wagons = [ this.loco ];

		var ZERO = new THREE.Vector3();
		this.offset = new THREE.Vector3( 0,H,0 );
		this.loco.body.position.copy( this.offset );
		this.loco.body.__dirtyPosition = true;

		var t = WHEEL_THICKNESS;
		for( i = 0; i < this.loco.wheels.length; i++ )
		{
			var w = this.loco.wheels[ i ];
			var front = ( i < 2 ) ? true : false;
			var right = ( i % 2 != 0 ) ? true : false;

			var pos = new THREE.Vector3(     this.loco.body.position.x + ( front ? -H * 2 : H ),
											 this.loco.body.position.y ,
										     this.loco.body.position.z + ( right ? -H - t : H + t ) );
			w.position.copy( pos );
			w.__dirtyPosition = true;

		}

		for( i = 0; i < 3; i++ )
		{

		}

//		this.offset.x = 20;
//		this.buildWagon( this.offset );
//		this.buildWagon( this.offset );
//		this.buildWagon( this.offset );
		return;

		for( i = 0; i < this.wagons.length; i++  )
		{
			this.offset.x += 20;
			var wag = this.wagons[ i ];
			wag.body.position.copy( this.offset );
			wag.body.__dirtyPosition = true;

			wag.wheels.forEach( function( w )
			{
				var pos = new THREE.Vector3(     wag.body.position.x,
												 wag.body.position.y ,
											     wag.body.position.z + ( right ? -H - t : H + t ) );
				w.position.copy( pos );
				w.position.copy( pos );
				w.__dirtyPosition = true;
			})

		}


	},

	shadows : function( value )
	{
		this.wagons.forEach( function( w )
		{
			w.body.castShadow = value || false;

			w.meshes.forEach( function( m )
			{
				m.castShadow = value || false;
			})
		})
	}


	/*


//		loco.start();
	offset.x += 20;
	var wag = Factory.getModule( bodylMass, offset, null, sca )
	Factory.wagon(wag, wheelMass);
	boxes.push( wag );
	Factory.bind( loco.body, wag.body );
//		wag.start();

	offset.x += 20;
	var wag2 = Factory.getModule( bodylMass, offset, null, sca )
	Factory.wagon(wag2, wheelMass);
	boxes.push( wag2 );
	Factory.bind( wag.body, wag2.body );
//		wag2.start();

	Factory.propeller( wag );
	Factory.propeller( wag2 );

	offset.x += 20;
	var wag3 = Factory.getModule( bodylMass, offset, null, sca )
	Factory.wagon(wag3, wheelMass);
	boxes.push( wag3 );
	Factory.bind( wag2.body, wag3.body );

//*/

}