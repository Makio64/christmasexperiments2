var howToOpenButton;
var howToCloseButton;
var howToPlay;
var howToPlayCenter;
var game;
var pressedLeft = false;
var pressedRight = false;


WebFontConfig = {
	google: { families: [ 'Press+Start+2P::latin' ] },
	active: init
};
(function() {
	var wf = document.createElement('script');
	wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
	'://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
	wf.type = 'text/javascript';
	wf.async = 'true';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(wf, s);
})();

function init() {
	howToOpenButton = document.getElementById('how-to-play-button');
	howToCloseButton = document.getElementById('close-button');
	howToPlay = document.getElementById('how-to-play');
	howToPlayCenter = document.getElementById('center');

	howToOpenButton.addEventListener('click', function(e){
		howToPlay.style.display = "block";
		howToPlayCenter.style.marginTop = (window.innerHeight * 0.5 - howToPlayCenter.offsetHeight * 0.5) + "px";
	});
	howToCloseButton.addEventListener('click', function(e){
		howToPlay.style.display = "none";
	});

	var assetsToLoad = [ "img/spritemap.json"];
	loader = new PIXI.AssetLoader(assetsToLoad);
	loader.onComplete = onAssetsLoaded;
	loader.load();
}

function onAssetsLoaded() {
	game = new Game(window.innerWidth, window.innerHeight);
	document.body.appendChild(game.renderer.view);


	document.addEventListener('mousedown', onMouseDown);
	document.addEventListener('mouseup', onMouseUp);
	document.addEventListener('click', onMouseClick);
	document.addEventListener('mousemove', onMouseMove);
	document.addEventListener('keydown', onKeyDown);
	document.addEventListener('keyup', onKeyUp);
	window.addEventListener( 'resize', resizeApp, false );

	// Start loop
	Leap.loop(onLeapLoop);
	requestAnimFrame( animate );
}

function onLeapLoop(frame) {
	if(frame && frame.hands && frame.hands.length > 0) {
		game.state.shooting = frame.hands[0].fingers.length > 4;
		game.mouse.x = window.innerWidth * ((frame.hands[0].palmPosition[0] / 150) + 1) / 2;
	}
}

function resizeApp(e) {
	// game.renderer.view.setAttribute('width', window.innerWidth);
	// game.renderer.view.setAttribute('height', window.innerHeight);
	// game.resize(window.innerWidth, window.innerHeight);
}

function onKeyDown(e) {
	switch(e.keyCode) {
		case 37: //left
			pressedLeft = true;
		break;
		case 39: //right
			pressedRight = true;
		break;
		case 32: //shoot
			game.state.shooting = true;
		break;
	}
}

function onKeyUp(e) {
	switch(e.keyCode) {
		case 37: //left
			pressedLeft = false;
		break;
		case 39: //right
			pressedRight = false;
		break;
		case 32: //shoot
			game.state.shooting = false;
		break;
	}
}

function onMouseDown(e) {
	game.state.shooting = true;
}

function onMouseUp(e) {
	game.state.shooting = false;
}

function onMouseClick(e) {
	game.onMouseClick();
}

function onMouseMove(e) {
	game.mouse.x = e.clientX;
	game.mouse.y = e.clientY;
}

function animate() {
	if(pressedLeft) {
		game.mouse.x += (0 - game.mouse.x) * 0.05;
	}
	if(pressedRight) {
		game.mouse.x += (window.innerWidth - game.mouse.x) * 0.05;
	}
	game.update();
	requestAnimFrame( animate );
}
