$( 'document' ).ready( function(){

	var generator = new flg();
	generator.init( 'playground' );

	setInterval( function(){
		$( '#playground' ).fadeOut( 1000 );
		setTimeout( function(){
			generator.init( 'playground' );
			$( '#playground' ).fadeIn( 1000 );
		}, 2000 );
	}, 10000 )

} );


var flg = function(){
	this.canvas;
	this.ctx;
	this.stage;
	this.stageWidth = 700;
	this.stageHeight = 700;
	this.colorsVariation = [
		{ //Bleu
			'sky': "#F2CB75",
			'cloud': "#ffffff",
			'ground': "#ffffff",
			'tree': [ '#22314C', '#1B2533', '#303942' ],
			'mountainTop': [ '#FFFFFF', '#999999', '#CCCCCC' ],
			'mountainBottom': [ '#181D2B', '#131923', '#1E2533' ]
		},
		{ //Violet
			'sky': "#F2CB75",
			'cloud': "#ffffff",
			'ground': "#ffffff",
			'tree': [ '#7E4FC1', '#553F77', '#3A2563' ],
			'mountainTop': [ '#FFFFFF', '#999999', '#CCCCCC' ],
			'mountainBottom': [ '#1E192B', '#292338', '#141023' ]
		},
		{ //Rouge
			'sky': "#F2CB75",
			'cloud': "#ffffff",
			'ground': "#ffffff",
			'tree': [ '#A82020', '#660700', '#A50400' ],
			'mountainTop': [ '#FFFFFF', '#999999', '#CCCCCC' ],
			'mountainBottom': [ '#661212', '#3A0D0D', '#AF4141' ]
		}
	];
	this.colors;
	this.ground;
	this.sky;
	this.skyWidth = 700;
	this.skyHeight = 400;	
	this.forest;
	this.forestWidth = 500;
	this.forestHeight = 100;
	this.maxTree = parseInt( ( Math.random() * 4 ) + 10 );
	this.maxMountain = parseInt( ( Math.random() * 2 ) + 5 );
}


flg.prototype.init = function( canvasId ){
	var self = this;
	self.colors = self.colorsVariation[ Math.floor( self.colorsVariation.length * Math.random() ) ];
	self.canvas = document.getElementById( canvasId );	
	self.stage = new createjs.Stage( canvasId );
	self.stage.autoClear = true;
	self.createSky();
	self.createGround();

	for( var i = 0; i < self.maxMountain; i++ ){
		self.createMountain( i );
	}

	for( var i = 0; i < self.maxTree; i++ ){
		self.createTree( i );
	}

	self.stage.update();
}


flg.prototype.createSky = function(){
	this.sky = new createjs.Shape();
	this.sky.graphics.f( this.colors['sky'] ).dc( this.stageWidth/2 + ( Math.random() * 150 ) - 75, this.stageHeight/2, Math.random() * 100 + 125 );
	this.stage.addChild( this.sky );
}


flg.prototype.createMountain = function( number ){
	var mountain = new createjs.Shape();	
	var yOffset;
	( number % 2 == 0 )?yOffset = 15 * Math.random():yOffset = -15 * Math.random();
	mountain.graphics.f( this.getColor( this.colors['mountainBottom'] ) )
		.mt( -100, 0 )
		.lt( 100, 0 )
		.lt( 50, -75 + yOffset )
		.lt( -50, -75 )
		.cp();
	mountain.graphics.f( this.getColor( this.colors['mountainTop'] ) )
		.mt( 40, -70 + yOffset )
		.lt( -40, -75 )
		.lt( 0, -75 + ( Math.random() - 50 ) )
		.cp();
	mountain.x = 300 / this.maxMountain * number + 225;
 	mountain.y = ( this.ground.y - 75 ) + (Math.random() * number*5);
 	mountain.scaleX = Math.random()  * .75 + .5;
 	mountain.scaleY = Math.random() + .5;
	this.stage.addChild( mountain );
}


flg.prototype.createGround = function(){
	this.ground = new createjs.Shape();	
	this.ground.graphics.f( this.getColor( this.colors['mountainBottom'] ) )
		.de( -300, -125, 600, 275 );
	this.ground.graphics.f( this.colors['ground'] )
		.de( -300, -125, 600, 250 );
	this.ground.x = this.stageWidth / 2;
 	this.ground.y = 470;
	this.stage.addChild( this.ground );
}


flg.prototype.createTree = function( number ){
	var treeWidth = ( Math.random() * 25 ) + 25;
	var treeHeight = ( Math.random() * 40 ) + 50;
	var trunkWidth = ( Math.random() * 10 ) + 3;
	var trunkHeight = ( Math.random() * 20 ) + 5; 
	var tree = new createjs.Shape();	
	tree.graphics.f( '#261308' )
		.mt( -trunkWidth / 2,  treeHeight + trunkHeight )
		.lt( trunkWidth / 2,  treeHeight + trunkHeight )
		.lt(  trunkWidth / 2 * Math.random() + trunkWidth / 2, treeHeight )
		.lt(  -trunkWidth / 2 * Math.random(), treeHeight )
		.cp();
	tree.graphics.f( this.getColor( this.colors['tree'] ) )
		.mt( -treeWidth / 2, treeHeight + 5 * Math.random() )
		.lt( treeWidth / 2, treeHeight + 5 * Math.random() )
		.lt( ( Math.random() * 10 ) -5 , 0 )
		.cp();
 	tree.x = this.forestWidth / this.maxTree * number + 125;
 	tree.y = ( this.ground.y - 50 ) - 75 * Math.random() ;
 	tree.scaleX = ( Math.random() * .25 ) + .75;
 	tree.scaleY = ( Math.random() * .25 ) + .75;
	this.stage.addChild( tree );
}


flg.prototype.getColor = function( colorsArray ){
	return colorsArray[Math.round( Math.random()*(colorsArray.length-1) )];
}