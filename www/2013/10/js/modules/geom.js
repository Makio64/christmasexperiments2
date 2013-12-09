/**
 * Created by nico on 02/12/13.
 */
var Geom = function(){};

Geom.cube = new THREE.CubeGeometry( 1,1,1,1,1,1 );
Geom.box = new THREE.CubeGeometry( 1,1,1,1,1,1 );
Geom.plateau = new THREE.CubeGeometry( SCALE / 2, 1, SCALE );
Geom.sphere = new THREE.IcosahedronGeometry(.5,3 );
Geom.sphere_1 = new THREE.IcosahedronGeometry(.5,1 );

Geom.wheel = new THREE.CylinderGeometry( .5,.5,1, 12 );
Geom.cylinder = new THREE.CylinderGeometry( .5,.5,1, 32 );
Geom.cylinder_6 = new THREE.CylinderGeometry( .5,.5,1, 6 );
Geom.cone = new THREE.CylinderGeometry( 0,.5,1 );

Geom.roof = new THREE.PlaneGeometry( 1,1, 10, 1 );
for( var i = 0; i < Geom.roof.vertices.length; i++ )
{
	var v = Geom.roof.vertices[ i ];
	v.z = Math.abs( Math.sin( ( .5 + v.x *.5 ) * Math.PI ) );
}

//Geom.geoms = [ Geom.roof ]
Geom.geoms = [
//				Geom.cube,
				Geom.cylinder,
//				Geom.box,
//				Geom.plateau,
				Geom.sphere,
				Geom.sphere_1,
				Geom.wheel ]
Geom.geoms.forEach( function( g )
{

	g.vertices.forEach(function(v){
//		v.x += Math.random()* 0.5;
//		v.y += Math.random()* 0.5;
//		v.z += Math.random()* 0.5;
	})

});


Geom.getMesh = function( type, mass, mat )
{
	type = type || Geom.sphere;
	mass = mass || 500;
	mat = mat || Materials.BASE;
	return new Physijs.BoxMesh( type, Materials.getRandomMaterial( mat, .5, .0 ), mass );
}

Geom.getTextMesh = function( char, mass, mat, size, physical )
{

	mass = mass || 1000;

	var geometry = new THREE.TextGeometry( char,    {
													size   : size,
													height : size / 2,
													curveSegments : 8,
													font : "xmas",
													weight : "normal",//bold
													style : "normal",// italics
													bevelEnabled : false,
													bevelThickness : 10,
													bevelSize : 8
													} );
	if( physical )
	{
		var m = new Physijs.ConvexMesh( geometry, Materials.getRandomMaterial( mat,.8,.2 ) );
	}
	else
	{
		var m = new THREE.Mesh( geometry, Materials.getStandardMaterial( mat ) );
	}
	return m;

}
Geom.getStandardMesh = function( type, mat, scaleUp )
{
	scaleUp = scaleUp || true;
	type = type || Geom.sphere;
	mat = mat || Materials.BUBBLE;
	var m = new THREE.Mesh( type, Materials.getStandardMaterial( mat ) );
	if( scaleUp ) m.scale.set( SCALE, SCALE, SCALE );
	return m;
}