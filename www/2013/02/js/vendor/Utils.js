
var Utils = Utils || ( function () {

	var _public = {}

	function resizeImage( parent, image, w, h ) {
		var $parent = parent instanceof jQuery ? parent : $( parent )
		,	$image = image instanceof jQuery ? image : $( image );

		var wParent = $parent.width()
	    ,   hParent = $parent.height()
	    ,   wImage = w || $image.width()
	    ,   hImage = h || $image.height()

	    ,   rw = wImage / wParent
	    ,   rh = hImage / hParent
	    ,   ratio = rw < rh ? rw : rh;

	    var w = 0, h = 0;
	    if( ratio >= 1 ) {
	        w = wImage / ratio;
	        h = hImage / ratio;
	    } else {
	    	ratio = ratio == rw ? wParent / wImage : hParent / hImage;
	        w = wImage * ratio;
	        h = hImage * ratio;
	    }

	    var px = wParent - w >> 1
	    ,   py = hParent - h >> 1;

	    $image.width( w );
	    $image.height( h );
	    $image.css( {
	        position: "relative"
	    ,   left: px + "px"
	    ,   top: py + "px"
	    } );
	}

    function resize( wDest, hDest, wSrc, hSrc ) {

        var rw = wSrc / wDest
        ,   rh = hSrc / hDest
        ,   ratio = rw < rh ? rw : rh;

        var w = 0, h = 0;
        if( ratio >= 1 ) {
            w = wSrc / ratio;
            h = hSrc / ratio;
        } else {
            ratio = ratio == rw ? hDest / wSrc : hDest / hSrc;
            w = wSrc * ratio;
            h = hSrc * ratio;
        }

        var x = wDest - w >> 1
        ,   y = hDest - h >> 1;

        return { x: x, y: y, w: w, h: h }
    }

	_public.resizeImage = resizeImage;
    _public.resize = resize;

	return _public;

})();
