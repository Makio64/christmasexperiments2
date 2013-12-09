/**
 * Created by nico on 04/12/13.
 */
var Ball = function( mod, mass )
{
	var out, ins;
	if( mass != null )
	{
		out = Geom.getMesh( Geom.sphere, mass, Materials.BUBBLE );
		ins = Geom.getMesh( Geom.sphere, mass, Materials.GLASS );
	}
	else
	{
		out = Geom.getStandardMesh( Geom.sphere_1, Materials.BUBBLE );
		ins = Geom.getStandardMesh( Geom.sphere_1, Materials.GLASS );
	}
	if( mod != null )
	{
		mod.appendMesh( ins );
		mod.appendMesh( out );
	}
	else
	{
		var o = new THREE.Object3D();
		o.add( ins );
		o.add( out );
		return o;
	}

}