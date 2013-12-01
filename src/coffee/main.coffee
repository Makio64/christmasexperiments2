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


	initSocial: ->

		# Facebook
		`(function(d, s, id) {
	          var js, fjs = d.getElementsByTagName(s)[0];
	          if (d.getElementById(id)) return;
	          js = d.createElement(s); js.id = id;
	          js.src = "//connect.facebook.net/fr_FR/all.js#xfbml=1&appId=220813356385";
	          fjs.parentNode.insertBefore(js, fjs);
	        }(document, 'script', 'facebook-jssdk'));`
		# Twitter
		`!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');`

		null
	

	showThumbs: ( evt ) =>
		idx = -1

		if @.XMAS.thumbs.length == 0
			$( window ).off 'scroll'

			initSocial()
		
		for i in [ 0 ... @.XMAS.thumbs.length ]
			thumb = @.XMAS.thumbs[i]
			if ( thumb.offsetTop > document.body.scrollTop  && ( thumb.offsetTop + 200 ) <= document.body.scrollTop + window.innerHeight ) || $('.experiment-24').hasClass 'show'
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

	# Facebook
	`(function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s); js.id = id;
          js.src = "//connect.facebook.net/fr_FR/all.js#xfbml=1&appId=220813356385";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));`
	# Twitter
	`!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');`

	null