###
# CubicBezier - Bezier
# Simple class for cubic bezier ( curve define by 4 points )
# @author David Ronai aka Makio64 // makiopolis.com
###


class CubicBezier
		
	p0			: null #Point
	p1			: null #Point
	p2			: null #Point	
	p3			: null #Point	
		
	# ================== CONSTRUCTOR ======================
		
	constructor:(p0, p1, p2, p3) ->	
		@p3 = p3;
		@p2 = p2;
		@p1 = p1;
		@p0 = p0;	
		
	# ================== DISPOSE ==========================
		
	dispose:()->
		@p0.dispose()
		@p1.dispose()
		@p2.dispose()
		@p3.dispose()

		@p3 = null
		@p2 = null
		@p1 = null
		@p0 = null

		
	# ================== PUBLIC METHODS ===================
		
	# Learn more about this on wikipedia
	getBezierPoint:(t=0.0)->
		# Look at wikipedia :
		# http://en.wikipedia.org/wiki/B%C3%A9zier_curve#Cubic_B.C3.A9zier_curves
		return new Point( Math.pow(1 - t, 3) * @p0.x + 3 * t * Math.pow(1 - t, 2) * @p1.x + 3 * t * t * (1 - t) * @p2.x + t * t * t * @p3.x, Math.pow(1 - t, 3) * @p0.y + 3 * t * Math.pow(1 - t, 2) * @p1.y + 3 * t * t * (1 - t) * @p2.y + t * t * t * @p3.y)