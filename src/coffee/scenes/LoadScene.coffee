class LoadScene extends AScene


	constructor:(stage)->
		super(stage)
		return


	onEnter:()->
		@loadData()
		SceneTraveler.getInstance().travelTo(new StartScene(@stage))
		return


	loadData:()=>
		# urlList = [
		# 	"./data/spritesheet.png"
		# ]
		# DataManager.instance.load(urlList, @loadSound)
		return


	loadPixiAsset:()=>
		# urlList = [
		# 	"./fonts/Font name-sd.fnt"
		# 	# "./img/spritesheet.json"
		# ]
		# loader = new PIXI.AssetLoader(urlList)
		# loader.onComplete = @loadSound
		# loader.load()
		return


	loadSound:()=>
		# urlList = [
		# 	"./sfx/intro.mp3"
		# 	"./sfx/loop.mp3"
		# ]
		# SndFX.instance.load(urlList,@onSoundLoaded)
		return


	onSoundLoaded:()=>
		SceneTraveler.getInstance().travelTo(new GameScene(@stage))
		return