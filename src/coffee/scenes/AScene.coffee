class AScene

	stage 				: null
	callback			: null

	constructor:(@stage)->
		return

	transitionIn:(@callback)->
		@onTransitionInComplete()
		return

	transitionOut:(@callback)->
		@onTransitionOutComplete()
		return

	onTransitionOutComplete:()->
		@callback()
		return

	onTransitionInComplete:()->
		@callback()
		return

	onEnter:()->
		return
	
	onExit:()->
		return

	update:(dt)->
		return

	resize:(width, height)->
		return

	dispose:()->
		@stage 		= null
		@callback 	= null
		return