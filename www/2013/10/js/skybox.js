/**
 * Created by nico on 30/11/13.
 */
var Skybox = function()
{
	var path = "./img/env/studio/";

	var names = [
		'right','left',
		'top', 'bottom',
		'front', 'back',
	];

	var urls = [];
	var format = '.jpg';
	names.forEach( function( n )
	{
		urls.push( path+""+ n +"_01" + format );
	} );

	var reflectionCube = THREE.ImageUtils.loadTextureCube( urls );
	reflectionCube.format = THREE.RGBFormat;
	return reflectionCube;
}