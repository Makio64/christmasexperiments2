###
# Bezier
# Quadratic bezier ( curve define by 3 points )
# @author David Ronai aka Makio64 // makiopolis.com
###

class Bezier
		
	p0			: null #Point
	p1			: null #Point
	p2			: null #Point	
		
	# ================== CONSTRUCTOR ======================
		
	constructor:(@p0, @p1, @p2) ->
		
	# ================== DISPOSE ==========================
		
	dispose:()->
		@p0.dispose()
		@p1.dispose()
		@p2.dispose()

		@p2 = null
		@p1 = null
		@p0 = null

		
	# ================== PUBLIC METHODS ===================
		
	# Learn more about this on wikipedia
	# http://en.wikipedia.org/wiki/B%C3%A9zier_curve
	getBezierPoint:(t = 0.0)->
		x = Math.pow(1 - t, 2) * @p0.x + 2 * t * (1 - t) * @p1.x + Math.pow(t, 2) * @p2.x
		y = Math.pow(1 - t, 2) * @p0.y + 2 * t * (1 - t) * @p1.y + Math.pow(t, 2) * @p2.y

		return new Point(x,y)

	toCubic:()->
		points = []
		new1 = new Point( ( @p1.x + @p0.x ) * .5, ( @p1.y + @p0.y ) * .5 )
		new2 = new Point( ( @p2.x + @p1.x ) * .5, ( @p2.y + @p1.y ) * .5 )
		points[ 0 ] = new Point(@p0.x,@p0.y)
		points[ 1 ] = new1
		points[ 2 ] = new2
		points[ 3 ] = new Point(@p2.x,@p2.y)
		
		return points

	@toBezier = (points, division = 10) =>
		cubic = []
		finalPoints = []

		# Generate Cubic Bezier Curve from Quadratic Bezier Curve
		for i in [0...points.length-1] by 1
			p1 = points[i]
			p2 = points[(i+1)%points.length]
			p3 = points[(i+2)%points.length]
			b = new Bezier(p1,p2,p3)
			c = b.toCubic()
			cubic.push(p1) 
			cubic.push(c[1]) 

		#start from 1, not from 0 because it s not cubic curve
		for i in [1...cubic.length-3] by 2
			p1 = cubic[i]
			p2 = cubic[i+1]
			p3 = cubic[i+2]
			# Use normal bezier
			b = new Bezier(p1,p2,p3)
			for t in [0.0...1.0] by 1.0/division
				finalPoints.push(b.getBezierPoint(t))

		return finalPoints