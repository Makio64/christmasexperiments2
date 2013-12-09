/**
 * Created by nico on 04/12/13.
 */
var Title = function( text, textSize, pos )
{

	text = text || "XMAS";

	var spacing = SCALE * 2;
	var bits = text.split(',');


	var offset = new THREE.Vector3( -SCALE * bits.length, 10 , -30 );
	if( pos != null )offset.add( pos );

	var meshes = [];

	for( var i = 0; i < bits.length; i++ )
	{
		if( bits[i] == " " )
		{
			offset.x += spacing / 4;
			continue;
		}

		var m = Geom.getTextMesh( bits[ i ], 1000, Materials.SHINY, textSize, false );
		m.geometry.computeBoundingBox();

		var size = m.geometry.boundingBox.size();

		var holder = new Physijs.BoxMesh( Geom.cube, Materials.getRandomMaterial( Materials.TRANSPARENT ), 1000 );
		holder.scale.set( size.x, size.y, size.z );
		holder.position.copy( offset );

		var invertScale = new THREE.Vector3( 1 / holder.scale.x, 1 / holder.scale.y, 1 / holder.scale.z );
		m.scale.multiply( invertScale );

		m.position.x -= .5;
		m.position.y -= .5;
		m.position.z -= .5;

		holder.add( m );
		Main.scene.add( holder );

		offset.x += spacing;

	}
}
Title.prototype =
{
	shadows : function( value )
	{

	}
}