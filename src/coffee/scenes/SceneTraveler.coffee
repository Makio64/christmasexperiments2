class SceneTraveler

	currentScene 	: null
	nextScene		: null

	transitioning	: false

	instance 		= null

	@getInstance =()->
		instance ?= new SceneTraveler()
		return instance

	travelTo:(scene)=>
		@nextScene = scene

		if(@currentScene != null)
			@currentScene.transitionOut(@onTransitionOutComplete)
		else
			@onTransitionOutComplete()
		
		return


	onTransitionOutComplete:()=>
		if @currentScene != null 
			@currentScene.onExit()
			@currentScene.dispose()
		
		@currentScene = @nextScene
		@currentScene.onEnter()
		@currentScene.transitionIn(@onTransitionInComplete)

		@nextScene = null
		return

	onTransitionInComplete:()=>
		return