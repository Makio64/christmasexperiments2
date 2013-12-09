/**
 * Created by nico on 05/12/13.
 */

var PostProcessor = function()
{

	this.material_depth = new THREE.MeshDepthMaterial();

	this.scene = new THREE.Scene();

	this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2,  window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
	this.camera.position.z = 100;

	this.scene.add( this.camera );

	var h = window.innerHeight;// / 4 * 3;

	var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat };
	this.rtTextureDepth = new THREE.WebGLRenderTarget( window.innerWidth, h, pars );
	this.rtTextureColor = new THREE.WebGLRenderTarget( window.innerWidth, h, pars );

	var bokeh_shader = THREE.BokehShader;

	this.bokeh_uniforms = THREE.UniformsUtils.clone( bokeh_shader.uniforms );

//	this.bokeh_uniforms[ "tColor" ].value = this.rtTextureColor;
//	this.bokeh_uniforms[ "tDepth" ].value = this.rtTextureDepth;
//	this.bokeh_uniforms[ "aspect" ].value = window.innerWidth / h;

//	this.bokeh_uniforms[ "focus" ].value = .992;
//	this.bokeh_uniforms[ "aperture" ].value = .25;
//	this.bokeh_uniforms[ "maxblur" ].value = 3;


	this.materialBokeh = new THREE.ShaderMaterial( {

		uniforms: this.bokeh_uniforms,
		vertexShader: bokeh_shader.vertexShader,
		fragmentShader: bokeh_shader.fragmentShader

	} );

	this.quad = new THREE.Mesh( new THREE.PlaneGeometry( window.innerWidth, window.innerHeight ), this.materialBokeh );
	this.quad.position.z = - 500;
	this.scene.add( this.quad );

	
}
var postProcessing = new PostProcessor();