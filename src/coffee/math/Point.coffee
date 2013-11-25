class Point

	x 		: 0.0
	y 		: 0.0

	constructor: (@x, @y) ->
		return

	euclidean = (p1, p2) ->
		a = p1?.x - p2?.x
		b = p1?.y - p2?.y

		return Math.sqrt Math.pow(a, 2) + Math.pow(b, 2)

	add:(p)->
		@x += p.x
		@y += p.y

	sub:(p)->
		@x -= p.x
		@y -= p.y

	scale:(value)->
		@x *= value
		@y *= value

	draw: (ctx) -> 
		ctx.fillStyle = '#FFFFFF'
		ctx.fillRect @x, @y, 1, 1
		return

	toString: -> 
		return "(#{@x}, #{@y})"

	dispose:()->
		return