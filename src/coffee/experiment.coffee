iframe = null

$ ->
	iframe = $('iframe')
	$(window).on 'resize', () =>
		iframe.width window.innerWidth
		iframe.height window.height - 50