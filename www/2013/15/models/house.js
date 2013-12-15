{

"metadata" :
{
	"formatVersion" : 3.2,
	"type"          : "scene",
	"sourceFile"    : "house.blend",
	"generatedBy"   : "Blender 2.66 Exporter",
	"objects"       : 3,
	"geometries"    : 3,
	"materials"     : 1,
	"textures"      : 0
},

"urlBaseType" : "relativeToScene",


"objects" :
{
	"tree" : {
		"geometry"  : "geo_tree",
		"groups"    : [  ],
		"material"  : "Material",
		"position"  : [ 4.31726, 0.21761, 4.95972 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ 0.6, 0.6, 0.6 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"ground" : {
		"geometry"  : "geo_ground.001",
		"groups"    : [  ],
		"material"  : "Material",
		"position"  : [ 0, 0, 0 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ 10, 10, 10 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"house" : {
		"geometry"  : "geo_house.001",
		"groups"    : [  ],
		"material"  : "Material",
		"position"  : [ 0, 1.02686e-07, -3 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ 2.66667, 2.5, 2.66667 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	}
},


"geometries" :
{
	"geo_tree" : {
		"type" : "ascii",
		"url"  : "house.tree.js"
	},

	"geo_ground.001" : {
		"type" : "ascii",
		"url"  : "house.ground.001.js"
	},

	"geo_house.001" : {
		"type" : "ascii",
		"url"  : "house.house.001.js"
	}
},


"materials" :
{
	"Material" : {
		"type": "MeshLambertMaterial",
		"parameters": { "color": 10724259, "opacity": 1, "blending": "NormalBlending" }
	}
},


"transform" :
{
	"position"  : [ 0, 0, 0 ],
	"rotation"  : [ -1.5708, 0, 0 ],
	"scale"     : [ 1, 1, 1 ]
},

"defaults" :
{
	"bgcolor" : [ 0, 0, 0 ],
	"bgalpha" : 1.000000,
	"camera"  : ""
}

}
