/**
 * Created by nico on 05/12/13.
 */
var Composer = function(){}

Composer.prototype =
{
	init : function( renderer, scene, camera )
	{
		this.composer = new THREE.EffectComposer( renderer );
		this.composer.addPass( new THREE.RenderPass( scene, camera ) );

		this.angle = 1;
//		/*
		this.hblur = new THREE.ShaderPass( THREE.HorizontalBlurShader );
		this.composer.addPass( this.hblur );

		this.vblur = new THREE.ShaderPass( THREE.VerticalBlurShader );
		// set this shader pass to render to screen so we can see the effects
//		this.vblur.renderToScreen = true;
		this.composer.addPass( this.vblur );
		//*/

		/*
		this.bokeh = new THREE.ShaderPass( THREE.BokehShader );
		this.bokeh.renderToScreen = true;
		this.composer.addPass( this.hblur );
		//*/


		this.vignette = new THREE.ShaderPass( THREE.VignetteShader );
		this.vignette.renderToScreen = true;
		this.composer.addPass( this.vignette );


	},



	render : function()
	{
//		this.angle += PI / 90;
//		/*
		this.hblur.uniforms[ "h" ].value = //Math.abs( Math.cos( this.angle) * .055 );
		this.vblur.uniforms[ "v" ].value = .004 * this.angle;//( .0035 + Math.abs( Math.sin( this.angle ) * Math.random() ) * .003 ) * this.angle;
//		*/

		this.vignette.uniforms[ "offset" ].value = this.angle * 2.5;//1.2 +  Math.cos( this.angle ) * .2;
		this.vignette.uniforms[ "darkness" ].value = 0;


		this.composer.render();

	}


}
var composer = new Composer();