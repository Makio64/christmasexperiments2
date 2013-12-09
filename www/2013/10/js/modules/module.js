/**
 * Created by nico on 04/12/13.
 */
var Module = function()
{
	this.body = null;

	this.meshes = [];
	this.constraints = [];
	this.wheels = [];

	this.forces = [];
	this.force = new THREE.Vector3( 0,0,0 );
	this.impulses = [];
	this.top = 0;
}

Module.prototype =
{
	update: function( t )
	{

		if( PROPEL && this.hasPropeller )
		{
			this.body.setLinearVelocity( new THREE.Vector3( Math.cos( TRAIN_ROTATION * ( PI / 2 ) * 10 ),
															10,
															Math.sin( TRAIN_ROTATION * ( PI / 2 ) ) * 10 ) );
		}

		this.wheels.forEach( function(w)
		{

			if( w.front )
			{
				w.constraint.setAngularLowerLimit({ x: 0, y: TRAIN_ROTATION * ( PI / 2 ), z: PI2 });
				w.constraint.setAngularUpperLimit({ x: 0, y: TRAIN_ROTATION * ( PI / 2 ), z: -PI2 });
			}

			if( w.right )
			{
				w.constraint.configureAngularMotor( 2, 1, 0, lrp( .5 + TRAIN_ROTATION, TRAIN_SPEED *.75, TRAIN_SPEED ), MAX_FORCE );
			}
			else
			{
				w.constraint.configureAngularMotor( 2, 1, 0, lrp( .5 + TRAIN_ROTATION, TRAIN_SPEED, TRAIN_SPEED *.75 ), MAX_FORCE );
			}
			w.constraint.enableAngularMotor( 2 );

		})

	},
	start : function()
	{
		for( var i =0; i< this.wheels.length; i++  )
		{
			var cons = this.wheels[ i ].constraint;
			if( this.wheels[ i ].front )cons.enableAngularMotor( 1 );
			cons.enableAngularMotor( 2 );
		}
	},
	stop : function()
	{
		for( var i =0; i< this.wheels.length; i++  )
		{
			var cons = this.wheels[ i ].constraint;
			cons.disableAngularMotor( 1 );
			cons.disableAngularMotor( 2 );
		}
	},

	shadows : function( value )
	{
		this.body.castShadow = value || false;
		this.meshes.forEach( function( m )
		{
			m.castShadow = value || false;
		});
	},

	scale : function( x, y, z )
	{

		this.body.scale.set( x, y, z );
		this.body.position.multiply( this.body.scale );
		this.meshes.forEach( function( m )
		{
			m.scale.x *= x;
			m.scale.y *= y;
			m.scale.z *= z;
			m.position.multiply( m.scale );
//			m.position.mult( x, y, z );
		});
	},

	addForce : function( f )
	{
		this.forces.push( f );

		var tmp = new THREE.Vector3();
		this.forces.forEach( function( f )
		{
			tmp.add( f );
		});
		this.force.copy( tmp );
		this.force.mult( 1 / this.forces.length );

	}

}