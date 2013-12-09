/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */

var Detector = {

	canvas: !! window.CanvasRenderingContext2D,
	webgl: ( function () { try { var canvas = document.createElement( 'canvas' ); return !! window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ); } catch( e ) { return false; } } )(),
	workers: !! window.Worker,
	fileapi: window.File && window.FileReader && window.FileList && window.Blob,

	getWebGLErrorMessage: function () {

		return;
		var element = document.createElement( 'div' );
		element.id = 'webgl-error-message';
//		element.style.fontFamily = 'monospace';
//		element.style.fontSize = '13px';
//		element.style.fontWeight = 'normal';
		element.style.textAlign = 'center';
//		element.style.background = '#fff';
//		element.style.color = '#000';
//		element.style.padding = '1.5em';
//		element.style.width = '400px';
		element.style.margin = '5em auto 0';
//		https://vimeo.com/81324187

		var player = 'this is a creencast of the experiment:<br> <iframe src="//player.vimeo.com/video/81324187" width="960" height="540" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe><br>';
//		<p><a href="http://vimeo.com/81047160">Linklater // On Cinema & Time</a> from <a href="http://vimeo.com/kogonada">kogonada</a> on <a href="https://vimeo.com">Vimeo</a>.</p>'

		if ( ! this.webgl ) {

			element.innerHTML = window.WebGLRenderingContext ? [
				'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />',
				player,
				'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.<br>'
			].join( '\n' ) : [

				'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>',
				player,
				'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.<br>'
			].join( '\n' );

		}

		return element;

	},

	addGetWebGLMessage: function ( parameters ) {

		var parent, id, element;

		parameters = parameters || {};

		parent = parameters.parent !== undefined ? parameters.parent : document.body;
		id = parameters.id !== undefined ? parameters.id : 'oldie';

		element = Detector.getWebGLErrorMessage();
		element.id = id;

		parent.appendChild( element );

	}

};