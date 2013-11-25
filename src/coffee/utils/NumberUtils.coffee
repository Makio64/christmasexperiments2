class NumberUtils

	constructor:()->
		throw new Error "you can t create an instance of NumberUtils"

	@addZero:(string, minLenght)->
		string += ""
		while(string.length < minLenght)
			string = "0"+string
		return string