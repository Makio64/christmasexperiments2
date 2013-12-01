iframe = null

resize = ->
	iframe.width window.innerWidth
	iframe.height window.innerHeight - 50

	null

$ ->
	iframe = $('iframe')

	$(window).on 'resize', resize
		

	$('.more').on 'click', () =>
		if $('.calendar').hasClass 'show'
			$('.more').removeClass 'opened'
			$('.calendar').removeClass 'show'
		else 
			$('.more').addClass 'opened'
			$('.calendar').addClass 'show'

	resize()