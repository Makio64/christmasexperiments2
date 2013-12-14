function SnowBall(cubeSize)
{

	this.triangles = 30000;
	this.cubeSize = cubeSize;
	this.triangleSize = 1;

	this.setVertices();
	this.setIndices();
	this.setOffests();

	
	this.uniforms = {

		color: { type: "c", value: new THREE.Color( 0xffffff ) },
		radius: { type: "f", value: cubeSize },
		time : {type : "f", value:0}

	};

	var simplexPart = document.getElementById( 'vSimplexPart' ).textContent;
	this.material = new THREE.ShaderMaterial( {

		uniforms: 		this.uniforms,
		attributes:     {},
		vertexShader:   simplexPart + document.getElementById( 'vSnowShader' ).textContent,
		fragmentShader: document.getElementById( 'fSnowShader' ).textContent,
		side: THREE.DoubleSide

	});


	this.mesh = new THREE.Mesh( this.geometry, this.material );
}


SnowBall.prototype = {
	setVertices : function()
	{

		this.geometry = new THREE.BufferGeometry();
		this.geometry.addAttribute( 'index', Uint16Array, this.triangles * 3, 1 );
		this.geometry.addAttribute( 'position', Float32Array, this.triangles * 3, 3 );



		var positions = this.geometry.attributes.position.array;

		for ( var i = 0; i < this.triangles; i++)
		{
			var x = 0.5 * (Math.random() * 2 - 1) * this.cubeSize;
			var y = 0.5 * (Math.random() * 2 - 1) * this.cubeSize;
			var z = 0.5 * (Math.random() * 2 - 1) * this.cubeSize;
			for(var j = 0; j < 3; j++)
			{
				var id = 3 * (3 * i + j);
				positions[id] = x + this.triangleSize * (Math.random() * 2 - 1);
				positions[id + 1] = y + this.triangleSize * (Math.random() * 2 - 1);
				positions[id + 2] = z + this.triangleSize * (Math.random() * 2 - 1);

			}
		}
	},

	setIndices : function()
	{

		this.indices = this.geometry.attributes.index.array;

		for (var i = 0; i < 3 * this.triangles; i++)
			this.indices[i] = i;
	},

	setOffests : function()
	{
		this.geometry.offsets = [{
			start: 0,
			index: 0,
			count: this.triangles
		}];	
	},

	update : function()
	{
		this.uniforms.time.value++;
	}
}


