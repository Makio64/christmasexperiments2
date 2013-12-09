/**
 * Created by nico on 02/12/13.
 */
var Satellite = function( parent, radius, type, mat, scale, axis )
{

	if( radius == null )radius = 1;
	if( axis == null )axis = "xyz";

	scale = scale || 1;
	this.angle = new THREE.Euler(   Math.random() * PI2,
									Math.random() * PI2,
									Math.random() * PI2 );


	var speed = ( 1 + Math.random() * 5 ) * Math.PI / 180;
	this.speed = new THREE.Vector3( //speed, speed, speed );
									( 2 + Math.random() * 3 ) * D2R,
									( 2 + Math.random() * 3 ) * D2R,
									( 2 + Math.random() * 3 ) * D2R		);

	if( axis == 'x' )
	{
		this.angle.x = 0, this.angle.y = 1, this.angle.z = 0;
		this.speed.x = this.speed.z = 0;
	}

	if( axis == 'y' )
	{
		this.angle.x = 0, this.angle.y = 0, this.angle.z = 1;
		this.speed.x = this.speed.y = 0;
	}
	//no Z for simplicity


	this.radius = radius;//scale * 2 + Math.random() * scale;

	this.mesh = Geom.getStandardMesh( type, mat );//new THREE.Mesh( new THREE.CylinderGeometry( 2,2,5 ) )
	this.mesh.scale.set( scale, scale, scale );
	parent.add( this.mesh );



	Satellite.offset = Satellite.offset || new THREE.Vector3( 0,20,0 );
	Satellite.pos = Satellite.pos || new THREE.Vector3();
	Satellite.quat = Satellite.quat || new THREE.Quaternion();

	Satellite.instances = Satellite.instances || [];
	Satellite.instances.push( this );

}

Satellite.prototype =
{
	update : function()
	{

		this.angle.x += this.speed.x;
		this.angle.y += this.speed.y;
		this.angle.z += this.speed.z;

		Satellite.pos.set(1,1,0 );
		Satellite.quat.setFromEuler( this.angle );
		Satellite.pos.applyQuaternion( Satellite.quat );
		Satellite.pos.normalize();
		Satellite.pos.multiplyScalar( this.radius );
		Satellite.pos.add( Satellite.offset );
		this.mesh.position.copy( Satellite.pos );
	}
}

Satellite.update = function()
{
	if( Satellite.instances == null )return;
	Satellite.instances.forEach(
		function( s )
		{
			s.update();
		}
	);
}