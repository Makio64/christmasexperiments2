class CanvasUtils

	@fromImage:(image)->
		canvas 			= document.createElement('canvas')
		canvas.width 	= image.width
		canvas.height 	= image.height
		context 		= canvas.getContext('2d')
		context.width 	= image.width
		context.height 	= image.height
		context.drawImage(image, 0, 0)
		return canvas

	@dataFromImage:(image)->
		return CanvasUtils.fromImage(image).getContext('2d').getImageData(0, 0, image.width, image.height)
