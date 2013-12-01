XMAS = 
	body: null
	timer: null
	
class Main

	stage 			: null
	renderer 		: null
	dt 				: 0
	lastTime 		: 0
	pause 			: false

	constructor:()->		
		@pause = false
		# @stage = new PIXI.Stage(0xFFFFFF, true)
		# @renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, null)
		# @renderer.view.style.display = "block"
		# @renderer.view.className = "renderer"
		# SceneTraveler.getInstance().travelTo(new LoadScene(@stage))
		@lastTime = Date.now()

		# $("#main").append(@renderer.view)

		window.focus()
		@resize()
		$("#title").addClass("activate")
		@first = true
		$("#dayProject").addClass("activate")
		setTimeout(@stabilize,5000)
		requestAnimationFrame( @animate )
		return

	animate:()=>
		if @first
			$("#featured").addClass("activate")
			@resize()
			@first = false

		if @pause
			t = Date.now()
			dt = t - @lastTime
			@lastTime = t
			return
		
		requestAnimationFrame( @animate )
		t = Date.now()
		dt = t - @lastTime
		@lastTime = t

		return

	resize:()->
		w = window.innerWidth
		h = window.innerHeight
		if w > 900
			w2 = (w - 522)
			if w2 > 713
				$("#featured").css("width", "50%");
				# $("#featured .content").css("backgroundSize", "auto auto")
			else
				$("#featured").css("width", w2+"px");
				# $("#featured .content").css("backgroundSize", "auto auto")

				
			
		else 
			$("#featured").css("width", Math.ceil(w/2)+"px");
		# @renderer.resize(window.innerWidth,window.innerHeight)

		return

	stabilize:()->
		$("#title").addClass("stable")
		$("#dayProject").addClass("stable")
		$("#featured").addClass("stable")


$ ->
	main = new Main()
	
	$(window).blur(()->
		main.pause = true
		cancelAnimationFrame(main.animate)
	)

	$(window).focus(()->
		requestAnimationFrame( main.animate )
		main.lastTime = Date.now()
		main.pause = false
	)

	$(window).resize(()=>
		main.resize()
	)
	return