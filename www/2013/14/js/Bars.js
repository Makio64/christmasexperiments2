function Bars(ballRadius)
{
	var ran = Math.random() * 10;
	this.nCubes = 100 + Math.floor(100 * ran);
	this.ballRadius = ballRadius;
	this.cubeSize = Math.floor(2 + 0.5 * ran);
	var nCubeVertices = 12;
	this.attributes = {cubeBarId : {type:"f", value: []},
					   aColor : {type:"c", value: []}};


	var colors = [0x296312, 0x296312, 0x296312, 0x296312, 0x296312, 0x296312, 0x296312, 0xffffff, 0xB00C0C, 0xB00C0C];

	for(var i = 0; i < this.nCubes; i++)
	{
		// width, height, depth, widthSegments, heightSegments, depthSegments 
		var cube = new THREE.CubeGeometry(0.9 * this.ballRadius, this.cubeSize, this.cubeSize, 2, 1, 1);
		if(this.geometry) THREE.GeometryUtils.merge(this.geometry, cube);
		else this.geometry = cube;

		//var color = new THREE.Color( Math.random() * 0xffffff );
		var color = new THREE.Color( colors[Math.floor(Math.random() * colors.length)] );
		var n = cube.vertices.length;
		for(var j = 0; j < n; j++)
		{
			this.attributes.cubeBarId.value[i * n + j] = i;
			this.attributes.aColor.value[i * n + j] = color;
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
		vertexShader:   quatPart + simplexPart + document.getElementById( 'vBarsShader' ).textContent,
		fragmentShader: document.getElementById( 'fBarsShader' ).textContent,
		side: THREE.DoubleSide

	});


	var metalMaterial = new THREE.MeshPhongMaterial( {
			color: 0xcccccc, ambient: 0xcccccc, specular: 0xcccccc, shininess: 100,
			vertexColors: THREE.VertexColors
	});


	this.mesh = new THREE.Mesh( this.geometry, this.material );
}


Bars.prototype = {

	update : function()
	{
		this.uniforms.time.value++;
	}
}


