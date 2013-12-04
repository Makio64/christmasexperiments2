var Game = (function(){

	/*===============================================================
		CONSTRUCTOR
	===============================================================*/
	function Game(width, height) {
		this.t = 0;

		this.width = width;
		this.height = height;
		this.renderer = PIXI.autoDetectRenderer(width, height);
		this.stage = new PIXI.Stage(0xEEEEEE, true);

		this.scores = new Scores();

		this.distributor = new Distributor();

		this.bullets = new Pool(Bullet, 60);
		this.shrapnels = new Pool(Shrapnel, 300);

		this.player = new Player();
		this.stage.addChild(this.player);
		this.player.position.x = width * 0.5 - this.player.width * 0.5;

		this.mouse.x = this.renderer.width * 0.5;


		this.soundLetitsnow = new buzz.sound( "sounds/letitsnowloop", {formats: [ "mp3" ]});
		this.soundRtype = new buzz.sound( "sounds/rtype", {formats: [ "mp3" ]});
		this.soundHurt = new buzz.sound( "sounds/hurt", {formats: [ "mp3"]});
		this.soundDie = new buzz.sound( "sounds/pew", {formats: [ "mp3"]});
		this.soundExplosion = new buzz.sound( "sounds/explosion", {formats: [ "mp3"]});

		this.objectivesManager = new ObjectivesManager();
		this.objectivesManager.addObjective(1, 5);
		this.objectivesManager.addObjective(3, 5, [{t: "This stuff must absolutely not hit my nose!"}]);
		this.objectivesManager.addObjective(5, 5, [{t: "Damn it stinks..."}]);
		this.objectivesManager.addObjective(5, 10, [{t: "How do you like that?!"}]);
		this.objectivesManager.addObjective(8, 10, [{t: "MY GOD! THEY KEEP COMING!!"}]);
		this.objectivesManager.addObjective(15, 10, [{t: "THOU SHALL NOT PASS!!!"}]);
		this.objectivesManager.addObjective(30, 15, [{t: "DIE YOU PIECES OF SHIT!!!!!"}]);
		this.objectivesManager.addObjective(1, 30, [{t: "What now a shitcake?"}, {t: "How about some sprinkles motherfucker?"}], true);
		this.objectivesManager.addObjective(0, 0, [{ t: "* Whistle, Whistle... *"}, { t: "* ...blow my whistle baby... *"}]);

		this.floor = new Floor(width, height);
		this.stage.addChildAt(this.floor, 0);

		this.trees = new Trees(width, height);
		this.stage.addChild(this.trees);

		this.pixelate = new PIXI.PixelateFilter();
		this.floor.filters = [this.pixelate];
		this.trees.filters = [this.pixelate];

		this.soundLetitsnow.play().fadeIn().loop();



		this.intro();
	}

	/*===============================================================
		PROPERTIES
	===============================================================*/
	Game.prototype = {
		ennemies: [],
		shootFrequency: 4,
		nextShoot: 0,
		mouse: {
			x: 0,
			y: 0
		},
		state: {
			shooting: false,
			playable: false,
		}
	};



	Game.prototype.intro = function() {
		this.titleScreen = new PIXI.Sprite(PIXI.Texture.fromFrame('title.png'));
		this.stage.addChild(this.titleScreen);
		this.titleScreen.scale.x = this.titleScreen.scale.y = 1.4;
		this.titleScreen.position.x = this.renderer.width * 0.5 - this.titleScreen.width * 0.5;

		this.introTl = new TimelineMax({onComplete: this.onIntroComplete.bind(this)});
		// this.introTl = new TimelineMax({onComplete: this.onGameComplete.bind(this)});
		this.introTl.insert(TweenMax.fromTo(this.pixelate.size, 2, {x: 100, y: 100}, {x: 1, y: 1}), 1);
		this.introTl.insert(TweenMax.fromTo(this.titleScreen.position, 2, {y: -500}, {y: this.renderer.height * 0.5 - this.titleScreen.height * 0.5, ease: Sine.easeOut}), 0);
		this.introTl.insert(TweenMax.to(this.titleScreen.position, 2, {y: this.renderer.height + 20, ease: Sine.easeIn}), 4);
		this.introTl.insert(TweenMax.fromTo(this.player.position, 4, {y: -500}, {y: this.renderer.height - this.player.height - 10, ease: Sine.easeOut}), 4.5);
	};

	Game.prototype.onIntroComplete = function() {
		this.floor.filters = null;
		this.trees.filters = null;

		this.stage.filters = [this.pixelate];
		this.stage.removeChild(this.titleScreen);
		this.dialogTexts = [
			{ t: "* Whistle, Whistle... *"},
			{ t: "* ...blow my whistle baby... *"}
		];
		this.dialog = new Dialog(this.dialogTexts);
		this.stage.addChild(this.dialog);
		this.dialog.position.y = 400;
		this.dialog.dialogCompletedSignal.addOnce(this.startTutorial.bind(this));
	};

	Game.prototype.startTutorial = function() {
		this.soundLetitsnow.fadeOut(1, function(){
			this.soundLetitsnow.stop();
		}.bind(this));
		this.soundRtype;
		this.soundRtype.setVolume(50).play().loop();

		this.stage.removeChild(this.dialog);

		this.setNewObjective();
		this.player.jump();

		this.dialogTexts = [
			{ t: "WAIT WHAT?!"},
			{ t: "One of this Gingerbread man again?!"},
			{ t: "I hate them they smell so bad!"},
			{ t: "Shu, shu, go away!"},
		];
		this.dialog = new Dialog(this.dialogTexts);
		this.stage.addChild(this.dialog);
		this.dialog.dialogCompletedSignal.addOnce(this.onTutorialComplete.bind(this));
	};

	Game.prototype.onTutorialComplete = function() {
		this.stage.removeChild(this.dialog);
		this.state.playable = true;
		this.scores.startTime();

	};

	Game.prototype.setNewObjective = function() {
		var objective = this.objectivesManager.getCurrentObjective();
		if(objective) {
			objective.completedSignal.add(this.onObjectiveCompleted.bind(this));

			var distribution = this.distributor.distribute(this.renderer.width - 256, this.renderer.height * 0.5, 92, objective.initialState.nbEnnemies);
			
			if(distribution.length < objective.initialState.nbEnnemies){
				objective.setInitNbEnnemies(distribution.length);
			}
			for(var i = 0; i < objective.initialState.nbEnnemies; i++) {
				if(objective.isBoss) {
					this.createBoss();
				}
				else {
					this.createEnnemy(distribution[i].x + 128, distribution[i].y);
				}
			}
			if(objective.dialog){
				if(this.dialog && this.stage.children.indexOf(this.dialog) != -1) this.stage.removeChild(this.dialog);
				this.dialog = new Dialog(objective.dialog);
				this.stage.addChild(this.dialog);
				if(objective.initialState.nbEnnemies <= 0) {
					this.dialog.dialogCompletedSignal.addOnce(objective.checkCompletion.bind(objective));					
				}
			}
		}
		else {
			this.onGameComplete();
		}
	};

	Game.prototype.onObjectiveCompleted = function() {
		this.setNewObjective();
	};

	Game.prototype.onGameComplete = function() {
		this.scores.stopTime();
		this.state.playable = false;
		this.player.jump();
		this.tlEnd = new TimelineMax({onComplete: this.showScores, onCompleteScope: this});
		this.tlEnd.insert(TweenMax.to(this.player.position, 0.3, {x: this.renderer.width * 0.5 - this.player.width * 0.5, ease: Sine.easeIn}), 0);
		this.tlEnd.insert(TweenMax.to(this.player.position, 3, {y: -300, ease: Sine.easeIn}), 0.5);
	};

	Game.prototype.showScores = function() {
		this.scoresDisplay = new ScoresDisplay(this.renderer.width, this.scores.damage, this.scores.totalTime, this.scores.getTotalScore());
		this.stage.addChild(this.scoresDisplay);
		TweenMax.fromTo(this.scoresDisplay.position, 2, {y: -500}, {y: this.renderer.height * 0.5 - this.scoresDisplay.height * 0.5});
	};

	Game.prototype.onMouseClick = function() {
		if(this.dialog) this.dialog.onClick();
	};

	/*===============================================================
		ENTITY CREATION
	===============================================================*/
	Game.prototype.createEnnemy = function(x, y) {
		var ennemy = new Gingerbread();
		ennemy.position.x = this.renderer.width * 0.5;
		ennemy.position.y = -100;
		ennemy.spawn(x, y);
		this.stage.addChild(ennemy);
		this.ennemies.push(ennemy);
	};

	Game.prototype.createBoss = function(x, y) {
		var boss = new Boss();
		boss.position.x = this.renderer.width * 0.5 - boss.width * 0.5;
		boss.position.y = -400;
		boss.spawn(this.renderer.width * 0.5 - boss.width * 0.5, 50);
		this.stage.addChild(boss);
		this.ennemies.push(boss);
	};

	Game.prototype.createBullets = function() {
		this.nextShoot = this.shootFrequency;

		var bulletLeft = this.bullets.getEntity();
		bulletLeft.position.x = this.player.position.x + 40;
		bulletLeft.position.y = this.player.position.y;
		this.stage.addChild(bulletLeft);

		var bulletRight = this.bullets.getEntity();
		bulletRight.position.x = this.player.position.x + this.player.width - 75;
		bulletRight.position.y = this.player.position.y;
		this.stage.addChild(bulletRight);

		this.player.shoot();
	};

	Game.prototype.createShrapnel = function(dyingEntity) {
		var shrap, spawnZone, angle, dest;
		var radius = 100;
		var nbShrapnel = this.objectivesManager.getCurrentObjective().nbShrapnels;

		for(var i = 0; i < nbShrapnel; i++) {
			spawnZone = new PIXI.Rectangle(dyingEntity.position.x + dyingEntity.hitArea.x, dyingEntity.position.y + dyingEntity.hitArea.y, dyingEntity.hitArea.width, dyingEntity.hitArea.height);
			shrap = this.shrapnels.getEntity(spawnZone);
			this.stage.addChild(shrap);

			angle = Math.random() * Math.PI * 2;
			dest = new PIXI.Point(spawnZone.x + spawnZone.width * 0.5 + Math.cos(angle) * radius, spawnZone.y + spawnZone.height * 0.5 + Math.sin(angle) * radius);
			TweenMax.to(shrap.position, 1 * Math.random(), {x: dest.x, y: dest.y, ease: Expo.easeOut, onComplete: this.shrapnelStartPursue, onCompleteParams: [shrap], onCompleteScope: this});
		}
	};

	Game.prototype.attemptShoot = function() {
		if(this.nextShoot <= 0) this.createBullets();
		else this.nextShoot--;
	};

	/*===============================================================
		UPDATING ENTITIES
	===============================================================*/
	Game.prototype.updateBullet = function(bullet) {
		bullet.update();

		if(bullet.position.y < -bullet.height) {
			this.killBullet(bullet);
			return;
		}

		for(var i = 0, l = this.ennemies.length; i < l; i++) {
			if(bullet.hitTest(this.ennemies[i])) {
				this.killEnnemy(this.ennemies[i]);
			    this.killBullet(bullet);
				break;
			}
		}
	};

	Game.prototype.updateShrapnel = function(shrapnel) {
		shrapnel.update();
		if(shrapnel.position.y > this.height) {
			this.killShrapnel(shrapnel);
			return;
		}
		if(shrapnel.hitTest(this.player)) {
			this.killShrapnel(shrapnel);
			this.player.hit();
			this.scores.damage++;
			this.soundHurt.setTime(0).play();
			TweenMax.fromTo(this.pixelate.size, 0.4, {x: 50, y: 50}, {x: 1, y: 1})
		}
	};

	/*===============================================================
		DESTROYING ENTITIES
	===============================================================*/
	Game.prototype.killShrapnel = function(shrapnel) {
		this.objectivesManager.killShrapnel();
		this.shrapnels.killEntity(shrapnel);
	};

	Game.prototype.killBullet = function(bullet) {
		this.bullets.killEntity(bullet);
	}

	Game.prototype.killEnnemy = function(ennemy) {
		ennemy.hit();
		this.soundDie.setVolume(30).setTime(0).play();
		if(ennemy.life <= 0) {
			this.createShrapnel(ennemy);
			this.ennemies.splice(this.ennemies.indexOf(ennemy), 1);
			this.objectivesManager.updateCurrentObjective();
		}
	};

	/*===============================================================
		STUFF
	===============================================================*/
	Game.prototype.shrapnelStartPursue = function(shrap) {
		shrap.angle = Math.PI * 0.5 - Math.atan((this.player.position.x + this.player.width * 0.5 - shrap.position.x) / (this.player.position.y + this.player.height * 0.5 - shrap.position.y) );
		shrap.isReady = true;
	};

	/*===============================================================
		RESIZE
	===============================================================*/
	Game.prototype.resize = function(width, height) {
		this.floor.resize(width, height);
		this.trees.resize(width, height);
		this.renderer.resize(width, height);
	};

	/*===============================================================
		MAIN UPDATE LOOP
	===============================================================*/
	Game.prototype.update = function() {
		this.t += 1;
		if(this.t > 10000) this.t = 0;
		if(this.mouse.x < 0) this.mouse.x = 0;
		if(this.mouse.x > this.renderer.width) this.mouse.x = this.renderer.width;
		this.floor.update();
		this.trees.update();
		this.bullets.each(this.updateBullet.bind(this));
		this.shrapnels.each(this.updateShrapnel.bind(this));

		if(this.state.playable) {
			if(this.state.shooting) this.attemptShoot();
			this.player.update(this.t * 0.1, this.mouse.x);

			for (var i = this.ennemies.length - 1; i >= 0; i--) {
				this.ennemies[i].update();
			}
		}
		else {
			this.player.updateParticles(this.t * 0.1);
		}
		if(this.dialog){
			this.dialog.position.x = this.player.position.x + this.player.width * 0.75;
			this.dialog.position.y = this.player.position.y;
		}

		this.renderer.render(this.stage);
	};


	return Game;
})();