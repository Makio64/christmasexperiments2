function Cubes(ballRadius)
{
	var ran = Math.random() * 5;
	this.nCubes = 1000;
	this.ballRadius = ballRadius;
	this.cubeSize = 5;
	var nCubeVertices = 12;

	var colors = [0xB00C0C, 0xB00C0C, 0xB00C0C, 0xffffff];
	this.attributes = {cubeBarId : {type:"f", value: []},
					   aColor : {type:"c", value: []},
					   aCubeOffset : {type:"v3", value: []}};

	for(var i = 0; i < this.nCubes; i++)
	{
		// width, height, depth, widthSegments, heightSegments, depthSegments
		var w = (0.25 + 0.75 * Math.random()) * this.cubeSize; 
		var h = (0.25 + 0.75 * Math.random()) * this.cubeSize;
		var d = (0.25 + 0.75 * Math.random()) * this.cubeSize; 
		var cube = new THREE.CubeGeometry(4 * this.cubeSize, 1.5 * this.cubeSize, this.cubeSize, 1, 1, 1);
		if(this.geometry) THREE.GeometryUtils.merge(this.geometry, cube);
		else this.geometry = cube;

		//var color = new THREE.Color( Math.random() * 0xffffff );
		var color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
		var dx = (2 * Math.random() - 1) * ballRadius;
		var dy = (2 * Math.random() - 1) * ballRadius;
		var dz = (2 * Math.random() - 1) * ballRadius;
		var r = Math.random() * 0.4 * Math.sqrt(ballRadius / Math.sqrt(dx * dx + dy * dy + dz * dz));
		var offset = new THREE.Vector3(r * dx, r * dy, r * dz);
		var n = cube.vertices.length;
		for(var j = 0; j < n; j++)
		{
			var vertexId = i * n + j;
			this.attributes.aCubeOffset.value[vertexId] = offset;
			this.attributes.cubeBarId.value[vertexId] = i;
			this.attributes.aColor.value[vertexId] = color;
		}
	}

	this.uniforms = {

		color: { type: "c", value: new THREE.Color( Math.random() * 0xffffff ) },
		radius: { type: "f", value: ballRadius },
		time : {type : "f", value:0}

	};

	var simplexPart = document.getElementById( 'vSimplexPart' ).textContent;
	var quatPart = document.getElementById( 'vQuatPart' ).textContent;
	this.material = new THREE.ShaderMaterial( {
		uniforms: 		this.uniforms,
		attributes:     this.attributes,
		vertexShader:   quatPart + simplexPart + document.getElementById( 'vCubesShader' ).textContent,
		fragmentShader: document.getElementById( 'fCubesShader' ).textContent,
		side: THREE.DoubleSide

	});


	var metalMaterial = new THREE.MeshPhongMaterial( {
			color: 0xcccccc, ambient: 0xcccccc, specular: 0xcccccc, shininess: 100,
			vertexColors: THREE.VertexColors
	});


	this.mesh = new THREE.Mesh( this.geometry, this.material );
}


Cubes.prototype = {

	update : function()
	{
		this.uniforms.time.value++;
	}
}


