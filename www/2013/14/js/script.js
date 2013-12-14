tools.mixin(tools, this);
tools.mixin(Tween, this);

function backOut (k) 
{
	var s = 1.1;
	return (k = k - 1) * k * ((s + 1) * k + s) + 1;
}

function Main()
{
	this.container = document.getElementById( 'container' );
	this.time = 0;
	this.origin = new THREE.Vector3(0, 0, 0);
	//

	this.camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 3500 );
	this.camera.position.z = 1750;

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.Fog( 0xFCF5E1, 2000, 3500 );

	//

	this.scene.add( new THREE.AmbientLight( 0xffffff ) );

	var light1 = new THREE.DirectionalLight( 0xffffff, 1.5 );
	light1.position.set( 1, 1, 1 );
	this.scene.add( light1 );

	var light2 = new THREE.DirectionalLight( 0xffffff, 1.5 );
	light2.position.set( 0, 1, 0 );
	this.scene.add( light2 );


	this.currentWord;
	this.word0 = new Word(PathData0);
	this.word1 = new Word(PathData1);

	this.ball = new Ball();
	this.ball.mesh.position.z = 1000;

	this.ballId = 0;
	this.balls = [new SnowBall(2 * this.ball.radius),
				  new Cubes(2 * this.ball.radius),
				  new Bars(2 * this.ball.radius)];


	this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: false } );
	this.renderer.setClearColor( this.scene.fog.color, 1 );
	this.renderer.setSize( window.innerWidth, window.innerHeight );

	this.renderer.gammaInput = true;
	this.renderer.gammaOutput = true;
	this.renderer.physicallyBasedShading = true;

	this.container.appendChild( this.renderer.domElement );

	
	window.addEventListener( 'resize', this.onWindowResize.bind(this), false );

	this.showWord0();
	new Loop(this.onUpdate, this);

}




Main.prototype = {

	showWord0 : function()
	{
		console.log("show0");
		this.scene.add(this.word0.mesh);
		this.word0.show();
		this.nextStepCount = 1.4 * this.word0.showDuration;
		this.nextStep = this.hideWord0;
	},

	hideWord0 : function()
	{
		console.log("hide0");
		this.word0.hide();
		this.nextStepCount = this.word0.hideDuration;
		this.nextStep = this.showWord1;
		
	},

	showWord1 : function()
	{
		console.log("show1");
		this.scene.remove(this.word0.mesh);
		this.scene.add(this.word1.mesh);
		this.word1.show();
		this.nextStepCount = this.word1.showDuration;
		this.nextStep = this.finish;
	},

	finish : function()
	{
		var mouse = new Mouse(document.body);
		mouse.onUp.add(this.showBall, this);
		this.showBall();
	},

	showBall : function()
	{
		if(this.currentBall)
			this.ball.mesh.remove(this.currentBall.mesh);
		this.currentBall = this.balls[++this.ballId % this.balls.length];
		this.scene.add(this.ball.mesh);
		this.ball.mesh.add(this.currentBall.mesh);
		this.ball.mesh.position.y = 1000;
		new Tween(this.ball.mesh.position).start(1, {y:0}).easing(backOut);


		this.nextStepCount = 500;
		this.nextStep = this.showBall;

	},

	onWindowResize : function() {

		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize( window.innerWidth, window.innerHeight );

	},

	onUpdate : function()
	{
		this.word0.update();
		this.word1.update();

		if(--this.nextStepCount == 0)
			this.nextStep();

		this.ball.mesh.rotateY(0.005);

		if(this.currentBall)
			this.currentBall.update();

		this.renderer.render( this.scene, this.camera );
	}
}

var main = new Main();