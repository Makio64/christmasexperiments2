/**
 * Created by nico on 05/12/13.
 */
var SpringCamera = function( camera, target, distance )
{

	this.camera = camera;
	this.distance = distance || 25;
	this.target = target;// || new THREE.Vector3();
	this.pos = new THREE.Vector3();
	this.quat = new THREE.Quaternion();

}
SpringCamera.prototype =
{
	setTarget : function( t )
	{
		this.target = t;
	},
	update : function()
	{
		if( this.target == null )return;

//		var d = this.camera.position.clone();

		var d = new THREE.Vector3( 30 + ( train.wagons.length * 7.5 ) + (MAX_SPEED-TRAIN_SPEED), 25 - mouseY, TRAIN_ROTATION * 200 + mouseX / 100 ).applyMatrix4( this.target.matrix );

//		d.sub( dest );
//		d.normalize();
//		d.multiplyScalar( this.distance );
//		d.add( dest );

		if( d.y < 2.5 ) d.y = 2.5;
		if( d.y > 50 ) d.y = 50;

		this.camera.position.x += ( d.x - this.camera.position.x ) * 0.01;
		this.camera.position.y += ( d.y - this.camera.position.y ) * 0.01;
		this.camera.position.z += ( d.z - this.camera.position.z ) * 0.01;
//		this.camera.lookAt( this.target.position );

	}
}