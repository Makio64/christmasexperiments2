THREE.SpiritShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"iGlobalTime" : { type: "f", value: 0.0 }

	},

	vertexShader: [
		"uniform float iGlobalTime;",

		"varying vec2 vUv;",
		"varying vec3 vPos;",
		"varying vec3 vNormal;",

		"void main() {",
			"vPos = position;",
			"vUv = uv;",
			"vNormal = normal;",
			"vec3 newPosition = position;",
			
			// Twist from inear
			// "float st = sin(iGlobalTime);",
			// "float ct = cos(iGlobalTime);",

			// "newPosition.x = position.x*ct - position.z*st;",
			// "newPosition.z = position.x*st + position.z*ct;",

			// "newPosition.y = position.y;",
			// "newPosition.w = position.w;",

			"vNormal.x *= sin(vNormal.z+iGlobalTime*0.02)*1.0;",
			"vNormal.z *= abs(cos(vNormal.x+iGlobalTime*0.02))*1.0;",
			"newPosition += position + vNormal * vec3(abs(cos(position.x+iGlobalTime*0.03))*20.0);",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );",
		"}"
	].join("\n"),

	fragmentShader: [
		"uniform float amplitude;",
		"uniform sampler2D tDiffuse;",
		"uniform float iGlobalTime;",

		"varying vec2 vUv;",
		"varying vec3 vPos;",
		"varying vec3 vNormal;",

		"void main() {",
			"vec3 light = vec3(0.5+cos(iGlobalTime*0.01),0.2+sin(iGlobalTime*0.01),1.0);",
			"light = normalize(light);",
			"float dProd = max(0.0, dot(vNormal, light))*.4;",

			"vec3 light2 = vec3(1.5,3.2+sin(iGlobalTime*0.01),1.0+cos(iGlobalTime*0.01));",
			"light2 = normalize(light);",
			"float dProd2 = max(0.0, dot(vNormal, light2))*.4;",

			"vec4 texture = texture2D( tDiffuse, vUv + cos(iGlobalTime*0.01)*.2);",
			"gl_FragColor = vec4( texture.rgb+vec3(dProd)*.6+vec3(dProd2)*.9, 0.7);",
		"}"

	].join("\n")

};