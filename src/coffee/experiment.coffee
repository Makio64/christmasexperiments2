initUI = ->
	#share option
	description = document.getElementsByName('description')[0].getAttribute('content');
	# window.open('http://www.facebook.com/sharer.php?u=' + encodeURIComponent(location.href) + '&t=' + encodeURIComponent(document.title), 'Share us on facebook', 'toolbar=0,status=0,width=548,height=325');
	
	# $('.s').on 'click', onClickHandler
	null

onClickHandler = ( e ) =>
	console.log e
	window.open('https://twitter.com/share?url=http://google.com')
	null

openSharer = ->

	null


$ ->
	initUI()