window.XMAS = 
	width: 0
	height: 0
	body: null
	thumbs: null
	timer: null

	init: ->
		@width 	= window.innerWidth
		@height = window.innerHeight
		@body 	= document.body
		@thumbs	= []

		$('.experiment').each (idx, obj ) =>
			@thumbs.push obj

		@initEvents()

		@showThumbs()

		null

	

	showThumbs: ( evt ) =>
		idx = -1

		if @.XMAS.thumbs.length == 0
			$( window ).off 'scroll'
		
		for i in [ 0 ... @.XMAS.thumbs.length ]
			thumb = @.XMAS.thumbs[i]
			if ( thumb.offsetTop > document.body.scrollTop  && ( thumb.offsetTop + 420 ) <= document.body.scrollTop + window.innerHeight ) || $('.experiment-24').hasClass 'show'
				$(thumb).addClass 'show' if thumb.className != "experiment show"
				idx = i
		
		if idx != -1
			@.XMAS.thumbs.splice(idx,1);
			idx = -1

		null



	initEvents: =>
		$( window ).on 'scroll', @.XMAS.showThumbs

		null

$ ->
	
	XMAS.init()

	# window.addEventListener

	null