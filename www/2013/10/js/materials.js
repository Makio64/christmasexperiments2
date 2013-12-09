/**
 * Created by nico on 01/12/13.
 */
var Materials = function()
{




	Materials.whiteFog = new THREE.FogExp2( 0xFFFFFF, .00000005 );//5000, 50000 );

	Materials.reflectionCube = new Skybox();
	Materials.refractionCube = new THREE.Texture( Materials.reflectionCube.image, new THREE.CubeRefractionMapping() );
	Materials.refractionCube.format = THREE.RGBFormat;
/*
	//var cubeMaterial3 = new THREE.MeshPhongMaterial( { color: 0x000000, specular:0xaa0000, envMap: reflectionCube, combine: THREE.MixOperation, reflectivity: 0.25 } );
	Materials.cubeMaterial1 = new THREE.MeshLambertMaterial( { color: 0xffffff, ambient: 0xaaaaaa, envMap: Materials.reflectionCube } )
	Materials.cubeMaterial2 = new THREE.MeshLambertMaterial( { color: 0xffee00, ambient: 0x996600, envMap: Materials.refractionCube, refractionRatio: 0.95 } );
//	Materials.cubeMaterial3 = new THREE.MeshLambertMaterial( { color: 0xff6600, ambient: 0x000000, envMap: Materials.reflectionCube, combine: THREE.MixOperation, reflectivity: 0.1 } );

	var tex = THREE.ImageUtils.loadTexture('./img/noise.png');
	Materials.cubeMaterial3 = new THREE.MeshLambertMaterial( {  color: 0xff6600,
																ambient: 0x000000,
																envMap: Materials.reflectionCube,
//																bumpMap: tex,
																combine: THREE.MixOperation,
																reflectivity: 0.05,
//																anisotropy:4,
//																map:tex,
																specular:.25
																} );
//*/
	var noise  = THREE.ImageUtils.loadTexture('./img/noise.png');

	Materials.groundMaterial = Physijs.createMaterial(
														new THREE.MeshBasicMaterial( {
																	map: THREE.ImageUtils.loadTexture('./img/bg.png' ),
																	reflectivity:.5
														}),
														/*
														new THREE.MeshLambertMaterial( {    color: 0xFFFFFF,
																							ambient: 0x000000,
																							map: THREE.ImageUtils.loadTexture('./img/islamic.png' ),
//																							envMap: Materials.reflectionCube,
//																							refractionRatio: 0.85,
//																							reflectivity: 0.5,
//																							transparent: true,
//																							opacity :.5
														}),
														//*/
														1, // high friction
														0.001 // low restitution
	);
	Materials.groundMaterial.map.wrapS = Materials.groundMaterial.map.wrapT = THREE.RepeatWrapping;
//	Materials.groundMaterial.map.repeat.set( 284,284 );
	Materials.groundMaterial.map.repeat.set( 2560,2560 );

	Materials.colorIterator = 0;
	Materials.colors =
	[
		//http://www.colourlovers.com/palette/3153058/Just_fun
		0xAFF882,
		0xE5F83E,
		0xFB16CC,
		0x16FCE6,

//		http://www.colourlovers.com/palette/3155677/One_more_rainbow
		0xEB3431,
		0xFF842A,
		0xFFD92E,
		0x5FFF4A,
		0x23B4FC

	];

	Materials.transparent = new THREE.MeshBasicMaterial( { transparent:true, opacity:0 } );
}

Materials.getRandomColor = function()
{
	Materials.colorIterator++;
	return Materials.colors[ Materials.colorIterator % Materials.colors.length ];
//	return Materials.colors[ parseInt( Math.random() * Materials.colors.length ) ];
}

Materials.BASE = "base";
Materials.BUBBLE = "bubble";
Materials.GLASS = "glass";
Materials.SHINY = "shiny";
Materials.WIREFRAME = "wireframe";
Materials.TRANSPARENT = "transparent";
Materials.list = [
//				Materials.BASE,
				Materials.BUBBLE,
				Materials.GLASS,
				Materials.SHINY,
				Materials.WIREFRAME,
				Materials.WIREFRAME
//				Materials.TRANSPARENT
];


Materials.getRandomType = function(){ return Materials.list[ parseInt( Math.random() * ( Materials.list.length-1 ) ) ]; }
Materials.getRandomMaterial = function( type, friction, restitution, asBaseMaterial )
{
	if( type == null ) type = Materials.BASE;
	if( asBaseMaterial == null ) asBaseMaterial = false;


	friction = .5;
	restitution = -.005;
	var mat;
	switch( type )
	{
		case Materials.BASE:
			mat = Materials.getBaseMaterial();
			break;
		case Materials.WIREFRAME:
			mat = Materials.getBaseMaterial();
			mat.wireframe = true;
			break;
		case Materials.BUBBLE:
			mat = Materials.getBubbleMaterial();
			break;
		case Materials.SHINY:
			mat = Materials.getShinyMaterial();
			break;
		case Materials.GLASS:
			mat = Materials.getGlassMaterial();
			break;
		case Materials.TRANSPARENT:
			mat = Materials.transparent;
			break;
	}

	if( asBaseMaterial )return mat;

	var pmat = Physijs.createMaterial(
									mat,
									.9,//.friction || .5, // high friction
									.001// restitution || .0// low restitution
									);
	return pmat;

}
Materials.getStandardMaterial = function( type )
{
	return Materials.getRandomMaterial( type, 0, 0, true );
}

Materials.getBaseMaterial = function( )
{
	var base = new THREE.MeshLambertMaterial( {     color: Materials.getRandomColor(),
													ambient: 0x000000,
													anisotropy : 4,
													reflectivity:.0
													} );
	return base;
}

Materials.getShinyMaterial = function( )
{
	var c = Materials.getRandomColor();
	var shiny = new THREE.MeshLambertMaterial( {
													color: c,
													emissive:   0x333333,
													ambient: 0x000000,
													envMap: Materials.reflectionCube,
													combine: THREE.MixOperation,
													reflectivity: 0.45
													} );
	return shiny;
}
Materials.getBubbleMaterial = function( )
{
	var glass = new THREE.MeshLambertMaterial( {    color: Materials.getRandomColor(),
													ambient: 0x000000,
													envMap: Materials.reflectionCube,
													refractionRatio: 0.85,
													reflectivity: 0.5,
													transparent: true,
													opacity :.5

													} );
	return glass;

}
Materials.getGlassMaterial = function( col )
{
	var glass = new THREE.MeshLambertMaterial( {    color: Materials.getRandomColor(),
													ambient: 0x000000,
													conbime: THREE.AddOperation,
													envMap: Materials.refractionCube,
													refractionRatio: 0.35
													} );
	return glass;

}
Materials.color = function( mat, value )
{
	mat.setHex( value );
	return mat;
}

Materials.copyColorFrom = function( from, to )
{

	to.setHex( from.getHex() );
	return mat;
}


Materials.friction = function( mat, value )
{
	mat._physijs.friction = value;
	return mat;
}
Materials.restitution = function( mat, value )
{
	mat._physijs.restitution = value;
	return mat;
}