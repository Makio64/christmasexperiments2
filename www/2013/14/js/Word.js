function Word(data)
{
	this.uniforms = {

		color: { type: "c", value: new THREE.Color( 0x0B1B36 ) },
		time : { type : "f", value:0 }

	};

	var simplexPart = document.getElementById( 'vSimplexPart' ).textContent;
	var shaderMaterial = new THREE.ShaderMaterial( {

		uniforms: 		this.uniforms,
		attributes:     {},
		vertexShader:   simplexPart + document.getElementById( 'vWordShader' ).textContent,
		fragmentShader: document.getElementById( 'fWordShader' ).textContent,
		side: THREE.DoubleSide

	});

	this.showDuration = 0;
	this.hideDuration = 0;

	this.mesh = new THREE.Object3D();
	this.mesh.position.x = data.dx;
	this.mesh.position.y = data.dy;
	this.paths = [];
	for(var pathName in data)
	{
		if(pathName == "dx" || pathName == "dy") continue;
		var pathData = data[pathName];
		var path = new Path(pathData, shaderMaterial, pathName);

		var duration = pathData.delay0 + pathData.duration0;
		if(duration > this.showDuration)
			this.showDuration = duration;

		if(pathData.duration1 > this.hideDuration)
			this.hideDuration = pathData.duration1;

		this.mesh.add( path.mesh );
		this.paths.push(path);
		path.mesh.rotateY(0.01 * Math.PI);
	}
	this.time = 0;
	this.isShowing = true;
}


Word.prototype = {
	show : function()
	{
		this.time = 0;
		this.isShowing = true;
		this.update();
	},

	hide : function()
	{
		this.time = 0;
		this.isShowing = false;
		this.update();
	},

	update : function()
	{
		var nPaths = this.paths.length;
		for(var i = 0; i < nPaths; i++)
		{
			if(this.isShowing)this.paths[i].updateShow(this.time);
			else this.paths[i].updateHide(this.time);
		}
		this.time++;
		this.uniforms.time.value = this.time;
	}
}