function Ball()
{
	this.mesh = new THREE.Object3D();

	this.radius = 100;
	//radius, segments, rings
	this.sphere = new THREE.Mesh(new THREE.SphereGeometry(this.radius, 25, 25),
								 new THREE.MeshPhongMaterial( {
								color: 0xaaaaaa, ambient: 0x000000, specular: 0xffffff, shininess: 100,
								vertexColors: THREE.VertexColors,
								opacity:0.2,
								transparent:true
	} ));
	this.mesh.add(this.sphere);

	var metalMaterial = new THREE.MeshPhongMaterial( {
			color: 0xcccccc, ambient: 0xcccccc, specular: 0xcccccc, shininess: 100,
			vertexColors: THREE.VertexColors
	});

	//radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded
	this.cylinder = new THREE.Mesh(new THREE.CylinderGeometry( 0.2 * this.radius, 0.2 * this.radius, this.radius / 5, 16, 1, false), metalMaterial);
	this.cylinder.position.y = this.radius + 0.08 * this.radius;
	this.mesh.add(this.cylinder);


	//radius, tube, radialSegments, tubularSegments, arc
	this.torus = new THREE.Mesh(new THREE.TorusGeometry(0.1 * this.radius, 0.025 * this.radius, 25, 25), metalMaterial);
	this.torus.position.y = this.cylinder.position.y + 0.2 * this.radius;
	this.mesh.add(this.torus);
}